"""
This Module tends to create subaccount according to account master.
"""
import twilio.rest

from mysite.conf_twilio import conf_twilio_master

ACCOUNT_RESERVED = 'subACC'

class SubAccount():
    """
    # Class SubAccount tends to manage the subaccount, add, delete, list
    """
    def __init__(self):
        # My Master Account Sid and Auth Token from twilio_access.conf
        account_sid = conf_twilio_master['account_sid']
        auth_token = conf_twilio_master['auth_token']
        self.myclient = twilio.rest.TwilioRestClient(
            account_sid, auth_token)

    def create_subaccount(self, sub_name):
        """
        # create subaccount with friendly name :sub_name
        """
        try:
            print('Start to create subaccount')
            newaccountinfo = self.myclient.accounts.create(
                friendly_name=sub_name)
            print('Success to create new subaccount {0} with {1}'.format(
                newaccountinfo.sid, sub_name))
        except twilio.rest.exceptions.TwilioRestException as err:
            print('fail to create new subaccount')
            print(err)

    def close_subaccount(self, sname):
        """
        # close subaccount with sub_name
        """
        try:
            accountlist = self.myclient.accounts.list(friendly_name=sname)
            print('Start to close subaccount {0}'.format(sname))
            for item in accountlist:
                self.myclient.accounts.close(item.sid)
                print('Success to close subaccount with {0}'.format(
                    item.friendly_name))
        except twilio.rest.exceptions.TwilioRestException as err:
            print('fail to close new subaccount')
            print(err)

    def rename_sid(self, sid, newname):
        """
        # update subaccount with sub_name
        """
        try:
            print('Start to update subaccount {0} to {1}'.format(
                sid, newname))
            self.myclient.accounts.update(sid, friendly_name=newname)
            print('Success to update subaccount {0} to {1}'.format(
                sid, newname))
        except twilio.rest.exceptions.TwilioRestException as err:
            print('fail to update subaccount')
            print(err)

    def rename_oldname(self, oldname, newname):
        """
        # rename subaccount with sub_name
        """
        try:
            accountlist = self.myclient.accounts.list(friendly_name=oldname)
            print('Start to update subaccount {0}'.format(oldname))
            for item in accountlist:
                self.myclient.accounts.update(item.sid, friendly_name=newname)
                print('Success to update subaccount with {0}'.format(
                    newname))
        except twilio.rest.exceptions.TwilioRestException as err:
            print('fail to update subaccount')
            print(err)
