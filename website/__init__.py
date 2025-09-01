from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from os import path
from flask_login import LoginManager

db = SQLAlchemy()
DB_name = 'database.db'


def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'TODOLISTdaniel17'
    app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://mydatabase_xldp_user:kGJRjqHOLj23KS9mNinjOSlI258gNmD5@dpg-d2qeivl6ubrc73d8ssg0-a.oregon-postgres.render.com/mydatabase_xldp"
    db.init_app(app)


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