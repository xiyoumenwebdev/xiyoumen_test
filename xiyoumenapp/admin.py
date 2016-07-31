# -*- coding: utf-8 -*-
"""
tellhowapp.admin
~~~~~~~~~~~~~~

Module admin manages basic backend modules

:copyright: (c) 2016 by ERIC ZHAO.
:license: 
"""

from flask_user import SQLAlchemyAdapter, UserManager

from . import webapp, db
from .models import User, UserAuth, Role, UsersRoles 


# Setup Flask-User
db_adapter = SQLAlchemyAdapter(db, User)
user_manager = UserManager(db_adapter, webapp)
