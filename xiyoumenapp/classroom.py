"""
This Module create class.
"""

from xiyoumenapp.env import EnvManage
from xiyoumenapp.jsonapp import JsonManage


class NewClassroom():
    """
    # Class NewClassroom manage openness of new class.
    """
    def __init__(self):
        # My Master Account Sid and Auth Token from twilio_access.conf
        self.ins_env = EnvManage()
        self.ins_json = JsonManage()

    def check_account(self):
        """
        # function check_account check pool of accounts,
        # if pool is full, do nothing,
        # if pool is not full, fill it and add it to database.
        """
        try:
            self.ins_env.fill_poolsubaccount()
            self.ins_env.fill_dbsubaccount()
        except Exception as err:
            print("Fail to check account")
            print(err)

    def create_newclass(self):
        """
        # function create_newclass create a new class from json file
        # and save info into database
        """
        try:
            self.ins_json.save_classinfo()
        except Exception as err:
            print("Fail to create new class")
            print(err)
