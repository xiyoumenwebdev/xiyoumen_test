# -*- coding: utf-8 -*-
"""
tellhowapp.apps
~~~~~~~~~~~~~~

apps of webpage is builded in this module

:copyright: (c) 2016 by ERIC ZHAO.
:license: 
"""

import os

from flask import Blueprint
from flask_restful import Api

from xiyoumenapp import webapp
from xiyoumenapp.views import Test, Login, ClassRoom, Token, Info, ChatList, Whiteboard


# define api into Blueprint
testapi_bp = Blueprint('testapi', __name__)
testapi = Api(testapi_bp)
# add webapp resource into api
testapi.add_resource(Test, '/', endpoint='test_ep')
# Register api into blueprint
webapp.register_blueprint(testapi_bp, url_prefix='/test')


# define api into Blueprint
loginapi_bp = Blueprint('loginapi', __name__)
loginapi = Api(loginapi_bp)
# add webapp resource into api
loginapi.add_resource(Login, '/<classid>/<userid>', endpoint='login_ep')
# Register api into blueprint
webapp.register_blueprint(loginapi_bp, url_prefix='/classroom')


# define api into Blueprint
tokenapi_bp = Blueprint('tokenapi', __name__)
tokenapi = Api(tokenapi_bp)
# add webapp resource into api
tokenapi.add_resource(Token, '/', endpoint='token_ep')
# Register api into blueprint
webapp.register_blueprint(tokenapi_bp, url_prefix='/token')


# define api into Blueprint
chatlistapi_bp = Blueprint('chatlistapi', __name__)
chatlistapi = Api(chatlistapi_bp)
# add webapp resource into api
chatlistapi.add_resource(ChatList, '/', endpoint='chatlist_ep')
# Register api into blueprint
webapp.register_blueprint(chatlistapi_bp, url_prefix='/chatlist')


# define api into Blueprint
infoapi_bp = Blueprint('infoapi', __name__)
infoapi = Api(infoapi_bp)
# add webapp resource into api
infoapi.add_resource(Info, '/', endpoint='info_ep')
# Register api into blueprint
webapp.register_blueprint(infoapi_bp, url_prefix='/info')


# define api into Blueprint
whiteboardapi_bp = Blueprint('whiteboardapi', __name__)
whiteboardapi = Api(whiteboardapi_bp)
# add webapp resource into api
whiteboardapi.add_resource(Whiteboard, '/', endpoint='whiteboard_ep')
# Register api into blueprint
webapp.register_blueprint(whiteboardapi_bp, url_prefix='/whiteboard')


# sfolder = os.path.join("static", "assets")
# tfolder = os.path.join("templates", "frontend")
# define api into Blueprint
# classapi_bp = Blueprint('classapi', __name__, static_folder=sfolder, template_folder=tfolder)
classapi_bp = Blueprint('classapi', __name__)
classapi = Api(classapi_bp)
# add webapp resource into api
classapi.add_resource(ClassRoom, '/', endpoint='class_ep')
# Register api into blueprint
webapp.register_blueprint(classapi_bp, url_prefix='/class')
