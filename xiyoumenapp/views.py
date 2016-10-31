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
parser.add_argument('assname')
parser.add_argument('stuname')
parser.add_argument('tealinkstatus')
parser.add_argument('asslinkstatus')
parser.add_argument('stulinkstatus')
parser.add_argument('teavideostatus')
parser.add_argument('assvideostatus')
parser.add_argument('stuvideostatus')
parser.add_argument('teasoundstatus')
parser.add_argument('asssoundstatus')
parser.add_argument('stusoundstatus')
parser.add_argument('whiteboardstatus')
parser.add_argument('drawing')
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
                print(session['classstr'])
                redis_store.set('classname:'+classid, classname)
                redis_store.set('username:'+userid, username)
                redis_store.set('roleid:'+userid, roleid)

                if roleid == 1:
                    redis_store.delete('tea_list:' + classid)
                    # redis_store.delete('ass_list:' + classid)
                    redis_store.delete('stu_list:' + classid)
                    redis_store.delete('tealinkstatus_dict:' + classid)
                    # redis_store.delete('asslinkstatus_dict:' + classid)
                    redis_store.delete('stulinkstatus_dict:' + classid)
                    # redis_store.delete('teavideostatus_dict:' + classid)
                    # redis_store.delete('assvideostatus_dict:' + classid)
                    # redis_store.delete('stuvideostatus_dict:' + classid)
                    # redis_store.delete('teasoundstatus_dict:' + classid)
                    # redis_store.delete('asssoundstatus_dict:' + classid)
                    # redis_store.delete('stusoundstatus_dict:' + classid)
                    redis_store.delete('chatcontent:' + classid)
                    redis_store.delete('whiteboard:' + classid)
                    redis_store.delete('ppt:' + classid)

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
                # print("Start to get drawing object json {0}".format(mydrawing))
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
                    print(session)
                    uc = Users_Classroom.query.filter_by(classid=classid).all()
                    tid_list = [ti.userid for ti in uc]
                    print(tid_list)

                    teachers = Users.query.filter_by(roleid=1).all()
                    tea_list = []
                    for tea in teachers:
                        if tea.id in tid_list:
                            tea_list.append(tea.name)

                    # assistants = Users.query.filter_by(roleid=3).all()
                    # ass_list = []
                    # for ass in assistants:
                    #     if ass.id in tid_list:
                    #         ass_list.append(ass.name)

                    students = Users.query.filter_by(roleid=2).all()
                    stu_list = []
                    for stu in students:
                        if stu.id in tid_list:
                            stu_list.append(stu.name)

                    for ti in tea_list:
                        redis_store.lpush("tea_list:"+classid, ti)
                        redis_store.hset('tealinkstatus_dict:'+classid, ti, 0)
                        # redis_store.hset('teavideostatus_dict:'+classid, ti, 0)
                        # redis_store.hset('teasoundstatus_dict:'+classid, ti, 0)

                    # for ai in ass_list:
                    #     redis_store.lpush("ass_list:"+classid, ai)
                    #     redis_store.hset('assslinktatus_dict:'+classid, ai, 0)
                    #     redis_store.hset('asssvideotatus_dict:'+classid, ai, 0)
                    #     redis_store.hset('assssoundtatus_dict:'+classid, ai, 0)

                    for si in stu_list:
                        redis_store.lpush("stu_list:"+classid, si)
                        redis_store.hset('stulinkstatus_dict:'+classid, si, 0)
                        # redis_store.hset('stuvideostatus_dict:'+classid, si, 0)
                        # redis_store.hset('stusoundstatus_dict:'+classid, si, 0)

                tea_list = redis_store.lrange('tea_list:'+classid, 0, -1)
                # ass_list = redis_store.lrange('ass_list:'+classid, 0, -1)
                stu_list = redis_store.lrange('stu_list:'+classid, 0, -1)

                tealinkstatus_hash = redis_store.hgetall('tealinkstatus_dict:'+classid)
                # asslinkstatus_hash = redis_store.hgetall('asslinkstatus_dict:'+classid)
                stulinkstatus_hash = redis_store.hgetall('stulinkstatus_dict:'+classid)

                # teavideostatus_hash = redis_store.hgetall('teavideostatus_dict:'+classid)
                # assvideostatus_hash = redis_store.hgetall('assvideostatus_dict:'+classid)
                # stuvideostatus_hash = redis_store.hgetall('stuvideostatus_dict:'+classid)

                # teasoundstatus_hash = redis_store.hgetall('teasoundstatus_dict:'+classid)
                # asssoundstatus_hash = redis_store.hgetall('asssoundstatus_dict:'+classid)
                # stusoundstatus_hash = redis_store.hgetall('stusoundstatus_dict:'+classid)
                # print(teastatus_hash)

                tealinkstatus_dict = {"0": [], "1": [], "2": [], "3": []}
                # asslinkstatus_dict = {"0": [], "1": [], "2": [], "3": []}
                stulinkstatus_dict = {"0": [], "1": [], "2": [], "3": []}

                # teavideostatus_dict = {"0": [], "1": [], "2": [], "3": []}
                # assvideostatus_dict = {"0": [], "1": [], "2": [], "3": []}
                # stuvideostatus_dict = {"0": [], "1": [], "2": [], "3": []}

                # teasoundstatus_dict = {"0": [], "1": [], "2": [], "3": []}
                # asssoundstatus_dict = {"0": [], "1": [], "2": [], "3": []}
                # stusoundstatus_dict = {"0": [], "1": [], "2": [], "3": []}

                for (k, v) in tealinkstatus_hash.items():
                    for ni in range(4):
                        if v == str(ni):
                            tealinkstatus_dict[str(ni)].append(k)
                            break

                # for (k, v) in asslinkstatus_hash.items():
                #     for ni in range(4):
                #         if v == str(ni):
                #             asslinkstatus_dict[str(ni)].append(k)
                #             break

                for (k, v) in stulinkstatus_hash.items():
                    for ni in range(4):
                        if v == str(ni):
                            stulinkstatus_dict[str(ni)].append(k)
                            break

                # for (k, v) in teavideostatus_hash.items():
                #     for ni in range(4):
                #         if v == str(ni):
                #             teavideostatus_dict[str(ni)].append(k)
                #             break

                # for (k, v) in assvideostatus_hash.items():
                #     for ni in range(4):
                #         if v == str(ni):
                #             assvideostatus_dict[str(ni)].append(k)
                #             break

                # for (k, v) in stuvideostatus_hash.items():
                #     for ni in range(4):
                #         if v == str(ni):
                #             stuvideostatus_dict[str(ni)].append(k)
                #             break

                # for (k, v) in teasoundstatus_hash.items():
                #     for ni in range(4):
                #         if v == str(ni):
                #             teasoundstatus_dict[str(ni)].append(k)
                #             break

                # for (k, v) in asssoundstatus_hash.items():
                #     for ni in range(4):
                #         if v == str(ni):
                #             asssoundstatus_dict[str(ni)].append(k)
                #             break

                # for (k, v) in stusoundstatus_hash.items():
                #     for ni in range(4):
                #         if v == str(ni):
                #             stusoundstatus_dict[str(ni)].append(k)
                #             break

                if userinfo['roleid'] == 1:
                    userinfo["teacher"] = tea_list
                    # userinfo["assistant"] = ass_list
                    userinfo["student"] = stu_list

                    userinfo["tealinkstatuslist"] = tealinkstatus_dict
                    # userinfo["asslinkstatuslist"] = asslinkstatus_dict
                    userinfo["stulinkstatuslist"] = stulinkstatus_dict

                    # userinfo["teavideostatuslist"] = teavideostatus_dict
                    # userinfo["assvideostatuslist"] = assvideostatus_dict
                    # userinfo["stuvideostatuslist"] = stuvideostatus_dict

                    # userinfo["teasoundstatuslist"] = teasoundstatus_dict
                    # userinfo["asssoundstatuslist"] = asssoundstatus_dict
                    # userinfo["stusoundstatuslist"] = stusoundstatus_dict

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

            if ('classid' in session) and ('userid' in session):

                if roleid == 1:
                    teaname = args['teaname']
                    tealinkstatus = args['tealinkstatus']
                    # teavideostatus = args['teavideostatus']
                    # teasoundstatus = args['teasoundstatus']
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

                    # if teavideostatus is not None:
                    #     print("Teacher status changes to {0}".format(str(teavideostatus)))
                    #     redis_store.hset('teavideostatus_dict:'+classid,
                    #                      teaname, teavideostatus)
                    #     teavideostatus_hash = redis_store.hgetall('teavideostatus_dict:'+classid)
                    #     teavideostatus_dict = {"0": [], "1": [], "2": [], "3": []}
                    #     for (k, v) in teavideostatus_hash.items():
                    #         for ni in range(4):
                    #             if v == str(ni):
                    #                 teavideostatus_dict[str(ni)].append(k)
                    #                 break

                    #     sse.publish({"teavideostatus":teavideostatus_dict},
                    #                 type="newteavideostatus"+classstr,
                    #                 channel="changed.status")
                    #     print(teavideostatus_dict)
                    #     print("newteavideostatus"+classstr)

                    # if teasoundstatus is not None:
                    #     print("Teacher status changes to {0}".format(str(teasoundstatus)))
                    #     redis_store.hset('teasoundstatus_dict:'+classid,
                    #                      teaname, teasoundstatus)
                    #     teasoundstatus_hash = redis_store.hgetall('teasoundstatus_dict:'+classid)
                    #     teasoundstatus_dict = {"0": [], "1": [], "2": [], "3": []}
                    #     for (k, v) in teasoundstatus_hash.items():
                    #         for ni in range(4):
                    #             if v == str(ni):
                    #                 teasoundstatus_dict[str(ni)].append(k)
                    #                 break

                    #     sse.publish({"teasoundstatus":teasoundstatus_dict},
                    #                 type="newteasoundstatus"+classstr,
                    #                 channel="changed.status")
                    #     print(teasoundstatus_dict)
                    #     print("newteasoundstatus"+classstr)

                    stuname = args['stuname']
                    stulinkstatus = args['stulinkstatus']
                    stuvideostatus = args['stuvideostatus']
                    stusoundstatus = args['stusoundstatus']

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

                    # if stuvideostatus is not None:
                    #     print("Student status changes to {0}".format(str(stuvideostatus)))
                    #     redis_store.hset('stuvideostatus_dict:'+classid,
                    #                      stuname, stuvideostatus)
                    #     stuvideostatus_hash = redis_store.hgetall('stuvideostatus_dict:'+classid)
                    #     stuvideostatus_dict = {"0": [], "1": [], "2": [], "3": []}
                    #     for (k, v) in stuvideostatus_hash.items():
                    #         for ni in range(4):
                    #             if v == str(ni):
                    #                 stuvideostatus_dict[str(ni)].append(k)
                    #                 break

                    #     sse.publish({"stuvideostatus":stuvideostatus_dict},
                    #                 type="newstuvideostatus"+classstr,
                    #                 channel="changed.status")
                    #     print(stuvideostatus_dict)
                    #     print("newstuvideostatus"+classstr)

                    # if stusoundstatus is not None:
                    #     print("Student status changes to {0}".format(str(stusoundstatus)))
                    #     redis_store.hset('stusoundstatus_dict:'+classid,
                    #                      stuname, stusoundstatus)
                    #     stusoundstatus_hash = redis_store.hgetall('stusoundstatus_dict:'+classid)
                    #     stusoundstatus_dict = {"0": [], "1": [], "2": [], "3": []}
                    #     for (k, v) in stusoundstatus_hash.items():
                    #         for ni in range(4):
                    #             if v == str(ni):
                    #                 stusoundstatus_dict[str(ni)].append(k)
                    #                 break

                    #     sse.publish({"stusoundstatus":stusoundstatus_dict},
                    #                 type="newstusoundstatus"+classstr,
                    #                 channel="changed.status")
                    #     print(stusoundstatus_dict)
                    #     print("newstusoundstatus"+classstr)

                    # assname = args['assname']
                    # asslinkstatus = args['asslinkstatus']
                    # assvideostatus = args['assvideostatus']
                    # asssoundstatus = args['asssoundstatus']

                    # if asslinkstatus is not None:
                    #     print("Assistant status changes to {0}".format(str(asslinkstatus)))
                    #     redis_store.hset('asslinkstatus_dict:'+classid,
                    #                      assname, asslinkstatus)

                    #     asslinkstatus_hash = redis_store.hgetall('asslinkstatus_dict:'+classid)
                    #     asslinkstatus_dict = {"0": [], "1": [], "2": [], "3": []}
                    #     for (k, v) in asslinkstatus_hash.items():
                    #         for ni in range(4):
                    #             if v == str(ni):
                    #                 asslinkstatus_dict[str(ni)].append(k)
                    #                 break

                    #     sse.publish({"asslinkstatus":asslinkstatus_dict},
                    #                 type="newasslinkstatus"+classstr,
                    #                 channel="changed.status")
                    #     print(asslinkstatus_dict)
                    #     print("newasslinkstatus"+classstr)

                    # if assvideostatus is not None:
                    #     print("Assistant status changes to {0}".format(str(assvideostatus)))
                    #     redis_store.hset('assvideostatus_dict:'+classid,
                    #                      assname, assvideostatus)
                    #     assvideostatus_hash = redis_store.hgetall('assvideostatus_dict:'+classid)
                    #     assvideostatus_dict = {"0": [], "1": [], "2": [], "3": []}
                    #     for (k, v) in assvideostatus_hash.items():
                    #         for ni in range(4):
                    #             if v == str(ni):
                    #                 assvideostatus_dict[str(ni)].append(k)
                    #                 break

                    #     sse.publish({"assvideostatus":assvideostatus_dict},
                    #                 type="newassvideostatus"+classstr,
                    #                 channel="changed.status")
                    #     print(assvideostatus_dict)
                    #     print("newassvideostatus"+classstr)

                    # if asssoundstatus is not None:
                    #     print("Assistant status changes to {0}".format(str(asssoundstatus)))
                    #     redis_store.hset('asssoundstatus_dict:'+classid,
                    #                      assname, asssoundstatus)
                    #     asssoundstatus_hash = redis_store.hgetall('asssoundstatus_dict:'+classid)
                    #     asssoundstatus_dict = {"0": [], "1": [], "2": [], "3": []}
                    #     for (k, v) in asssoundstatus_hash.items():
                    #         for ni in range(4):
                    #             if v == str(ni):
                    #                 asssoundstatus_dict[str(ni)].append(k)
                    #                 break

                    #     sse.publish({"asssoundstatus":asssoundstatus_dict},
                    #                 type="newasssoundstatus"+classstr,
                    #                 channel="changed.status")
                    #     print(asssoundstatus_dict)
                    #     print("newasssoundstatus"+classstr)

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
                # elif roleid == 3:
                #     assname = args['assname']
                #     asslinkstatus = args['asslinkstatus']
                #     print("Assistant status changes to {0}".format(str(asslinkstatus)))
                #     redis_store.hset('asslinkstatus_dict:'+classid,
                #                      assname, asslinkstatus)

                #     asslinkstatus_hash = redis_store.hgetall('asslinkstatus_dict:'+classid)
                #     asslinkstatus_dict = {"0": [], "1": [], "2": [], "3": []}
                #     for (k, v) in asslinkstatus_hash.items():
                #         for ni in range(4):
                #             if v == str(ni):
                #                 asslinkstatus_dict[str(ni)].append(k)
                #                 break

                #     sse.publish({"asslinkstatus":asslinkstatus_dict},
                #                 type="newasslinkstatus"+classstr,
                #                 channel="changed.status")
                #     print(asslinkstatus_dict)
                #     print("newasslinkstatus"+classstr)
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
                classname = redis_store.get('classname:'+classid)

                # classroom = Classroom.query.filter_by(id=classid).all()
                # classname = classroom[0].name
                dic_chatlist = dict(classname=classname, chatcontent=[])

                # ls_chat = Chatroom.query.filter_by(classid=classid).all()
                # for ti in ls_chat:
                #     str_createdate = ti.createtime.strftime("%Y-%m-%d")
                #     str_nowdate = nowtime.strftime("%Y-%m-%d")
                #     if str_createdate == str_nowdate:
                #         users = Users.query.filter_by(id=ti.userid).all()
                #         username = users[0].name
                #         roleid = users[0].roleid
                #         if roleid == 1:
                #             rolename = "teacher"
                #         elif roleid == 2:
                #             rolename = "student"
                #         question = ti.comment
                #         createtime = ti.createtime.strftime("%Y-%m-%d %H:%M:%S")
                #         dic_chatitem = dict(username=username,
                #                             createtime=createtime,
                #                             rolename=rolename,
                #                             question=question)
                #         dic_chatlist["chatcontent"].append(dic_chatitem)

                chatcontent_list = redis_store.lrange("chatcontent:"+classid, 0, -1)
                print("Read from redis")
                print(chatcontent_list)
                for i in range(0,len(chatcontent_list),4):
                    dic_chatitem = dict(username=chatcontent_list[i+3],
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
                username = redis_store.get("username:"+userid)
                roleid = redis_store.get("roleid:"+userid)
                createtime = datetime.datetime.now()
                # users = Users.query.filter_by(id=userid).all()
                # roleid = users[0].roleid
                # id = str(uuid.uuid4())
                # name = users[0].name
                # comment = question
                # print(question)
                # chatitem = Chatroom(id, name, createtime, comment, userid, classid)
                # db.session.add(chatitem)
                # db.session.commit()
                if roleid == '1':
                    rolename = "teacher"
                elif roleid == '2':
                    rolename = "student"
                createtimestr = createtime.strftime("%Y-%m-%d %H:%M:%S")
                newmessage = dict(username=username,
                                  createtime=createtimestr,
                                  rolename=rolename,
                                  question=question)
                print("Ready to save redis")
                redis_store.lpush("chatcontent:"+classid, username)
                redis_store.lpush("chatcontent:"+classid, createtimestr)
                redis_store.lpush("chatcontent:"+classid, rolename)
                redis_store.lpush("chatcontent:"+classid, question)
                print(newmessage)
                sse.publish({"message":newmessage},
                            type=("newchatmessage"+classstr),
                            channel="changed.chatroom")
                # print("newchatmessage"+classstr)
                # print(len("newchatmessage"+classstr))
                return "Success to add new question"
            else:
                return "You have no right to do this"
        except Exception as err:
            print("Fail to add chat text")
            print(err)
