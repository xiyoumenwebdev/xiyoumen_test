# -*- coding: utf-8 -*-
"""
tellhowapp.admin
~~~~~~~~~~~~~~

Module admin manages basic backend modules

:copyright: (c) 2016 by ERIC ZHAO.
:license: 
"""
import uuid

from flask_admin.form import SecureForm, rules
from flask_admin import BaseView, expose
from flask_admin.contrib.sqla import ModelView
from flask_admin.model import BaseModelView
from flask_user import login_required, roles_required

from . import db, webadmin
from . import logins
from .models import Classroom, Subaccount, Users, Users_Classroom
from .models import Connection, Description, Chatroom
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
    column_display_pk = True
    
    def after_model_change(self, form, model, is_created):
        # model has already been commited, then change
        pass

    def on_model_change(self, form, model, is_created):
        # model has not been commited, yet so can be changed
        pass


class ClassroomModelView(ModelView):
    can_create = True 
    can_edit = True
    can_delete = True 
    can_view_details = True
    can_export = True
    create_modal = True
    edit_modal = True
    page_size = 10
    column_display_pk = True
    
    def after_model_change(self, form, model, is_created):
        # model has already been commited, then change
        pass

    def on_model_change(self, form, model, is_created):
        # model has not been commited, yet so can be changed
        pass


class DescModelView(ModelView):
    can_create = True 
    can_edit = True
    can_delete = True 
    can_view_details = True
    can_export = True
    create_modal = True
    edit_modal = True
    page_size = 10
    form_base_class = SecureForm
    column_display_pk = True
    # form_column = ('id', 'name', 'createtime')
    form_create_rules = (rules.HTML('<h4>CREATE DESCRIPTION</h4>'), 'name', 'createtime',
                        'comment', 'id_desc')
    
    def after_model_change(self, form, model, is_created):
        # model has already been commited, then change
        pass

    def on_model_change(self, form, model, is_created):
        # model has not been commited, yet so can be changed
        print("is_created is {0}".format(is_created))
        if (is_created == True):
            model.id = str(uuid.uuid4())
        print('id is {}'.format(model.id))


class LogModelView(ModelView):
    can_create = False 
    can_edit = False
    can_delete = True
    can_view_details = True
    can_export = True
    page_size = 20
    # column_exclude_list = ['users_auth', 'users_roles']
    column_display_pk = True

    def after_model_change(self, form, model, is_created):
        # model has already been commited, then change
        pass

    def on_model_change(self, form, model, is_created):
        # model has not been commited, yet so can be changed
        pass


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


webadmin.add_view(DescModelView(Description, db.session, 
                                name="Dictionary", endpoint='#dictionary',
                                category="Dictionary"))

webadmin.add_view(LogModelView(Connection, db.session, 
                               name="log of connection", endpoint='#log_conn',
                               category="Log"))
webadmin.add_view(LogModelView(Chatroom, db.session, 
                               name="log of Chatroom", endpoint='#log_chatroom',
                               category="Log"))
