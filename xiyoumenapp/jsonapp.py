# -*- coding: utf-8 -*-
"""
xiyoumenapp.jsonapp
~~~~~~~~~~~~~~

Module jsonapp fetches user and class info from json file of xiyoumen.com

:copyright: (c) 2016 by ERIC ZHAO.
:license: 
"""
import json
import os
import uuid
from httplib2 import Http
from datetime import datetime

from xiyoumenapp.subaccount import ACCOUNT_RESERVED
from xiyoumenapp.models import Subaccount, Users, Classroom, Users_Classroom
from xiyoumenapp import db

FJSON = "classinfo.json"
WEBJSON = "http://www.xiyoumen.com/templates/frontend/getClassesInfo.action"

def _get_json():
    """
    # Get json from xiyoumen.com
    """
    conn = Http(".cache")
    resp, content = conn.request(WEBJSON,
            "GET", headers={'content-type':'text/plain'} )
    str_json = bytes.decode(content)
    print("Success to Get json from web")
    return str_json

def check_existings(table_name):
    """
    # Check item "is or is not existings" in tables 
    """
    ds = db.session.query(table_name).all()
    def _check_existings(func):
        def __check_existings():
            func()
        return __check_existings
    return _check_existings

class JsonManage():
    """
    # class JsonManage get json info from tmpclass.json
    """
    def __init__(self):
        root_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        json_path = os.path.join(root_path, 'temp')
        self.jsonfile = os.path.join(json_path, FJSON)
        
        db.session.query(Users).delete()
        db.session.query(Classroom).delete()
        db.session.query(Users_Classroom).delete()
        db.session.commit()
        print("Success to clear data in Database")

        if os.path.isfile(self.jsonfile):
            os.remove(self.jsonfile)
            print("Success to delete local json file")
            str_json = _get_json()
            self.dic_json = json.loads(str_json)
            with open(self.jsonfile, 'w') as fjson:
                json.dump(self.dic_json, fjson)
            print("Success to save local json file")
        else:
            str_json = _get_json()
            self.dic_json = json.loads(str_json)
            with open(self.jsonfile, 'w') as fjson:
                json.dump(self.dic_json, fjson)
            print("Success to save local json file")

        self.acc_all = Subaccount.query.filter_by(name=ACCOUNT_RESERVED).all()
        print(self.acc_all)

    def save_classinfo(self):
        """
        # parse classinfo as table fields, and save into local json file.
        """
        newclassinfo = self.fetch_classinfo()
        idxacc = 0
        comment = ''
        datetime_now = datetime.now()
        
        for citem in newclassinfo:
            classroom = citem['class']
            classid = classroom['id']
            classname = classroom['name']
            statusid = classroom['classStatus']
            sid = self.acc_all[idxacc].id
            idxacc = idxacc + 1
            ds_all = db.session.query(Classroom).all()
            dsid_list = [di.id for di in ds_all]
            if classid not in dsid_list:
                class_info = Classroom(classid, classname, datetime_now, comment, sid, statusid)
                db.session.add(class_info)
                db.session.commit()
                print("Success to save new classroom {0}".format(classname))

            userid = classroom['teacherID']
            username = classroom['teacherName']
            roleid = 1
            ds_all = db.session.query(Users).all()
            dsid_list = [di.id for di in ds_all]
            if userid not in dsid_list:
                user_info = Users(userid, username, datetime_now, comment, roleid)
                db.session.add(user_info)
                db.session.commit()
                print("Success to save new teacher {0}".format(username))
            
            myid = str(uuid.uuid4())
            uc_info = Users_Classroom(myid, userid, classid)
            db.session.add(uc_info)
            db.session.commit()
            for uitem in citem['students']:
                ds_all = db.session.query(Users).all()
                dsid_list = [di.id for di in ds_all]
                userid = uitem['id']
                username = uitem['name']
                roleid = 2
                print("username is {0}".format(username))
                if userid not in dsid_list and username is not None:
                    user_info = Users(userid, username, datetime_now, comment, roleid)
                    db.session.add(user_info)
                    db.session.commit()
                    print("Success to save new student {0}".format(username))

                myid = str(uuid.uuid4())
                uc_info = Users_Classroom(myid, userid, classid)
                db.session.add(uc_info)
                db.session.commit()

    def fetch_classinfo(self):
        """
        # fetch new class info from json of xiyoumen.com
        """
        newclassinfo = [citem for citem in self.dic_json]
        print("There are {0} new class".format(len(newclassinfo)))
        return newclassinfo
