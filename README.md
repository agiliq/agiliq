![Agiliq](https://github.com/agiliq/agiliq/raw/master/branding/logo_300.png)

This is all the code which powers [agiliq.com](https://agiliq.com/).

A number of our apps are available at the agiliq.com site, and here via the requirements.txt

Some of our important apps we use are:

1. [Blogango](https://github.com/agiliq/django-blogango) at [http://agiliq.com/blog/](https://agiliq.com/blog/)
2. [Merchant](https://github.com/agiliq/merchant) at [http://agiliq.com/blog/](https://agiliq.com/demo/merchant/)
3. [Dinette](https://github.com/agiliq/Dinette) at [http://agiliq.com/demo/dinette/](https://agiliq.com/demo/dinette/)
4. [Graphos](https://github.com/agiliq/django-graphos) at [http://agiliq.com/demo/graphos/](https://agiliq.com/demo/graphos/)

Patches are welcome and gratefully accepted, for this site and everything else on our [Github](http://github.com/agiliq).

How to use this

1. Clone this repo.
2. mkdir logs
3. cp localsettings.example.py localsettings.py, add correct settings etc.
4. pip install -r requirements.txt (You use virtualenv, right?)


Deployment
----------------

`git push heroku master`

This uses a custom multi buildpack. Heroku recommends using dj_static to serve static files, which we didn't like, so this is being served on gunicorn behind nginx. (Which is itself behind the heroku router, of course.)

