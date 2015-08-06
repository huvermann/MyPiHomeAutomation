"""
Routes and views for the flask application.
"""

from datetime import datetime
from flask import render_template, Response, request, jsonify
from HomeAutomation import app, provider

@app.route('/')
@app.route('/home')
def home():
    """Renders the home page."""
    return render_template(
        #'switches.html',
        'debugger.html',
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

    #dat = [{"name":"gpio-0","value":"off"},{"name":"gpio-1","value":"off"},{"name":"gpio-2","value":"on"},{"name":"gpio-3","value":"off"},{"name":"gpio-4","value":"on"}]
    #return jsonify(gpio=dat)
    return jsonify(gpio=provider.gpioData())

@app.route('/post_gpio', methods=["POST"])
def post_gpio():
    test = request
    return jsonify(post_gpio=provider.gpioData())

@app.route('/debug')
def showDebug():
    return render_template('debugger.html')



