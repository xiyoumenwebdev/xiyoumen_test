# -*- coding: utf-8 -*-
"""
test
~~~~~~~~~~~~~~

Module test tests  all modules

:copyright: (c) 2016 by ERIC ZHAO.
:license: 
"""

from mysite import settings, conf_twilio

from xiyoumenapp.subaccount import SubAccount
from xiyoumenapp.subaccount import ACCOUNT_RESERVED
from xiyoumenapp.settings import SQLALCHEMY_DATABASE_URI, SQLALCHEMY_TRACK_MODIFICATIONS, CSRF_ENABLED, SECRET_KEY
from xiyoumenapp.models import Classroom, Users, Subaccount, Connection, Description
from xiyoumenapp.jsonapp import JsonManage
from xiyoumenapp.env import EnvManage
from xiyoumenapp.classroom import NewClassroom
from xiyoumenapp.conference import Conference

if __name__ == '__main__':
# test package mysite
    # test module settings
    """
    print("Settings includes {0}, {1}, {2}, {3}".format(settings.BASE_DIR,
        settings.HOST, settings.PORT, settings.DEBUG))
    """
    # test module conf_twilio
    """
    print("conf_twilio includes {0}, {1}, {2}, {3}, {4}".format(
        conf_twilio.conf_twilio_master['account_sid'],
        conf_twilio.conf_twilio_master['auth_token'], 
        conf_twilio.conf_twilio_master['apisecret'], 
        conf_twilio.conf_twilio_master['apikey'], 
        conf_twilio.conf_twilio_master['config_sid']))
    """

# test package xiyoumenapp
    # test module subaccount
    """
    print("ACCOUNT_RESERVED is {0}".format(ACCOUNT_RESERVED))
    ins_newsubaccount = SubAccount()
    newsubaccount = ins_newsubaccount.create_subaccount(ACCOUNT_RESERVED)
    """

    # test module settings
    """
    print("Settings includes {0}, {1}, {2}, {3}".format(CSRF_ENABLED,
        SECRET_KEY, SQLALCHEMY_TRACK_MODIFICATIONS, SQLALCHEMY_DATABASE_URI))
    """

    # test module models

    # test module jsonapp
    """
    ins_json = JsonManage()
    ins_json.save_classinfo()
    """

    # test module env
    """
    ins_env = EnvManage()
    ins_env.fill_poolsubaccount()
    ins_env.fill_dbsubaccount()
    """

    # test module classroom
    """
    ins_cls = NewClassroom()
    ins_cls.check_account()
    ins_cls.create_newclass()
    """

    # test module conference
    wrongid_list = ['cl000', 'stu000']
    rightid_list = ['d53d9c6a-a64f-4171-b788-ecb959e68fb0',
            '20390363-6f26-4bec-91eb-f2318a9e6935']
    print("This tests wrong")
    ins_confwrong = Conference(wrongid_list[0], wrongid_list[1])
    myca = ins_confwrong.check_access()
    print(myca)
    print("This tests right")
    ins_confright = Conference(rightid_list[0], rightid_list[1])
    myca = ins_confright.check_access()
    mytoken = ins_confright.get_accesstoken("Mr. Right")
    print(myca)
    print(mytoken)
