# -*- coding: utf-8 -*-
"""
migrations
~~~~~~~~~~~~~~

Module runserver starts web server of flask 

:copyright: (c) 2016 by ERIC ZHAO.
:license: 
"""
from xiyoumenapp import webapp
from xiyoumenapp.apps import loginapi_bp, classapi_bp, tokenapi_bp, infoapi_bp
from mysite import settings

if __name__ == '__main__':
    # Register api into blueprint
    webapp.register_blueprint(loginapi_bp, url_prefix='/classroom')
    # Register api into blueprint
    webapp.register_blueprint(classapi_bp, url_prefix='/class')
    # Register api into blueprint
    webapp.register_blueprint(tokenapi_bp, url_prefix='/token')
    # Register api into blueprint
    webapp.register_blueprint(infoapi_bp, url_prefix='/info')

    webapp.run(host=settings.HOST, port=settings.PORT, debug=settings.DEBUG)
