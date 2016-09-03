"""
tellhowapp.views
~~~~~~~~~~~~~~

Module views define all views of webpage 

:copyright: (c) 2016 by ERIC ZHAO.
:license: 
"""

import json, os, uuid, datetime

from flask import session, jsonify, redirect, render_template, safe_join, g
from flask_restful import Resource, fields, reqparse

from xiyoumenapp import webapp, db
from xiyoumenapp.models import Classroom, Users, Users_Classroom, Chatroom
from xiyoumenapp.conference import Conference
from xiyoumenapp.jsonapp import JsonManage

page_path = safe_join("templates", "frontend") 
filename_teacher = "webinar_teacher.html"
filename_student = "webinar_student.html"
page_teacher = safe_join(page_path, filename_teacher)
page_student = safe_join(page_path, filename_student)

parser = reqparse.RequestParser()
parser.add_argument('txt')
parser.add_argument('teastatus')
parser.add_argument('stustatus')



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
                    # return render_template(page_teacher)
                    return webapp.send_static_file(page_teacher)
                elif roleid == 2:
                    # return render_template(page_student)
                    return webapp.send_static_file(page_student)
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
                print("Begin to get /info/")
                print(session)
                userinfo["classname"] = session['classname'] 
                userinfo["username"] = session['username'] 
                userinfo["userrole"] = session['userrole'] 

                if session['userrole'] == 1:
                    userinfo["student"] = session['stu_list'] 
                    userinfo["teacher"] = session['tea_list'] 
                    
                    userinfo["teastatuslist"] = session['teastatus_dict']
                    userinfo["stustatuslist"] = session['stustatus_dict']
                elif session['userrole'] == 2:
                    userinfo["teastatuslist"] = session['teastatus_dict']

                return userinfo 
            else:
                return userinfo 
        except Exception as err:
            print("Fail to get info")
            print(err)

    def post(self):

        """
        # function post response http POST teastatus with info
        """
        try:
            args = parser.parse_args()
            if ('classid' in session) and ('userid' in session):
                if ('username' not in session):
                    classid = session['classid']
                    userid = session['userid']
                    classroom = Classroom.query.filter_by(id=classid).all()
                    classname = classroom[0].name
                    users = Users.query.filter_by(id=userid).all()
                    username = users[0].name
                    userrole = users[0].roleid
                    
                    session['classname'] = classname
                    session['username'] = username
                    session['userrole'] = userrole
                    
                    uc = Users_Classroom.query.filter_by(classid=classid).all()
                    tid_list = [ti.userid for ti in uc]
                    print(tid_list) 

                    if userrole == 1:
                        students = Users.query.filter_by(roleid=2).all()
                        stu_list = []
                        for stu in students:
                            if stu.id in tid_list:
                                stu_list.append(stu.name)
                            
                        teachers = Users.query.filter_by(roleid=1).all()
                        tea_list = []
                        for tea in teachers:
                            if tea.id in tid_list:
                                tea_list.append(tea.name)

                        session['stu_list'] = stu_list  
                        session['tea_list'] = tea_list 

                        stustatus_dict = {"0":stu_list, "1":[], "2":[], "3":[]}
                        teastatus_dict = {"0":tea_list, "1":[], "2":[], "3":[]}

                        session['teastatus_dict'] = teastatus_dict
                        session['stustatus_dict'] = stustatus_dict
                else:
                    userrole = session['userrole']
                    username = session['username']
                    teastatus_dict = session['teastatus_dict']
                    stustatus_dict = session['stustatus_dict']
                    if userrole == 1:
                        teastatus = args['teastatus']
                        print(str(teastatus))
                        for ni in range(4):
                            if username in teastatus_dict[str(ni)]:
                                teastatus_dict[str(ni)].remove(username)
                        teastatus_dict[str(teastatus)].append(username)
                        session['teastatus_dict'] = teastatus_dict
                    elif userrole == 2:
                        stustatus = args['stustatus']
                        for ni in range(3):
                            if username in stustatus_dict[str(ni)]:
                                stustatus_dict[str(ni)].remove(username)
                        stustatus_dict[str(stustatus)].append(username)
                        session['stustatus_dict'] = stustatus_dict
                print("Success to update status in session")
                return "Success to update status in session" 
            else:
                return "You have no right to do this"
        except Exception as err:
            print("Fail to update status")
            print(err)


class ChatList(Resource):
    """
    # Class ChatList is resource of "chat_ep"
    """
    def get(self):
        """
        # function get response http GET with classroom.html
        """
        try:
            dic_chatlist = {}
            nowtime = datetime.datetime.now()
            if ('classid' in session) and (
                    'userid' in session):
                classid = session['classid']
                classroom = Classroom.query.filter_by(id=classid).all()
                classname = classroom[0].name
                dic_chatlist = dict(classname=classname, chatcontent=[])

                ls_chat = Chatroom.query.filter_by(classid=classid).all()
                for ti in ls_chat:
                    str_createdate = ti.createtime.strftime("%Y-%m-%d")
                    str_nowdate = nowtime.strftime("%Y-%m-%d")
                    if str_createdate == str_nowdate:
                        users = Users.query.filter_by(id=ti.userid).all()
                        username = users[0].name
                        roleid = users[0].roleid
                        if roleid == 1:
                            rolename = "teacher"
                        elif roleid == 2:
                            rolename = "student"
                        question = ti.comment
                        createtime = ti.createtime.strftime("%Y-%m-%d %H:%M:%S")
                        dic_chatitem = dict(username=username,
                                            createtime=createtime, 
                                            rolename=rolename,
                                            question=question)
                        dic_chatlist["chatcontent"].append(dic_chatitem)
                # print(dic_chatlist)    
                return dic_chatlist
        except Exception as err:
            print("Fail to get info")
            print(err)

    def post(self):

        """
        # function post response http POST txt to chatlist
        """
        try:
            print("ready to receive post message")
            args = parser.parse_args()
            if ('classid' in session) and ('userid' in session):
                classid = session['classid']
                userid = session['userid']
                question = args['txt']
                users = Users.query.filter_by(id=userid).all()
                roleid = users[0].roleid
                id = str(uuid.uuid4())
                name = users[0].name
                createtime = datetime.datetime.now() 
                comment = question
                print(question)
                chatitem = Chatroom(id, name, createtime, comment, userid, classid)
                db.session.add(chatitem)
                db.session.commit()
                # print("Success to add new question")
                # return fields.url_for("chatlist_ep") 
                return "Success to add new question" 
            else:
                return "You have no right to do this"
        except Exception as err:
            print("Fail to add chat text")
            print(err)
