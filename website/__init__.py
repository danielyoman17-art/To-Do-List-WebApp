from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from os import path
from flask_login import LoginManager

#get secret information
from dotenv import load_dotenv
import os

# import oauth
from authlib.integrations.flask_client import OAuth


db = SQLAlchemy()
DB_name = 'database.db'
oauth = OAuth()
google = oauth.register(
    #project name
    "ToDo List Oauth",
    #client id and secret from google
    client_id=os.getenv('CLIENT_ID'),
    client_secret=os.getenv('CLIENT_SECRET'),
    
    #just copy you don't need to know what the hell this shit is doing
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={
        "scope": "openid email profile",
        "access_type": "offline",
        "prompt": "consent"
    }
)


def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'TODOLISTdaniel17'
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DB_name}'
    db.init_app(app)
    oauth.init_app(app)


    #create oauth for google

    from .view import views
    from .auth import auth
    
    app.register_blueprint(views,url_prefix='/')
    app.register_blueprint(auth,url_prefix='/')
    
    from .models import User

    create_database(app)

    login_manager = LoginManager()
    login_manager.login_view = 'auth.login'
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(id):
        return User.query.get(int(id))

    return app


def create_database(app):
    if not path.exists('website/'+DB_name):
        with app.app_context():
            db.create_all()