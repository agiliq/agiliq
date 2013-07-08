![Agiliq](https://github.com/agiliq/agiliq/raw/master/branding/logo_300.png)

This is all the code which powers [agiliq.com](http://agiliq.com/).

A number of our apps are available at the agiliq.com site, and here via the requirements.txt

Some of our important apps we use are:

1. [Blogango](https://github.com/agiliq/django-blogango) at [http://agiliq.com/blog/](http://agiliq.com/blog/)
2. [Dinette](https://github.com/agiliq/Dinette) at [http://agiliq.com/forum/](http://agiliq.com/forum/)
3. [Graphos](https://github.com/agiliq/django-graphos) at [http://agiliq.com/demo/graphos/](http://agiliq.com/forum/)

Patches are welcome and gratefully accepted, for this site and everything else on our [Github](http://github.com/agiliq).

How to use this

1. Clone this repo.
2. mkdir logs
3. cp localsettings.example.py localsettings.py, add correct settings etc.
4. pip install -r requirements.txt (You use virtualenv, right?)


Deployment

1. `fab deploy` for the full monty.
2. `fab quickdeploy` if the db schema hasn't changed.
3. `fab build_books` for creating the books.
4. `fab build_docs` for creating the docs.
