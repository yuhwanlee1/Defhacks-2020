activate_this = '/var/www/flaskapp/env/bin/activate_this.py'
execfile(activate_this, dict(__file__=activate_this))
from flaskapp import app as application
