# -*- coding: utf-8 -*-
"""
tellhowapp.admin
~~~~~~~~~~~~~~

Module admin manages basic backend modules

:copyright: (c) 2016 by ERIC ZHAO.
:license: 
"""

from flask_admin import BaseView, expose
from flask_admin.contrib.sqla import ModelView
from flask_user import login_required, roles_required

from . import db, webadmin
from . import logins
from .models import Classroom, Subaccount, Users, Users_Classroom
from .models import Connection, Description
from .models import AdminUsers, AdminUsersAuth, AdminRoles, AdminUsers_Roles


class AdminView(BaseView):
    @expose('/')
    # @login_required
    # @roles_required(["admin", "user"])
    def index(self):
        return self.render('index.html')


class LoginModelView(ModelView):
    can_create = True 
    can_edit = True
    can_delete = True 
    can_view_details = True
    create_modal = True
    edit_modal = True
    page_size = 10


class ClassroomModelView(ModelView):
    can_create = True 
    can_edit = True
    can_delete = True 
    can_view_details = True
    can_export = True
    create_modal = True
    edit_modal = True
    page_size = 10
    

class LogModelView(ModelView):
    can_create = False 
    can_edit = False
    can_delete = True
    can_view_details = True
    can_export = True
    page_size = 20
    column_exclude_list = ['users_auth', 'users_roles']


webadmin.add_view(ClassroomModelView(Subaccount, db.session, 
                                 name="subaccount", endpoint='#subaccount',
                                 category="Classroom"))
webadmin.add_view(ClassroomModelView(Classroom, db.session, 
                                 name="classes", endpoint='#class',
                                 category="Classroom"))
webadmin.add_view(ClassroomModelView(Users, db.session,
                                 name="users", endpoint='#users',
                                 category="Classroom"))
webadmin.add_view(ClassroomModelView(Users_Classroom, db.session, 
                                 name="class selected",
                                 endpoint='#users_classroom',
                                 category="Classroom"))


webadmin.add_view(LoginModelView(AdminUsers, db.session, 
                                 name="User", endpoint='#adminusers',
                                 category="Login"))
webadmin.add_view(LoginModelView(AdminUsersAuth, db.session, 
                                 name="Auth", endpoint='#adminUsersAuth',
                                 category="Login"))
webadmin.add_view(LoginModelView(AdminRoles, db.session, 
                                 name="Role", endpoint='#adminRoles',
                                 category="Login"))
webadmin.add_view(LoginModelView(AdminUsers_Roles, db.session, 
                                 name="Roles Deploy",
                                 endpoint='#adminusers_roles',
                                 category="Login"))


webadmin.add_view(ClassroomModelView(Description, db.session, 
                                 name="Dictionary", endpoint='#dictionary',
                                 category="Dictionary"))

webadmin.add_view(LogModelView(Connection, db.session, 
                                 name="log of connection", endpoint='#log_conn',
                                 category="Log"))
