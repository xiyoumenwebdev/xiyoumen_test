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
from redis import Redis

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
parser.add_argument('drawing')

redis_store = Redis(charset='utf-8', decode_responses=True)


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
                classroom = Classroom.query.filter_by(id=classid).all()
                classname = classroom[0].name
                users = Users.query.filter_by(id=userid).all()
                username = users[0].name
                roleid = users[0].roleid
                    
                session['classid'] = classid
                session['userid'] = userid
                redis_store.set('classname:'+classid, classname)
                redis_store.set('username:'+userid, username)
                redis_store.set('roleid:'+userid, roleid)
                redis_store.delete('tea_list:' + classid)
                redis_store.delete('stu_list:' + classid)
                redis_store.delete('teastatus_dict:' + classid)
                redis_store.delete('stustatus_dict:' + classid)
                redis_store.delete('whiteboard:' + classid)

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
            if ('classid' in session) and ('userid' in session):
                userid = session['userid']
                roleid = int(redis_store.get("roleid:"+userid))
                if roleid == 1:
                    return webapp.send_static_file(page_teacher)
                elif roleid == 2:
                    return webapp.send_static_file(page_student)
            else:
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
            if ('classid' in session) and ('userid' in session):
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


class Whiteboard(Resource):
    """
    # This class returns whiteboard json
    """
    def get(self):
        """
        # function get response http GET with token json
        """
        try:
            if ('classid' in session) and ('userid' in session):
                classid = session['classid']
                mydrawing = redis_store.hgetall('whiteboard:' + classid)
                print("Start to get drawing object json {0}".format(mydrawing))
                print('Success to get drawing')
                return mydrawing
            else:
                # return redirect(fields.url_for('login_ep'))
                return "There are some problme about token"
        except Exception as err:
            print(err)

    def post(self):

        """
        # function post response http POST drawing 
        """
        try:
            print("ready to receive post message")
            args = parser.parse_args()
            if ('classid' in session) and ('userid' in session):
                classid = session['classid']
                drawing = args['drawing']
                print("Start to parse drawing object json {0}".format(drawing))
                drawing_dict = json.loads(drawing)
                redis_store.hmset("whiteboard:" + classid, drawing_dict)
                return "Success to add new drawing" 
            else:
                return "You have no right to do this"
        except Exception as err:
            print("Fail to add whiteboard")
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
            if ('classid' in session) and ('userid' in session):
                print("Begin to get /info/")
                print(session)
                classid = session['classid']
                userid = session['userid']
                userinfo["classname"] = redis_store.get("classname:"+classid)
                userinfo["username"] = redis_store.get("username:"+userid)
                userinfo["roleid"] = int(redis_store.get("roleid:"+userid)) 

                stu_list = redis_store.lrange('stu_list:'+classid, 0, -1)
                tea_list = redis_store.lrange('tea_list:'+classid, 0, -1)
                # print(stu_list)
                # print(tea_list)
                
                teastatus_hash = redis_store.hgetall('teastatus_dict:'+classid)
                stustatus_hash = redis_store.hgetall('stustatus_dict:'+classid)
                # print(teastatus_hash)
                
                teastatus_dict = {"0": [], "1": [], "2": [], "3": []}
                stustatus_dict = {"0": [], "1": [], "2": [], "3": []}

                for (k, v) in teastatus_hash.items():
                    for ni in range(4):
                        if v == str(ni):
                            teastatus_dict[str(ni)].append(k)
                            break
                # print(teastatus_dict)
                        
                for (k, v) in stustatus_hash.items():
                    for ni in range(4):
                        if v == str(ni):
                            stustatus_dict[str(ni)].append(k)
                            break
                # print(stustatus_dict)

                if userinfo['roleid'] == 1:
                    userinfo["teacher"] = tea_list 
                    userinfo["student"] = stu_list 
                    
                    userinfo["teastatuslist"] = teastatus_dict 
                    userinfo["stustatuslist"] = stustatus_dict
                # elif userinfo['roleid'] == 2:
                    # userinfo["teastatuslist"] = teastatus_dict 
                print(userinfo)
                print('Success to get userinfo')
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
            print('Begin to post')
            print(session)
            args = parser.parse_args()
            classid = session['classid']
            userid = session['userid']
            roleid = int(redis_store.get("roleid:"+userid))
            print(roleid)
            
            if ('classid' in session) and ('userid' in session):
                if ( not redis_store.exists("stu_list:"+classid) and roleid == 1 ):
                    print(session) 
                    uc = Users_Classroom.query.filter_by(classid=classid).all()
                    tid_list = [ti.userid for ti in uc]
                    print(tid_list) 

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

                    for ti in tea_list:
                        redis_store.lpush("tea_list:"+classid, ti)
                        redis_store.hset('teastatus_dict:'+classid, ti, 0)

                    for si in stu_list:
                        redis_store.lpush("stu_list:"+classid, si)
                        redis_store.hset('stustatus_dict:'+classid, si, 0)

                else:
                    classid = session['classid']
                    userid = session['userid']
                    username = redis_store.get('username:'+userid)
                    roleid = int(redis_store.get('roleid:'+userid))
                    if roleid == 1:
                        teastatus = args['teastatus']
                        print("Teacher status changes to {0}".format(str(teastatus)))
                        redis_store.hset('teastatus_dict:'+classid, username, teastatus)
                    elif roleid == 2:
                        stustatus = args['stustatus']
                        print("Student status changes to {0}".format(str(stustatus)))
                        redis_store.hset('stustatus_dict:'+classid, username, stustatus)
                print("Success to update status in session")
                return "Success to update status in session" 
            else:
                print("You have no right to do this")
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
