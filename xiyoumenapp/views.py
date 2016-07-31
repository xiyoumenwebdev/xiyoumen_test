"""
tellhowapp.views
~~~~~~~~~~~~~~

Module views define all views of webpage 

:copyright: (c) 2016 by ERIC ZHAO.
:license: 
"""

import json, os

from flask import session, jsonify, redirect
from flask_restful import Resource, fields

from xiyoumenapp import webapp, db
from xiyoumenapp.models import Classroom, Users
from xiyoumenapp.conference import Conference


class Login(Resource):
    """
    # Class Login check access to link into ClassRoom and build session
    """
    def get(self, classid, userid):
        """
        # function get response http GET with login.html
        """
        try:
            notice_err = "You have no available for this class"
            ins_con = Conference(classid, userid)
            if ins_con.check_access() is None:
                return notice_err
            else:
                session['classid'] = classid
                session['userid'] = userid
                return redirect(fields.url_for('classapi.class_ep'))
        except Exception as err:
            print(err)


class ClassRoom(Resource):
    """
    # Class classRoom is resource of "class_ep"
    """
    def get(self):
        """
        # function get response http GET with classroom.html
        """
        try:
            fname = "webinar_teacher.html"
            fpath = os.path.join("theme", os.path.join("templates",
                    os.path.join("frontend", fname)))
            if ('classid' in session) and (
                    'userid' in session):
                print(session['classid'])
                print(session['userid'])
                return webapp.send_static_file('\classroom\classroom.html')
                # return webapp.send_static_file(fpath)
            else:
                # return redirect(fields.url_for('login_ep'))
                return "There are some problems"
        except Exception as err:
            print("Fail to get classroom info")
            print(err)


class Token(Resource):
    """
    # This class returns token json
    """
    def get(self):
        """
        # function get response http GET with token json
        """
        try:
            if ('classid' in session) and (
                    'userid' in session):
                classid = session['classid']
                userid = session['userid']
                ins_conference = Conference(classid, userid)
                tmptoken = ins_conference.get_accesstoken()
                tmptoken = jsonify(identity=tmptoken.identity, 
                        token=tmptoken.to_jwt())
                print('Success to create token')
                return tmptoken
            else:
                # return redirect(fields.url_for('login_ep'))
                return "There are some problme about token"
        except Exception as err:
            print(err)


class Info(Resource):
    """
    # Class Info is resource of "info_ep"
    """
    def get(self):
        """
        # function get response http GET with classroom.html
        """
        try:
            userinfo = {}
            if ('classid' in session) and (
                    'userid' in session):
                classid = session['classid']
                userid = session['userid']
                classroom = Classroom.query.filter_by(id=classid).all()
                classname = classroom[0].name
                users = Users.query.filter_by(id=userid).all()
                username = users[0].name
                userinfo["classname"] = classname
                userinfo["username"] = username
                return userinfo 
            else:
                return userinfo 
        except Exception as err:
            print("Fail to get info")
            print(err)
