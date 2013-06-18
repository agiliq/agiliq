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

env.activate = "source %s" % env.VIRTUALENV_ACTIVATE


@_contextmanager
def virtualenv(path=env.DJANGO_PATH):
    with cd(path):
        with prefix(env.activate):
            yield


def setup_virtualenv():
    if not files.exists(env.VIRTUALENV_PATH):
        run("pip install --upgrade virtualenv")
        run("virtualenv %s" % env.VIRTUALENV_PATH)


def install_packages():
    sudo("apt-get install git python-dev libmysqlclient-dev")


def get_books():
    with cd(env.ROOT_PATH):
        run("mkdir book_sources")
        with cd("book_sources"):
            run("mkdir output")
            run("mkdir themes")
            run("git clone git://github.com/agiliq/django-design-patterns.git")
            run("git clone git://github.com/agiliq/djenofdjango.git")
            run("git clone git://github.com/agiliq/django-gotchas.git")
            with prefix("source %s" % env.VIRTUALENV_ACTIVATE):
                with cd("themes"):
                    run("git clone git://github.com/agiliq/Fusion_Sphinx.git")
                    run("mv Fusion_Sphinx agiliq")
                with cd("django-design-patterns"):
                    run("make html")
                    run("mv build/html ../output/djangodesignpatterns")
                with cd("djenofdjango/src"):
                    run("make html")
                    run("mv build/html ../../output/djenofdjango")
                with cd("django-gotchas/src"):
                    run("make html")
                    run("mv build/html ../../output/djangogotchas")
            run("rm -r ../static/books/djangodesignpatterns/")
            run("rm -r ../static/books/djenofdjango/")
            run("rm -r ../static/books/djangogotchas/")
            run("mv output/* ../static/books/")
        run("rm -rf book_sources")


def build_docs():
    with cd(env.ROOT_PATH):
        run("mkdir doc_sources")

        with cd("doc_sources"):
            run("mkdir themes")
            run("mkdir output")
            run("git clone git://github.com/agiliq/merchant.git")
            with cd("themes"):
                run("git clone git://github.com/agiliq/Fusion_Sphinx.git")
                run("mv Fusion_Sphinx agiliq")
            with prefix("source %s" % env.VIRTUALENV_ACTIVATE):
                with cd("merchant/docs"):
                    run("make html")
                    run("mv _build/html ../../output/merchant")

            run("rm -rf ../static/docs/merchant/")
            run("mv output/* ../static/docs/")


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


def gunicorn_restart():
    with cd(os.path.join("%s/agiliqcom" % env.ROOT_PATH, "pid")):
        run("kill `cat gunicorn.pid`")
    with virtualenv():
        run("gunicorn_django -c gunicorn_cfg.py", pty=False)


def collect_static():
    with virtualenv():
        run("python manage.py collectstatic")


def thumbnail_reset():
    with virtualenv():
        run("python manage.py thumbnail clear")
        run("python manage.py thumbnail cleanup")


def migrate_db():
    with virtualenv():
        run("python manage.py migrate")


def sync_db():
    with virtualenv():
        run("python manage.py syncdb")


def deploy():
    install_packages()
    git_clone()
    git_pull()
    setup_virtualenv()
    install_requirements()
    collect_static()
    thumbnail_reset()
    sync_db()
    migrate_db()
    gunicorn_restart()


def quick_deploy():
    git_pull()
    gunicorn_restart()


if __name__ == "__main__":
    deploy()
