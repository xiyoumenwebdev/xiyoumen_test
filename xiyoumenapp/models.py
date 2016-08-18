# -*- coding: utf-8 -*-
"""
xiyoumenapp.models
~~~~~~~~~~~~~~

Module models define the structure of tables in database. 

:copyright: (c) 2016 by ERIC ZHAO.
:license:
"""

from xiyoumenapp import db
from flask_user import UserMixin


class Subaccount(db.Model):
    """
    # Class Subaccount define data model of subaccount
    """
    __tablename__ = 'info_subaccount'
    # id create as uuid4
    id = db.Column(db.String(34), nullable=False, primary_key=True)

    # basic information
    name = db.Column(db.String(64), nullable=False)
    createtime = db.Column(db.DateTime(), nullable=False)
    comment = db.Column(db.String(128))

    # additional information
    authtoken = db.Column(db.String(32), nullable=False)
    apikey = db.Column(db.String(34), nullable=False)
    apisecret = db.Column(db.String(34), nullable=False)
    configid = db.Column(db.String(34), nullable=False)
    statusid = db.Column(db.Integer, nullable=False)
    classroomes = db.relationship('Classroom', backref='subaccount', lazy='dynamic')
    
    def __init__(self, id, name, createtime, comment, authtoken, apikey,
            apisecret, configid, statusid):
        self.id = id
        self.name = name
        self.createtime = createtime
        self.comment = comment
        self.authtoken = authtoken
        self.apikey = apikey
        self.apisecret = apisecret
        self.configid = configid
        self.statusid = statusid

    def is_active(self):
        return self.statusid

    def __repr__(self):
        return '<Subaccount {0}> with name {1}'.format(self.id, self.name)


class Classroom(db.Model):
    """
    # Class Classroom define data model of classroom
    """
    __tablename__ = 'info_classroom'
    # id create as uuid4
    id = db.Column(db.String(36), nullable=False, primary_key=True)

    # basic information
    name = db.Column(db.String(64), nullable=False)
    createtime = db.Column(db.DateTime(), nullable=False)
    comment = db.Column(db.String(128))

    # additional information
    subaccountid = db.Column(db.String(64), db.ForeignKey('info_subaccount.id'))
    statusid = db.Column(db.Integer, nullable=False)

    users = db.relationship('Users', secondary='info_uc',
            backref=db.backref('classroom', lazy='dynamic'))
    connections = db.relationship('Connection', backref='classroom', lazy='dynamic')
    users_classroom = db.relationship('Users_Classroom', backref='classroom', lazy='dynamic')

    def __init__(self, id, name, createtime, comment, subaccountid, statusid):
        self.id = id
        self.name = name
        self.createtime = createtime
        self.comment = comment
        self.subaccountid = subaccountid
        self.statusid = statusid

    def is_active(self):
        return self.statusid

    def __repr__(self):
        return '<classroom {0}> with name {1}'.format(self.id, self.name)


class Users(db.Model):
    """
    # Class Users define data model of users
    """
    __tablename__ = 'info_users'
    # id create as uuid4
    id = db.Column(db.String(36), nullable=False, primary_key=True)

    # basic information
    name = db.Column(db.String(64), nullable=False)
    createtime = db.Column(db.DateTime(), nullable=False)
    comment = db.Column(db.String(128))

    # additional information
    roleid = db.Column(db.Integer, nullable=False)

    connections = db.relationship('Connection', backref='users', lazy='dynamic')
    users_classroom = db.relationship('Users_Classroom', backref='users', lazy='dynamic')

    def __init__(self, id, name, createtime, comment, roleid):
        self.id = id
        self.name = name
        self.createtime = createtime
        self.comment = comment
        self.roleid = roleid

    def is_role(self):
        return self.roleid

    def __repr__(self):
        return '<user {0}> with name {1}'.format(self.id, self.name)


class Users_Classroom(db.Model):
    """
    # Class User_Classroom define data model of info_uc
    """
    __tablename__ = 'info_uc'
    # id create as uuid4
    id = db.Column(db.String(36), nullable=False, primary_key=True)

    # basic information
    userid = db.Column(db.String(36), db.ForeignKey("info_users.id"))
    classid = db.Column(db.String(36), db.ForeignKey("info_classroom.id"))

    def __init__(self, id, userid, classid):
        self.id = id
        self.userid = userid
        self.classid = classid

    def __repr__(self):
        return '<Users_Classroom> is userid {0} in classid {1}'.format(self.userid,
                self.classid)


class Connection(db.Model):
    """
    # Class Connection define data model of conn
    """
    __tablename__ = 'log_conn'
    # id create as uuid4
    id = db.Column(db.String(36), nullable=False, primary_key=True)

    # basic information
    name = db.Column(db.String(64), nullable=False)
    createtime = db.Column(db.DateTime(), nullable=False)
    comment = db.Column(db.String(128))

    # additional information
    userid = db.Column(db.String(36), db.ForeignKey('info_users.id'))
    classid = db.Column(db.String(36), db.ForeignKey('info_classroom.id'))
    ip = db.Column(db.String(32), nullable=False)
    endtime = db.Column(db.DateTime())
    disconnid = db.Column(db.Integer)

    def __init__(self, id, name, createtime, comment, userid, classid, ip,
            endtime, disconnid):
        self.id = id
        self.name = name
        self.createtime = createtime
        self.comment = comment
        self.userid = userid
        self.classid = classid
        self.ip = ip
        self.endtime = endtime
        self.disconnid = disconnid

    def is_disconn(self):
        return self.disconnid

    def __repr__(self):
        return '<Connection {0}> with name {1}'.format(self.id, self.name)


class Description(db.Model):
    """
    # Class Description define data model of desc
    """
    __tablename__ = 'dic_desc'
    # id create as uuid4
    id = db.Column(db.String(36), nullable=False, primary_key=True)

    # basic information
    name = db.Column(db.String(64), nullable=False)
    createtime = db.Column(db.DateTime())
    comment = db.Column(db.String(128), nullable=False)

    # additional information
    id_desc = db.Column(db.Integer, nullable=False)

    def __init__(self, id, name, createtime, comment, id_desc):
        self.id = id
        self.name = name
        self.createtime = createtime
        self.comment = comment
        self.id_desc = id_desc

    def is_role(self):
        return self.roleid

    def __repr__(self):
        return '<user {0}> with name {1}'.format(self.id, self.name)


class AdminUsers(db.Model):
    """
    # Class Users of Admim  define data model of users for Admin
    """
    __tablename__ = 'info_adminusers'
    # id create as integer
    id = db.Column(db.Integer(), primary_key=True)

    # additional information
    email = db.Column(db.String(255), nullable=False, unique=True)
    confirmed_at = db.Column(db.DateTime())


    # user information
    is_enabled = db.Column(db.Boolean(), nullable=False, default=False)
    first_name = db.Column(db.String(50), nullable=False, default='')
    last_name = db.Column(db.String(50), nullable=False, default='')

    users_auth = db.relationship('AdminUsersAuth', backref='adminusers', lazy='dynamic')
    users_roles = db.relationship('AdminUsers_Roles', backref='adminusers', lazy='dynamic')

    def is_active(self):
        return self.is_enabled

    def __repr__(self):
        return '<adminuser {0}> with email {1}'.format(self.id, self.email)


class AdminUsersAuth(db.Model, UserMixin):
    """
    # Class UsersAuth of Admim  define data model of usersAuth for Admin
    """
    __tablename__ = 'info_adminusersauth'
    # id create as integer
    id = db.Column(db.Integer(), primary_key=True)
    user_id = db.Column(db.Integer(), db.ForeignKey("info_adminusers.id"))
    
    # basic information
    username = db.Column(db.String(64), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False, default='')
    reset_password_token = db.Column(db.String(100), nullable=False, default='')

    def __repr__(self):
        return '<adminuserauth{0}> with username {1}'.format(self.id, self.username)


class AdminRoles(db.Model):
    """
    # Class Roles of Admim  define data model of Role for Admin
    """
    __tablename__ = 'info_adminroles'
    # id create as integer
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(64), nullable=False, unique=True)

    users_roles = db.relationship('AdminUsers_Roles', backref='adminroles', lazy='dynamic')

    def __repr__(self):
        return '<adminrole{0}> with name {1}'.format(self.id, self.name)


class AdminUsers_Roles(db.Model):
    """
    # Class Users_Roles of Admin define data model of info_adminusersroles
    """
    __tablename__ = 'info_adminusersroles'
    # id create as integer
    id = db.Column(db.Integer(), primary_key=True)

    # basic information
    user_id = db.Column(db.Integer(), db.ForeignKey("info_adminusers.id"))
    role_id = db.Column(db.Integer(), db.ForeignKey("info_adminroles.id"))

    def __repr__(self):
        return '<AdminUsers_Roles> is user_id {0} with role_id {1}'.format(
                self.user_id, self.role_id)

