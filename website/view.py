from flask import Blueprint, render_template, request,flash,jsonify
from flask_login import current_user,login_required
from . import db
import json

views = Blueprint('views',__name__)

@views.route('/')
@login_required
def home():
    return render_template('home.html',user=current_user)


@views.route('/load',methods=['GET'])
def load():
    # create the data
    data = {'darkMode':False,'tasks':[]}
    if current_user.data:
        data = json.loads(current_user.data)
        print(data)
        
    return jsonify(data)
    # and send it


@views.route('/save',methods=['POST'])
def save():
    # recieve the data
    data = request.get_json()
    current_user.data = json.dumps(data)
    db.session.commit()
    # send a response
    return jsonify(data)