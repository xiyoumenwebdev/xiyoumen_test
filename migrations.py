# -*- coding: utf-8 -*-
"""
migrations
~~~~~~~~~~~~~~

Module migrations build or rebuild database and tables from repository  

:copyright: (c) 2016 by ERIC ZHAO.
:license: 
"""

from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand

import xiyoumenapp

migrate = Migrate(xiyoumenapp.webapp, xiyoumenapp.db)

manager = Manager(xiyoumenapp.webapp)
manager.add_command('db', MigrateCommand)

if __name__ == '__main__':
    manager.run()
