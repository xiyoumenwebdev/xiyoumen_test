# -*- coding: utf-8 -*-
"""
xiyoumenapp.conference
~~~~~~~~~~~~~~

Module conference tens to check right of access and build token

:copyright: (c) 2016 by ERIC ZHAO.
:license: 
"""
from twilio.access_token import AccessToken, ConversationsGrant

from xiyoumenapp.models import Subaccount, Classroom, Users, Users_Classroom


class Conference():
    """
    # Class Conference tends to manage conference
    """
    def __init__(self, classid, userid):
        # My Master Account Sid and Auth Token from twilio_access.conf
        self.classid = classid
        self.userid = userid

    def check_access(self):
        """
        # Select sid from t1, according userid and classid
        """
        try:
            uc = Users_Classroom.query.filter_by(userid=self.userid,
                            classid=self.classid).all()
            classinfo = Classroom.query.filter_by(id=self.classid).all()

            if len(uc) == 1 and classinfo[0].statusid<2:
                sid = classinfo[0].subaccountid
                return sid
            else:
                print('classid or userid is not correct')
                return None
        except ValueError as err:
            print(err)

    def get_accesstoken(self):
        """
        # This function builds jwt of access token with username
        """
        # Select sid from t1, according userid and classid
        sid = self.check_access()
        # Select authtoken, apikey, secret fro table t0.
        infoacc = Subaccount.query.filter_by(id=sid).all()
        users = Users.query.filter_by(id=self.userid).all()

        # Substitute your Twilio AccountSid and ApiKey details
        ACCOUNT_SID = sid
        API_KEY_SID = infoacc[0].apikey
        API_KEY_SECRET = infoacc[0].apisecret
        CONFIGURATION_SID = infoacc[0].configid

        # Create an Access Token
        token = AccessToken(ACCOUNT_SID, API_KEY_SID, API_KEY_SECRET)

        # Set the Identity of this  token
        username = users[0].name
        token.identity = username

        # Grant access to Conversations
        grant = ConversationsGrant()
        grant.configuration_profile_sid = CONFIGURATION_SID
        token.add_grant(grant)
        # Return token info as JSON
        return token
