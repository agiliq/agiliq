import os
import getpass

from fabric.api import *
from fabric.contrib import files
from fabric.context_managers import prefix

from contextlib import contextmanager as _contextmanager

env.warn_only = True
env.hosts = ['agiliq@agiliq.com']

env.USER = "agiliq"
env.HOME = "/home/%s" % env.USER
env.REPO = "git://github.com/agiliq/agiliq.git"
env.BASE_PATH = "%s/build" % env.HOME
env.VIRTUALENV_PATH = "%s/env" % env.HOME
env.VIRTUALENV_ACTIVATE = "%s/bin/activate" % env.VIRTUALENV_PATH
env.ROOT_PATH = "%s/agiliq" % env.BASE_PATH
env.DJANGO_PATH = "%s/agiliqcom" % env.ROOT_PATH
env.REQUIREMENTS_PATH = "%s/requirements.txt" % env.DJANGO_PATH
env.GUNICORN_PID = "%s/pid/gunicorn.pid" % env.DJANGO_PATH
env.NGINX_CONF = "%s/deploy/agiliq.com.conf" % env.DJANGO_PATH
env.SUPERVISOR_CONF = "%s/deploy/agiliq.supervisor.conf" % env.DJANGO_PATH
env.BOOKS_PATH = "%s/books" % env.BASE_PATH

env.activate = "source %s" % env.VIRTUALENV_ACTIVATE


@_contextmanager
def virtualenv(path=env.DJANGO_PATH):
    with cd(path):
        with prefix(env.activate):
            yield


def setup_virtualenv():
    if not files.exists(env.VIRTUALENV_PATH):
        run("virtualenv %s" % env.VIRTUALENV_PATH)


def setup_nginx():
    sudo("cp %s /etc/nginx/sites-enabled/" % env.NGINX_CONF)


def setup_supervisor():
    sudo("cp %s /etc/supervisor/conf.d/" % env.SUPERVISOR_CONF)


def install_packages():
    sudo("apt-get install -y git nginx python-pip python-virtualenv python-dev python-sphinx libmysqlclient-dev supervisor")
    sudo("pip install --upgrade pip virtualenv")


def configure_django_settings():
    with cd(env.DJANGO_PATH):
        run("cp localsettings.py-dist localsettings.py")


def build_book(book):
    with cd(env.BASE_PATH):
        _, repo = book.split("/")
        if not files.exists("%s/%s" %(env.BASE_PATH, repo)):
            run("git clone --recursive git://github.com/%s.git" % book)
        with virtualenv(repo):
            run("git pull")
            run("make html")
            if not files.exists(env.BOOKS_PATH):
                run("mkdir -p %s" % env.BOOKS_PATH)
            run("rm -rf %s/%s" % (env.BOOKS_PATH, repo))
            run("mv build/html %s/%s" % (env.BOOKS_PATH, repo))


def git_clone(repo=env.REPO):
    if not files.exists(env.ROOT_PATH):
        if not files.exists(env.BASE_PATH):
            run("mkdir -p %s" % env.BASE_PATH)
        with cd(env.BASE_PATH):
            run("git clone %s" % repo)


def git_pull():
    with cd(env.ROOT_PATH):
        run("git pull")


def install_requirements():
    with virtualenv():
        run("pip install --upgrade -r %s" % env.REQUIREMENTS_PATH)


def gunicorn_restart():
    if files.exists(env.GUNICORN_PID):
            run("kill `cat %s`" % env.GUNICORN_PID)
    with virtualenv():
        run("gunicorn_django -c deploy/gunicorn.conf.py", pty=False)


def supervisor_restart():
    sudo("supervisorctl restart agiliq:gunicorn_agiliq")


def collect_static():
    with virtualenv():
        run("python manage.py collectstatic --noinput")


def thumbnail_reset():
    with virtualenv():
        run("python manage.py thumbnail clear")
        run("python manage.py thumbnail cleanup")


def migrate_db():
    with virtualenv():
        run("python manage.py migrate")


def sync_db():
    with virtualenv():
        run("python manage.py syncdb --noinput")


def nginx_restart():
    sudo("service nginx restart")


def provision():
    install_packages()
    git_clone()
    git_pull()
    setup_virtualenv()
    setup_nginx()
    setup_supervisor()
    configure_django_settings()


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
    build_book("agiliq/djenofdjango")


if __name__ == "__main__":
    deploy()
