"""
Created on 2016/05/09

@author: Eric Zhao
@description: all views of webpage is rendered in this module

"""
from datetime import timedelta

import flask
from flask_restful import Api, Resource, reqparse, fields

from common.conference import Conference
from common.dbmanage import DbManage
from common.classroom import NewClassroom

webpage = flask.Flask(__name__)
webpage.secret_key = 'mywebinarxiyoumencom'
webpage.permanent = True
webpage.permanent_session_lifetime = timedelta(minutes=5)

resapi = Api(webpage)

parser = reqparse.RequestParser()
parser.add_argument('classid', required=True, help="classid cann't be blank")
parser.add_argument('userid', required=True)
ins_db = DbManage()
ins_conference = Conference()
userinfo = {}


class Classroom(Resource):
    """
    # Class classroom is resource of "classroom_ep"
    """
    def get(self):
        """
        # function get response http GET with classroom.html
        """
        try:
            if ('classid' in flask.session) and (
                    'userid' in flask.session):
                print('Session is available')
                return webpage.send_static_file('classroom.html')
            else:
                print('Session is not ready')
                return flask.redirect(fields.url_for('login_ep'))
        except Exception as err:
            print("Fail to get classroom info")
            print(err)

resapi.add_resource(Classroom, '/', '/classroom', endpoint='classroom_ep')


class Login(Resource):
    """
    # This class will return index html
    """
    def get(self):
        """
        # function get response http GET with login.html
        """
        try:
            if ('classid' in flask.session) and (
                    'userid' in flask.session):
                userinfo['classid'] = flask.session['classid']
                userinfo['userid'] = flask.session['userid']
                userinfo['classname'] = flask.session['classname']
                userinfo['username'] = flask.session['username']
                print(userinfo)
                return userinfo
            else:
                return webpage.send_static_file('login.html')
        except Exception as err:
            print(err)

    def post(self):
        """
        # function post check post classid and userid
        # and response classroom.html or index.html
        """
        try:
            args = parser.parse_args()
            classid = args['classid']
            userid = args['userid']
            tx = 't1'
            collist = ['name', 'classname']
            wherestr = "id='{0}' and classid='{1}'".format(userid, classid)
            sellist = ins_db.get_table(tx, collist, wherestr)
            username = sellist[0][0]
            classname = sellist[0][1]
            if ins_conference.check_access(classid, userid) != '':
                flask.session['classid'] = classid
                flask.session['userid'] = userid
                flask.session['classname'] = classname
                flask.session['username'] = username
                print('Success to pass validation')
                return flask.redirect(fields.url_for('classroom_ep'))
            else:
                print('fail to pass validation')
                return webpage.send_static_file('login.html')
        except Exception as err:
            print(err)
            return webpage.send_static_file('login.html')

resapi.add_resource(Login, '/login', endpoint='login_ep')


class Logout(Resource):
    """
    # This class will return login html
    """
    def get(self):
        """
        # function get response http GET with login.html
        """
        try:
            if ('classid' in flask.session) and (
                    'userid' in flask.session):
                flask.session.pop('classid', None)
                flask.session.pop('userid', None)
                print('Success to clear session')
                return flask.redirect(fields.url_for('login_ep'))
            else:
                return flask.redirect(fields.url_for('login_ep'))
        except Exception as err:
            print(err)

resapi.add_resource(Logout, '/logout', endpoint='logout_ep')


class Token(Resource):
    """
    # This class returns token json
    """
    def get(self):
        """
        # function get response http GET with token json
        """
        try:
            err = "classid or userid is not existed."
            if ('userid' in flask.session) and (
                    'classid' in flask.session):
                classid = flask.session['classid']
                userid = flask.session['userid']
                username = flask.session['username']
                tmptoken = ins_conference.get_accesstoken(
                    classid, userid, username)
                tmptoken = flask.jsonify(
                        identity=tmptoken.identity, token=tmptoken.to_jwt())
                print('Success to create token')
                return tmptoken
            else:
                print('Fail to create token')
                return flask.redirect(fields.url_for('login_ep'))
        except Exception as err:
            print(err)

resapi.add_resource(
    Token, '/token', endpoint='token_ep')


class Conversation(Resource):
    """
    # This class response conversation events
    """
    def __init__(self):
        self.dic_event = {}

    def get(self):
        """
        # function get response http GET with login.html
        """
        try:
            if ('classid' in flask.session) and (
                    'userid' in flask.session):
                return self.dic_event
            else:
                return webpage.send_static_file('login.html')
        except Exception as err:
            print(err)

    def post(self):
        """
        # function post check post classid and userid
        # and response classroom.html or index.html
        """
        try:
            args = parser.parse_args()
            event_status = args['event']
            if ('classid' in flask.session) and (
                    'userid' in flask.session):
                self.dic_event['event'] = event_status
                return self.dic_event
            else:
                print('fail to pass validation')
                return webpage.send_static_file('login.html')
        except Exception as err:
            print(err)
            return webpage.send_static_file('login.html')

resapi.add_resource(Conversation, '/conversation', endpoint='conversation_ep')
