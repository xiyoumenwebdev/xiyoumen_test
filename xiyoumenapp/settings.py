# -*- coding: utf-8 -*-
"""
tellhowapp.settings
~~~~~~~~~~~~~~

Settings of tellhowapp is configured in this module

:copyright: (c) 2016 by ERIC ZHAO.
:license: 
"""
import os
from datetime import timedelta, datetime

db_dir = os.path.dirname(os.path.abspath(__file__))
db_file = os.path.join(db_dir, 'app.sqlite')
t = datetime.utcnow()
strsecret = t.strftime('%Y%m%d')
# strsecret = "secret_key_for_gunicorn"

# Flask settings
SECRET_KEY = strsecret 
WTF_CSRF_SECRET_KEY = strsecret 
SQLALCHEMY_DATABASE_URI = 'sqlite:///'+db_file
SQLALCHEMY_TRACK_MODIFICATIONS = True
CSRF_ENABLED = True
REDIS_URL = "redis://localhost:6379"
# PERMANENT_SESSION_LIFETIME = timedelta(minutes=60)
# USE_X_SENDFILE = True 
# UPLOAD_FOLDER = os.path.join(os.path.join(db_dir, "templates"), "theme")
