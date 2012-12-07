from fabric.api import *
from fabric.context_managers import prefix
import os, getpass

env.warn_only = True
env.hosts = ['agiliq@agiliq.com']


def set_user():
    env.user_home = "/home/%s" % env.user
    env.ROOT_PATH = "%s/envs/agiliq_env/src/agiliqdotcom" % env.user_home

def get_books():
    set_user()
    with cd(env.ROOT_PATH):
        run("mkdir book_sources")
        with cd("book_sources"):
            run("mkdir output")
            run("mkdir themes")
            run("git clone git://github.com/agiliq/django-design-patterns.git")
            run("git clone git://github.com/agiliq/djenofdjango.git")
            run("git clone git://github.com/agiliq/django-gotchas.git")
            with prefix("source ~/envs/agiliq_env/bin/activate"):
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
            run ("mv output/* ../static/books/")
        run("rm -rf book_sources")

def build_docs():
    set_user()
    with cd(env.ROOT_PATH):
        run("mkdir doc_sources")

        with cd("doc_sources"):
            run("mkdir themes")
            run("mkdir output")
            run("git clone git://github.com/agiliq/merchant.git")
            with cd("themes"):
                run("git clone git://github.com/agiliq/Fusion_Sphinx.git")
                run("mv Fusion_Sphinx agiliq")
            with prefix("source ~/envs/agiliq_env/bin/activate"):
                with cd("merchant/docs"):
                    run("make html")
                    run("mv _build/html ../../output/merchant")

            run("rm -rf ../static/docs/merchant/")
            run("mv output/* ../static/docs/")


def git_pull():
    set_user()
    with cd(env.ROOT_PATH):
        run("git pull assembla-repo deploy")
        run("git checkout deploy")

def install_requirements():
    set_user()
    with cd("%s/agiliqcom" % env.ROOT_PATH):
        with prefix("source ~/envs/agiliq_env/bin/activate"):
            run("pip install -r reqiirements.txt")


def gunicorn_restart():
    set_user()
    with cd(os.path.join("%s/agiliqcom" % env.ROOT_PATH, "pid")):
        run("kill `cat gunicorn.pid`")
    with cd("%s/agiliqcom" % env.ROOT_PATH):
        with prefix("source ~/envs/agiliq_env/bin/activate"):
            run("gunicorn_django -c gunicorn_cfg.py", pty=False)

def collect_static():
    set_user()
    with cd("%s/agiliqcom" % env.ROOT_PATH):
        with prefix("source ~/envs/agiliq_env/bin/activate"):
            run("python manage.py collectstatic")

def thumbnail_reset():
    set_user()
    with cd("%s/agiliqcom" % env.ROOT_PATH):
        with prefix("source ~/envs/agiliq_env/bin/activate"):
            run("python manage.py thumbnail clear")
            run("python manage.py thumbnail cleanup")

def migrate_db():
    set_user()
    with cd("%s/agiliqcom" % env.ROOT_PATH):
        with prefix("source ~/envs/agiliq_env/bin/activate"):
            run("python manage.py migrate")

def sync_db():
    set_user()
    with cd("%s/agiliqcom" % env.ROOT_PATH):
        with prefix("source ~/envs/agiliq_env/bin/activate"):
            run("python manage.py syncdb")

def deploy():
    git_pull()
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
