from flask import Blueprint,render_template,request,flash,redirect,url_for
from .models import User,db
from werkzeug.security import generate_password_hash,check_password_hash
from flask_login import login_user,login_required,logout_user,current_user

auth = Blueprint('auth',__name__)


@auth.route('/login',methods=['POST','GET'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password2')

        user = User.query.filter_by(email=email).first()
        if user:
            if (user.password == password):
                flash('Logged in successfully!',category='success')
                login_user(user,remember=True)
                return redirect(url_for('views.home'))
            else:
                flash('Password incorrect. try again',category='danger')
        else:
            flash('Email does not exist', category='danger')

    return render_template('login.html')


@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('auth.login'))


@auth.route('/sign-up',methods=['POST','GET'])
def sign_up():
    if request.method == 'POST':
        email = request.form.get('email')
        FirstName = request.form.get('Firstname')
        password1 = request.form.get('password1')
        password2 = request.form.get('password2')


        user = User.query.filter_by(email=email).first()

        if user:
            flash('Email already exists',category='error')

        elif len(email) < 4:
            flash('Email must be more than 4 characters',category='danger')

        elif len(FirstName) < 2:
            flash('First name must be more than 2 characters',category='danger')

        elif password1 != password2:
            flash("Password does'nt match", category='danger')

        elif len(password1) < 7:
            flash("Password must be more than 7 characters", category='danger')

        else:
            new_user = User(email=email,first_name=FirstName,password=password1)
            db.session.add(new_user)
            db.session.commit()
            flash('Account created!', category='success')
            login_user(new_user, remember=True)
            return redirect(url_for('views.home'))


    return render_template('signUp.html')