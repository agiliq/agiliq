import os
import time
import getpass

from fabric.api import *
from fabric.contrib import files
from fabric.context_managers import prefix

from contextlib import contextmanager as _contextmanager

env.warn_only = True
env.hosts = ['agiliq@198.58.97.129']

env.USER = "agiliq"
env.HOME = "/home/%s" % env.USER
env.BASE_PATH = "%s/build" % env.HOME
env.VIRTUALENV_PATH = "%s/env" % env.HOME
env.VIRTUALENV_ACTIVATE = "%s/bin/activate" % env.VIRTUALENV_PATH
env.BOOKS_PATH = "%s/books" % env.BASE_PATH
env.DOCS_PATH = "%s/docs" % env.BASE_PATH

env.REPO = "git://github.com/agiliq/agiliq.git"
env.ROOT_PATH = "%s/agiliq" % env.BASE_PATH
env.DJANGO_PATH = "%s/agiliqcom" % env.ROOT_PATH
env.REQUIREMENTS_PATH = "%s/requirements.txt" % env.DJANGO_PATH
env.NGINX_CONF = "%s/deploy/agiliq.nginx.conf" % env.DJANGO_PATH
env.APACHE2_CONF = "%s/deploy/agiliq_newsletter.apache.conf" % env.DJANGO_PATH
env.APACHE2_PORTS_CONF = "%s/deploy/ports.conf" % env.DJANGO_PATH
env.SUPERVISOR_CONF = "%s/deploy/agiliq.supervisor.conf" % env.DJANGO_PATH
env.SOUTH_ENABLED = True
env.BACKUP_PATH = "%s/backups" % env.HOME

env.activate = "source %s" % env.VIRTUALENV_ACTIVATE


def graphos():
    env.SUPERVISOR_CONF = "%s/deploy/graphos.supervisor.conf" % env.DJANGO_PATH

    env.REPO = "git://github.com/agiliq/django-graphos.git"
    env.ROOT_PATH = "%s/django-graphos" % env.BASE_PATH
    env.DJANGO_PATH = "%s/demo_project" % env.ROOT_PATH
    env.REQUIREMENTS_PATH = "%s/requirements.txt" % env.DJANGO_PATH
    env.SOUTH_ENABLED = False


@_contextmanager
def virtualenv():
    with cd(env.DJANGO_PATH):
        with prefix(env.activate):
            yield


def setup_virtualenv():
    if not files.exists(env.VIRTUALENV_PATH):
        run("virtualenv %s" % env.VIRTUALENV_PATH)


def setup_nginx():
    sudo("cp %s /etc/nginx/sites-enabled/" % env.NGINX_CONF)


def setup_apache2():
    sudo("cp %s /etc/apache2" % env.APACHE2_PORTS_CONF)
    sudo("cp %s /etc/apache2/sites-enabled" % env.APACHE2_CONF)


def setup_supervisor():
    sudo("cp %s /etc/supervisor/conf.d/" % env.SUPERVISOR_CONF)


def install_packages():
    sudo("apt-get install -y make git nginx python-pip \
            python-virtualenv python-dev python-sphinx libmysqlclient-dev \
            supervisor memcached mysql-server mysql-client mongodb-server \
            apache2 apache2-mpm-prefork libapache2-mod-php5 php5-mysql")
    sudo("pip install --upgrade pip virtualenv")


def configure_django_settings():
    with cd(env.DJANGO_PATH):
        if not files.exists("localsettings.py") and files.exists("localsettings.py-dist"):
            run("cp localsettings.py-dist localsettings.py")


def build_sphinx(github_path, type="book", docs=".", build="build"):
    with virtualenv():
        with cd(env.BASE_PATH):
            _, repo = github_path.split("/")
            if not files.exists("%s/%s" % (env.BASE_PATH, repo)):
                run("git clone --recursive git://github.com/%s.git" % github_path)
            with cd("%s/%s" % (env.BASE_PATH, repo)):
                run("git pull")
                with cd(docs):
                    run("make html")
                    path = {
                        "book": env.BOOKS_PATH,
                        "docs": env.DOCS_PATH
                    }.get(type)
                    if not files.exists(path):
                        run("mkdir -p %s" % path)
                    run("rm -rf %s/%s" % (path, repo))  # remove old sphinx build
                    run("mv %s/html %s/%s" % (build, path, repo))


def git_clone():
    if not files.exists(env.ROOT_PATH):
        if not files.exists(env.BASE_PATH):
            run("mkdir -p %s" % env.BASE_PATH)
        with cd(env.BASE_PATH):
            run("git clone %s" % env.REPO)


def git_pull():
    with cd(env.ROOT_PATH):
        run("git pull")


def install_requirements():
    with virtualenv():
        run("pip install --upgrade -r %s" % env.REQUIREMENTS_PATH)


def supervisor_restart():
    sudo("supervisorctl reread")
    sudo("supervisorctl restart agiliq:gunicorn_agiliq")


def collect_static():
    with virtualenv():
        run("python manage.py collectstatic --noinput")


def thumbnail_reset():
    with virtualenv():
        run("python manage.py thumbnail clear")
        run("python manage.py thumbnail cleanup")


def migrate_db(fake=False):
    with virtualenv():
        if env.SOUTH_ENABLED:
            if fake:
                run("python manage.py migrate --fake")
            else:
                run("python manage.py migrate")


def sync_db(all=False):
    with virtualenv():
        if all and env.SOUTH_ENABLED:
            run("python manage.py syncdb --all --noinput")
        else:
            run("python manage.py syncdb --noinput")


def nginx_restart():
    sudo("service nginx restart")


def mysql_restart():
    sudo("service mysql restart")


def apache2_restart():
    sudo("service apache2 restart")


def mysql_backup(database):
    require('DB_USER')
    require('DB_PASS')

    date = time.strftime('%Y%m%d%H%M%S')
    fname = '%(location)s/%(database)s-backup-%(date)s.sql.gz' % {
        'location': env.BACKUP_PATH,
        'database': database,
        'date': date
    }

    if files.exists(fname):
        run('rm "%s"' % fname)

    run('mysqldump -u %(username)s -p%(password)s %(database)s | '
        'gzip > %(fname)s' % {'username': env.DB_USER,
                              'password': env.DB_PASS,
                              'database': database,
                              'fname': fname})

    get(fname, os.path.basename(fname))


def mysql_restore(dump):
    require('DB_USER')
    require('DB_PASS')

    database = dump.split('-')[0]
    if not files.exists("%s/%s" % (env.BACKUP_PATH, dump)):
        put(dump, env.BACKUP_PATH)

    run("echo 'CREATE DATABASE IF NOT EXISTS %(database)s' | mysql -u %(username)s -p%(password)s" %
        {
            'username': env.DB_USER,
            'password': env.DB_PASS,
            'database': database,
        })

    run('gunzip < %(backup)s/%(dump)s | mysql -u %(username)s -p%(password)s %(database)s' %
        {
            'username': env.DB_USER,
            'password': env.DB_PASS,
            'database': database,
            'backup': env.BACKUP_PATH,
            'dump': dump
        })


def provision():
    install_packages()
    git_clone()
    git_pull()
    setup_virtualenv()
    setup_nginx()
    setup_supervisor()
    configure_django_settings()
    install_requirements()
    sync_db(all=True)
    migrate_db(fake=True)


def deploy():
    git_pull()
    install_requirements()
    collect_static()
    sync_db()
    thumbnail_reset()
    migrate_db()
    supervisor_restart()
    nginx_restart()


def quick_deploy():
    git_pull()
    supervisor_restart()
    nginx_restart()


def all():

    provision()
    deploy()

    build_sphinx("agiliq/djenofdjango")
    build_sphinx("agiliq/django-design-patterns")
    build_sphinx("agiliq/django-gotchas")
    build_sphinx("agiliq/merchant", type="docs", docs="docs", build="_build")

    graphos()
    provision()
    deploy()


if __name__ == "__main__":
    deploy()
