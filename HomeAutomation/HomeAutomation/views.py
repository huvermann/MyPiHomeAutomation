"""
Routes and views for the flask application.
"""

from datetime import datetime
from flask import render_template, Response, jsonify
from HomeAutomation import app

@app.route('/')
@app.route('/home')
def home():
    """Renders the home page."""
    return render_template(
        'switches.html',
        title='Home Page',
        year=datetime.now().year,
    )

@app.route('/switches')
def switches():
    return render_template(
        'switches.html'
    )

@app.route('/gpio', methods=["GET", "POST"])
def jsongpio():
    # GPIO-Manager einbauen!!
    dat = [{"name":"gpio-0","value":"off"},{"name":"gpio-1","value":"off"},{"name":"gpio-2","value":"on"},{"name":"gpio-3","value":"off"},{"name":"gpio-4","value":"on"}]
    return jsonify(gpio=dat)
