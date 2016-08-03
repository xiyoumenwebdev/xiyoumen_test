# -*- coding: utf-8 -*-
"""
xiyoumenapp.__init__
~~~~~~~~~~~~~~

Initial module define webapp and this app's settings

:copyright: (c) 2016 by ERIC ZHAO.
:license: 
"""

import os

from flask import Flask
from flask_sqlalchemy import SQLAlchemy

from xiyoumenapp import settings

webapp = Flask(__name__)
webapp.permanent = True
webapp.config.from_object(settings)

db = SQLAlchemy(webapp)


from xiyoumenapp import models
if not os.path.isfile(settings.SQLALCHEMY_DATABASE_URI):
    db.create_all()
