﻿"""
This script runs the HomeAutomation application using a development server.
"""

from os import environ
from HomeAutomation import app
from MessageBroker import startMessageBroker

if __name__ == '__main__':
    startMessageBroker()
    HOST = environ.get('SERVER_HOST', '0.0.0.0')
    try:
        PORT = int(environ.get('SERVER_PORT', '5555'))
    except ValueError:
        PORT = 5555
    app.run(HOST, PORT)
