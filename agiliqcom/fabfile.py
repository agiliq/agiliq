from fabric.api import *
from fabric.context_managers import prefix
import os, getpass

env.warn_only = True
env.hosts = ['agiliq@agiliq.com']

def set_user():
    env.user_home = "/home/%s" % env.user
    env.ROOT_PATH = "%s/envs/agiliq_env/src/agiliqdotcom" % env.user_home

def git_pull():
    set_user()
    with cd(env.ROOT_PATH):
        run("git pull assembla-repo deploy")
        run("git checkout deploy")

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
    collect_static()
    sync_db()
    migrate_db()
    gunicorn_restart()

def quick_deploy():
    git_pull()
    gunicorn_restart()


if __name__ == "__main__":
    deploy()
