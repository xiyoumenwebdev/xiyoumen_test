# -*- coding: utf-8 -*-
"""
tellhowapp.logins
~~~~~~~~~~~~~~

Module logins manages logins styles

:copyright: (c) 2016 by ERIC ZHAO.
:license: 
"""

from flask_user import SQLAlchemyAdapter, UserManager

from . import db, webapp
from .models import AdminUsersAuth


db_adapter = SQLAlchemyAdapter(db, AdminUsersAuth)
user_manager = UserManager(db_adapter, webapp)
