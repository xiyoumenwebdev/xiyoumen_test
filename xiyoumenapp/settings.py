# -*- coding: utf-8 -*-
"""
tellhowapp.settings
~~~~~~~~~~~~~~

Settings of tellhowapp is configured in this module

:copyright: (c) 2016 by ERIC ZHAO.
:license: 
"""
import os
from datetime import timedelta

db_dir = os.path.dirname(os.path.abspath(__file__))
db_file = os.path.join(db_dir, 'app.sqlite')

# Flask settings
# SECRET_KEY = str(uuid.uuid4())
SECRET_KEY = "secret_key_for_gunicorn"
SQLALCHEMY_DATABASE_URI = 'sqlite:///'+db_file
SQLALCHEMY_TRACK_MODIFICATIONS = True
CSRF_ENABLED = True
PERMANENT_SESSION_LIFETIME = timedelta(minutes=60)

