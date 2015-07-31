"""
The flask application package.
"""

from flask import Flask
from HomeAutomation import IOProvider
app = Flask(__name__)
provider = IOProvider.IOProvider()

import HomeAutomation.views
