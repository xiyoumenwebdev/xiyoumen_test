"""
This Module tends to manage environment,
including account pool, user and account mapping,
api key configuration.
"""

import twilio.rest
import uuid

from datetime import datetime

from xiyoumenapp import db
from xiyoumenapp.subaccount import SubAccount, ACCOUNT_RESERVED
from xiyoumenapp.models import Subaccount, Description
from mysite.conf_twilio import conf_twilio_master, conf_twilio_pool

def create_apikey(acc_sid, acc_authtoken, key_name):
    """
    # create API key with name : key_name
    """
    try:
        subclient = twilio.rest.TwilioRestClient(
            acc_sid, acc_authtoken)
        print('Start to create new API key')
        newkeyinfo = subclient.keys.create(friendly_name=key_name)
        print('Success to create new keys {0} with {1}'.format(
            newkeyinfo.sid, key_name))
        return newkeyinfo
    except twilio.rest.exceptions.TwilioRestException as err:
        print('fail to create new keys')
        print(err)


def get_apikey(acc_sid, acc_authtoken):
    """
    # Get API key with acc_sid
    """
    try:
        subclient = twilio.rest.TwilioRestClient(
            acc_sid, acc_authtoken)
        print('Start to get new API key')
        newkeyinfo = subclient.keys.list()
        print('Success to get new keys {0}'.format(
            newkeyinfo))
        return newkeyinfo
    except twilio.rest.exceptions.TwilioRestException as err:
        print('fail to get new keys')
        print(err)

def define_desc(desc_list, table_list):
    """
    # Define the description in table dic_desc
    """
    try:
        num_desc = 0
        for n in desc_list:
            descid = str(uuid.uuid4())
            descname = n
            desctime = datetime.now()
            desccomment = table_list[num_desc]
            id_desc = num_desc
            num_desc = num_desc + 1
            newdesc = Description(descid, descname, desctime, desccomment,
                    id_desc)
            db.session.add(newdesc)
            db.session.commit()
        print("Success to define description")
    except Exception as err:
        print('fail to define description')
        print(err)


class EnvManage():
    """
    # Class EnvManage tends to manage environment,
    # including account pool, user and account mapping,
    # api key configuration.
    """
    def __init__(self):
        # My Master Account Sid and Auth Token from settings
        self.mastersid = conf_twilio_master['account_sid'] 
        self.auth_token = conf_twilio_master['auth_token'] 

        self.minrest = conf_twilio_pool['minrest']
        self.maxrest = conf_twilio_pool['maxrest']

        self.mysub = SubAccount()

    def fill_description(self):
        """
        # Fill description into table dic_desc 
        """
        table_list = ['info_subaccount', 'info_classroom', 'info_users',
                    'info_uc', 'log_conn']
        class_list =['Subaccount', 'Classroom', 'Users', 'Users_Classroom',
                    'Connection']
        desc_list00 = ["Active", "Suspended", "Closed"]
        desc_list01 = ["Ready", "Begin", "End", "Closed"]
        desc_list02 = ["Normal", "Error"]
        table_list00 = [table_list[0], table_list[0], table_list[0]]
        table_list01 = [table_list[1], table_list[1], table_list[1],
                table_list[1]]
        table_list02 = [table_list[4], table_list[4]]
        db.session.query(Description).delete()
        db.session.commit()
        define_desc(class_list, table_list)
        define_desc(desc_list00, table_list00) 
        define_desc(desc_list01, table_list01)
        define_desc(desc_list02, table_list02)
        print("Success to fill description")
        

    def fill_poolsubaccount(self):
        """
        # manage the pool of subaccount, keep rest in 10
        """
        try:
            print(ACCOUNT_RESERVED)
            subacc = self.mysub.myclient.accounts.list(friendly_name=ACCOUNT_RESERVED)
            numacc = len(subacc)
            numnew = 0
            print(numacc)
            if numacc < self.minrest:
                sub_name = "subAC"
                self.mysub.create_subaccount(sub_name)
                numnew = numnew + 1
            print('created {0} subaccount'.format(numnew))
        except twilio.rest.exceptions.TwilioRestException as err:
            print('fail to fill pool of subaccounts')
            print(err)

    def fill_dbsubaccount(self):
        """
        # manage the database of subaccount with table info_subaccount
        """
        try:
            subacc = self.mysub.myclient.accounts.list(friendly_name='subAC')

            dbacc = Subaccount.query.filter_by(name=ACCOUNT_RESERVED).all()

            num_acc = len(dbacc)
            print('There are {0} reserve accounts in table {1}'.format(
                num_acc, 'info_subaccount'))
            if num_acc < self.minrest:
                num_need = self.minrest - num_acc
                for item in subacc[0:num_need]:
                    ds_ck = Subaccount.query.filter_by(id=item.sid).all()
                    if len(ds_ck) != 0:
                        print("Account {0} is existed.".format(item.sid))
                    else:
                        subid = item.sid
                        name = item.friendly_name
                        # createtime = str(item.date_created)
                        createtime = datetime.now()
                        comment = ''
                        auth_token = item.auth_token
                        key_name = 'k' + subid
                        newkey = create_apikey(subid, auth_token, key_name)
                        apikey = newkey.sid
                        apisecret = newkey.secret
                        configid = "XXXXXXXXXXXXX"
                        # status_desc = Description.query.filter_by(name=item.status).all()
                        # print(status_desc)
                        # statusid = status_desc[0].id_desc
                        statusid = 0
                        newacc = Subaccount(subid, name, createtime, comment,
                                auth_token, apikey, apisecret, configid, statusid)
                        db.session.add(newacc)
                        db.session.commit()
                        print("Account {0} is inserted".format(item.sid))
                print('Success to insert {0} subaccount'.format(num_need))
            else:
                print('Already have enough backup accounts')
        except twilio.rest.exceptions.TwilioRestException as err:
            print('fail to fill subaccounts into database')
            print(err)

    def conf_masterapikey(self):
        """
        # create api key and save into twilio_access.conf
        """
        if  'apikey' not in conf_twilio_master.keys():
            new_key = create_apikey(self.mastersid, self.auth_token, 'acckey')
            conf_twilio_master['apikey'] = new_key.sid
            conf_twilio_master['apisecret'] = new_key.secret
            print('Success to create a new key and save to conf_twilio.py')
        else:
            print('Already have apikey in conf_twilio.py')
