# -*- coding: utf-8 -*-
"""
tellhowapp.apps
~~~~~~~~~~~~~~

apps of webpage is builded in this module

:copyright: (c) 2016 by ERIC ZHAO.
:license: 
"""
from flask import Blueprint
from flask_restful import Api

from xiyoumenapp import webapp
from xiyoumenapp.views import Login, ClassRoom, Token, Info


# define api into Blueprint
loginapi_bp = Blueprint('loginapi', __name__)
loginapi = Api(loginapi_bp)
# add webapp resource into api
loginapi.add_resource(Login, '/<classid>/<userid>',
                          endpoint='login_ep')
# Register api into blueprint
# webapp.register_blueprint(loginapi_bp, url_prefix='/classroom')


# define api into Blueprint
classapi_bp = Blueprint('classapi', __name__)
classapi = Api(classapi_bp)
# add webapp resource into api
classapi.add_resource(ClassRoom, '/',
                          endpoint='class_ep')
# Register api into blueprint
# webapp.register_blueprint(classapi_bp, url_prefix='/class')


# define api into Blueprint
tokenapi_bp = Blueprint('tokenapi', __name__)
tokenapi = Api(tokenapi_bp)
# add webapp resource into api
tokenapi.add_resource(Token, '/', endpoint='token_ep')
# Register api into blueprint
# webapp.register_blueprint(tokenapi_bp, url_prefix='/token')


# define api into Blueprint
infoapi_bp = Blueprint('infoapi', __name__)
infoapi = Api(infoapi_bp)
# add webapp resource into api
infoapi.add_resource(Info, '/', endpoint='info_ep')
# Register api into blueprint
# webapp.register_blueprint(infoapi_bp, url_prefix='/info')
