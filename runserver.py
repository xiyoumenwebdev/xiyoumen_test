# -*- coding: utf-8 -*-
"""
migrations
~~~~~~~~~~~~~~

Module runserver starts web server of flask 

:copyright: (c) 2016 by ERIC ZHAO.
:license: 
"""
from xiyoumenapp import webapp
from xiyoumenapp import apps
from xiyoumenapp import admin
from mysite import settings

if __name__ == '__main__':
    webapp.run(host=settings.HOST, port=settings.PORT, debug=settings.DEBUG)
