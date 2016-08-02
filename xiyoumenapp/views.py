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
from xiyoumenapp.models import Classroom, Users, Users_Classroom
from xiyoumenapp.conference import Conference
from xiyoumenapp.jsonapp import JsonManage

pagepath = os.path.join(os.path.join("theme", "templates"), "frontend")
webpage_teacher = os.path.join(pagepath, "webinar_teacher.html")
webpage_student = os.path.join(pagepath, "webinar_student.html")

page_teacher = os.path.join("classroom", "classroom_teacher.html")
page_student = os.path.join("classroom", "classroom_student.html")
class Test(Resource):
    """
    # Class Test test the connection of website
    """
    def get(self):
        """
        # function get response http GET
        """
        try:
            notice_resp = "wellcome to xiyoumen.com"
            return notice_resp 
        except Exception as err:
            print(err)


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
            ins_json = JsonManage()
            ins_json.save_classinfo()
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
            if ('classid' in session) and (
                    'userid' in session):
                classid = session['classid']
                userid = session['userid']

                users = Users.query.filter_by(id=userid).all()
                roleid = users[0].roleid

                if roleid == 1:
                    return webapp.send_static_file("classroom_teacher.html")
                    # return webapp.send_static_file(page_teacher)
                    # return webapp.send_static_file(webpage_teacher)
                elif roleid == 2:
                    return webapp.send_static_file("classroom_student.html")
                    # return webapp.send_static_file(page_student)
                    # return webapp.send_static_file(webpage_student)

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
                userrole = users[0].roleid

                uc = Users_Classroom.query.filter_by(classid=classid).all()
                tid_list = [ti.userid for ti in uc if (ti.id != userid)]
                print(tid_list) 

                if userrole == 1:
                    students = Users.query.filter_by(roleid=2).all()
                    stu_list = []
                    for stu in students:
                        if stu.id in tid_list:
                            stu_list.append(stu.name)
                    print(stu_list)
                    userinfo["classname"] = classname
                    userinfo["username"] = username
                    userinfo["student"] = stu_list
                elif userrole == 2:
                    teachers = Users.query.filter_by(roleid=1).all()
                    tea_list = []
                    for tea in teachers:
                        if tea.id in tid_list:
                            tea_list.append(tea.name)
                    print(tea_list)
                    userinfo["classname"] = classname
                    userinfo["username"] = username
                    userinfo["teacher"] = tea_list
                return userinfo 
            else:
                return userinfo 
        except Exception as err:
            print("Fail to get info")
            print(err)
