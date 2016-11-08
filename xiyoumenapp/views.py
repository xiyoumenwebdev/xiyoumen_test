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
from flask_sse import sse

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
parser.add_argument('teaname')
parser.add_argument('stuname')
parser.add_argument('tealinkstatus')
parser.add_argument('stulinkstatus')
parser.add_argument('whiteboard')
# parser.add_argument('whiteboard')
parser.add_argument('pptposition')
parser.add_argument('pptinfo')



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
                tempclassstr = classid.split("-")
                session['classstr'] = ''.join(tempclassstr)
                session['roleid'] = roleid
                print(session['classstr'])
                redis_store.set('classname:'+classid, classname)
                redis_store.set('username:'+userid, username)
                redis_store.set('roleid:'+userid, roleid)

                # print(session) 
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
                classid =session['classid']
                userid = session['userid']
                roleid = int(redis_store.get("roleid:"+userid))
                if roleid == 1:
                    redis_store.delete('tea_list:' + classid)
                    redis_store.delete('stu_list:' + classid)
                    redis_store.delete('tealinkstatus_dict:' + classid)
                    redis_store.delete('stulinkstatus_dict:' + classid)
                    # redis_store.delete('ass_list:' + classid)
                    # redis_store.delete('asslinkstatus_dict:' + classid)
                    # redis_store.delete('teavideostatus_dict:' + classid)
                    # redis_store.delete('assvideostatus_dict:' + classid)
                    # redis_store.delete('stuvideostatus_dict:' + classid)
                    # redis_store.delete('teasoundstatus_dict:' + classid)
                    # redis_store.delete('asssoundstatus_dict:' + classid)
                    # redis_store.delete('stusoundstatus_dict:' + classid)
                    redis_store.delete("chatnum:"+classid)
                    redis_store.delete('chatcontent:' + classid)
                    redis_store.delete('whiteboard:' + classid)
                    redis_store.delete('ppt:' + classid)
                    redis_store.set("chatnum:"+classid, 0)

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
                username = redis_store.get('username:'+userid)
                ins_conference = Conference(classid, userid)
                tmptoken = ins_conference.get_accesstoken()
                # tmptoken = jsonify(identity=tmptoken.identity,
                #                    token=tmptoken.to_jwt())
                mytoken = dict(identity=username,
                               token=tmptoken.to_jwt())
                print('Success to create token')
                print(mytoken)
                return mytoken
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
                # print("Start to get whiteboard object json {0}".format(mydrawing))
                print('Success to get whiteboard')
                return mydrawing
            else:
                # return redirect(fields.url_for('login_ep'))
                return "There are some problme about token"
        except Exception as err:
            print(err)

    def post(self):

        """
        # function post response http POST whiteboard
        """
        try:
            print("ready to receive post message")
            args = parser.parse_args()
            if ('classid' in session) and ('userid' in session):
                classid = session['classid']
                whiteboard = args['whiteboard']
                print("Start to parse whiteboard object json {0}".format(whiteboard))
                drawing_dict = json.loads(whiteboard)
                redis_store.hmset("whiteboard:" + classid, drawing_dict)
                return "Success to add new whiteboard"
            else:
                return "You have no right to do this"
        except Exception as err:
            print("Fail to add whiteboard")
            print(err)


class PPT(Resource):
    """
    # Class State is resource of "state_ep"
    """
    def get(self):
        """
        # function get response http GET
        """
        try:
            if ('classid' in session) and ('userid' in session):
                classid = session['classid']
                ppt_info = {}
                dir_file = os.path.dirname(os.path.abspath(__file__))
                dir_ppt = safe_join(dir_file, "static")
                dir_ppt = safe_join(dir_ppt, "courseware")
                dir_ppt = safe_join(dir_ppt, session['classid'])
                dir_ppt = safe_join(dir_ppt, "ppt")
                print("PPT directory is " + dir_ppt)
                filelist = os.listdir(dir_ppt)
                ppt_info["pptlist"] = filelist
                if (redis_store.exists("ppt:"+classid)):
                    ppt_info["pptinfo"] = redis_store.get("ppt:" + classid)
                return ppt_info
            else:
                return "You have no right to do this"
        except Exception as err:
            print("Fail to get info")
            print(err)

    def post(self):

        """
        # function post response http POST position with info
        """
        try:
            print('Begin to post')
            print(session)
            args = parser.parse_args()
            classid = session['classid']
            userid = session['userid']
            classstr = session['classstr']
            roleid = int(redis_store.get("roleid:"+userid))
            print(roleid)
            if ('classid' in session) and ('userid' in session):
                if (roleid == 1):
                    pptposition = args['pptposition']
                    pptinfo = args['pptinfo']
                    if (pptposition is not None):
                        sse.publish({"pptposition":pptposition},
                                    type="newposition"+classstr,
                                    channel="changed.ppt" )
                    if (pptinfo is not None):
                        sse.publish({"pptinfo":pptinfo},
                                    type="pptinfo"+classstr,
                                    channel="changed.ppt" )
                        redis_store.set('ppt:'+classid, pptinfo)
        except Exception as err:
            print("Fail to get info")
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
                classstr = session['classstr']

                userinfo["classname"] = redis_store.get("classname:"+classid)
                userinfo["username"] = redis_store.get("username:"+userid)
                userinfo["classid"] = session["classid"]
                userinfo["userid"] = session["userid"]
                userinfo["classstr"] = session['classstr']
                userinfo["roleid"] = int(redis_store.get("roleid:"+userid))
                roleid = userinfo["roleid"]

                if ( not redis_store.exists("stu_list:"+classid) and roleid == 1 ):
                    print("first time load redis store")
                    print(session)
                    uc = Users_Classroom.query.filter_by(classid=classid).all()
                    tid_list = [ti.userid for ti in uc]
                    print(tid_list)

                    teachers = Users.query.filter_by(roleid=1).all()
                    tea_list = []
                    for tea in teachers:
                        if tea.id in tid_list:
                            tea_list.append(tea.name)

                    students = Users.query.filter_by(roleid=2).all()
                    stu_list = []
                    for stu in students:
                        if stu.id in tid_list:
                            stu_list.append(stu.name)

                    for ti in tea_list:
                        redis_store.lpush("tea_list:"+classid, ti)
                        redis_store.hset('tealinkstatus_dict:'+classid, ti, 0)

                    for si in stu_list:
                        redis_store.lpush("stu_list:"+classid, si)
                        redis_store.hset('stulinkstatus_dict:'+classid, si, 0)

                tea_list = redis_store.lrange('tea_list:'+classid, 0, -1)
                stu_list = redis_store.lrange('stu_list:'+classid, 0, -1)

                tealinkstatus_hash = redis_store.hgetall('tealinkstatus_dict:'+classid)
                stulinkstatus_hash = redis_store.hgetall('stulinkstatus_dict:'+classid)

                tealinkstatus_dict = {"0": [], "1": [], "2": [], "3": []}
                stulinkstatus_dict = {"0": [], "1": [], "2": [], "3": []}

                for (k, v) in tealinkstatus_hash.items():
                    for ni in range(4):
                        if v == str(ni):
                            tealinkstatus_dict[str(ni)].append(k)
                            break

                for (k, v) in stulinkstatus_hash.items():
                    for ni in range(4):
                        if v == str(ni):
                            stulinkstatus_dict[str(ni)].append(k)
                            break

                if userinfo['roleid'] == 1:
                    userinfo["teacher"] = tea_list
                    userinfo["student"] = stu_list

                    userinfo["tealinkstatuslist"] = tealinkstatus_dict
                    userinfo["stulinkstatuslist"] = stulinkstatus_dict


                if userinfo['roleid'] == 2:
                    userinfo["tealinkstatuslist"] = tealinkstatus_dict
                    userinfo["teacher"] = tea_list

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
            classstr = session['classstr']
            username = redis_store.get('username:'+userid)
            roleid = int(redis_store.get("roleid:"+userid))
            print(roleid)

            userinfo = {}
            userinfo["classname"] = redis_store.get("classname:"+classid)
            userinfo["username"] = redis_store.get("username:"+userid)
            userinfo["classid"] = session["classid"]
            userinfo["userid"] = session["userid"]
            userinfo["classstr"] = session['classstr']
            userinfo["roleid"] = int(redis_store.get("roleid:"+userid))

            if ('classid' in session) and ('userid' in session):

                if roleid == 1:
                    teaname = args['teaname']
                    tealinkstatus = args['tealinkstatus']
                    print("print post info");
                    print(teaname);
                    print(tealinkstatus);

                    if tealinkstatus is not None:
                        print("Teacher status changes to {0}".format(str(tealinkstatus)))
                        redis_store.hset('tealinkstatus_dict:'+classid,
                                         teaname, tealinkstatus)

                        tealinkstatus_hash = redis_store.hgetall('tealinkstatus_dict:'+classid)
                        tealinkstatus_dict = {"0": [], "1": [], "2": [], "3": []}
                        for (k, v) in tealinkstatus_hash.items():
                            for ni in range(4):
                                if v == str(ni):
                                    tealinkstatus_dict[str(ni)].append(k)
                                    break

                        sse.publish({"tealinkstatus":tealinkstatus_dict},
                                    type="newtealinkstatus"+classstr,
                                    channel="changed.status")
                        print(tealinkstatus_dict)
                        print("newtealinkstatus"+classstr)


                    stuname = args['stuname']
                    stulinkstatus = args['stulinkstatus']

                    if stulinkstatus is not None:
                        print("Student status changes to {0}".format(str(stulinkstatus)))
                        redis_store.hset('stulinkstatus_dict:'+classid,
                                         stuname, stulinkstatus)

                        stulinkstatus_hash = redis_store.hgetall('stulinkstatus_dict:'+classid)
                        stulinkstatus_dict = {"0": [], "1": [], "2": [], "3": []}
                        for (k, v) in stulinkstatus_hash.items():
                            for ni in range(4):
                                if v == str(ni):
                                    stulinkstatus_dict[str(ni)].append(k)
                                    break

                        sse.publish({"stulinkstatus":stulinkstatus_dict},
                                    type="newstulinkstatus"+classstr,
                                    channel="changed.status")
                        print(stulinkstatus_dict)
                        print("newstulinkstatus"+classstr)

                    tea_list = redis_store.lrange('tea_list:'+classid, 0, -1)
                    stu_list = redis_store.lrange('stu_list:'+classid, 0, -1)

                    tealinkstatus_hash = redis_store.hgetall('tealinkstatus_dict:'+classid)
                    stulinkstatus_hash = redis_store.hgetall('stulinkstatus_dict:'+classid)

                    tealinkstatus_dict = {"0": [], "1": [], "2": [], "3": []}
                    stulinkstatus_dict = {"0": [], "1": [], "2": [], "3": []}

                    for (k, v) in tealinkstatus_hash.items():
                        for ni in range(4):
                            if v == str(ni):
                                tealinkstatus_dict[str(ni)].append(k)
                                break

                    for (k, v) in stulinkstatus_hash.items():
                        for ni in range(4):
                            if v == str(ni):
                                stulinkstatus_dict[str(ni)].append(k)
                                break

                    userinfo["teacher"] = tea_list
                    userinfo["student"] = stu_list
                    userinfo["tealinkstatuslist"] = tealinkstatus_dict
                    userinfo["stulinkstatuslist"] = stulinkstatus_dict

                    print("Success to update status in session")
                    return userinfo
                elif roleid == 2:
                    stuname = args['stuname']
                    stulinkstatus = args['stulinkstatus']
                    print("Student status changes to {0}".format(str(stulinkstatus)))
                    redis_store.hset('stulinkstatus_dict:'+classid,
                                     stuname, stulinkstatus)

                    stulinkstatus_hash = redis_store.hgetall('stulinkstatus_dict:'+classid)
                    stulinkstatus_dict = {"0": [], "1": [], "2": [], "3": []}
                    for (k, v) in stulinkstatus_hash.items():
                        for ni in range(4):
                            if v == str(ni):
                                stulinkstatus_dict[str(ni)].append(k)
                                break

                    sse.publish({"stulinkstatus":stulinkstatus_dict},
                                type="newstulinkstatus"+classstr,
                                channel="changed.status")
                    print(stulinkstatus_dict)
                    print("newstulinkstatus"+classstr)

                    tea_list = redis_store.lrange('tea_list:'+classid, 0, -1)
                    tealinkstatus_hash = redis_store.hgetall('tealinkstatus_dict:'+classid)
                    tealinkstatus_dict = {"0": [], "1": [], "2": [], "3": []}
                    for (k, v) in tealinkstatus_hash.items():
                        for ni in range(4):
                            if v == str(ni):
                                tealinkstatus_dict[str(ni)].append(k)
                                break

                    userinfo["teacher"] = tea_list
                    userinfo["tealinkstatuslist"] = tealinkstatus_dict

                    print("Success to update status in session")
                    return userinfo
                else:
                    return "role id is not existed"
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
                classname = redis_store.get('classname:'+classid)

                dic_chatlist = dict(classname=classname, chatcontent=[])

                chatcontent_list = redis_store.lrange("chatcontent:"+classid, 0, -1)
                print("Read from redis")
                print(chatcontent_list)
                for i in range(0,len(chatcontent_list),5):
                    dic_chatitem = dict(chatnum=chatcontent_list[i+4],
                                        username=chatcontent_list[i+3],
                                        createtime=chatcontent_list[i+2],
                                        rolename=chatcontent_list[i+1],
                                        question=chatcontent_list[i+0])
                    dic_chatlist["chatcontent"].append(dic_chatitem)
                print(dic_chatlist)
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
                classstr = session['classstr']
                question = args['txt']
                chatnum = str(int(redis_store.get("chatnum:"+classid))+1)
                username = redis_store.get("username:"+userid)
                roleid = redis_store.get("roleid:"+userid)
                createtime = datetime.datetime.now()

                if roleid == '1':
                    rolename = "teacher"
                elif roleid == '2':
                    rolename = "student"
                createtimestr = createtime.strftime("%Y-%m-%d %H:%M:%S")
                newmessage = dict(chatnum=chatnum,
                                  username=username,
                                  createtime=createtimestr,
                                  rolename=rolename,
                                  question=question)
                print("Ready to save redis")
                redis_store.lpush("chatcontent:"+classid, chatnum)
                redis_store.lpush("chatcontent:"+classid, username)
                redis_store.lpush("chatcontent:"+classid, createtimestr)
                redis_store.lpush("chatcontent:"+classid, rolename)
                redis_store.lpush("chatcontent:"+classid, question)
                redis_store.set("chatnum:"+classid, chatnum)
                print(newmessage)
                sse.publish({"message":newmessage},
                            type=("newchatmessage"+classstr),
                            channel="changed.chatroom")
                # print("newchatmessage"+classstr)
                # print(len("newchatmessage"+classstr))
                return newmessage
            else:
                return "You have no right to do this"
        except Exception as err:
            print("Fail to add chat text")
            print(err)
