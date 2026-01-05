from flask import Blueprint,render_template,request,flash,redirect,url_for,session
from .models import User,db
from werkzeug.security import generate_password_hash,check_password_hash
from flask_login import login_user,login_required,logout_user,current_user
from . import google

auth = Blueprint('auth',__name__)

@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('auth.login'))



@auth.route('/login',methods=['POST','GET'])
def login():
    
    if session['auth_error']:
        session['auth_error'] = False
        flash('We could not validate the response from your social login provider. Please try again or use our alternative sign-in or sign-up options.',category='danger')
    
    
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password2')

        user = User.query.filter_by(email=email).first()
        if user:
            if check_password_hash(user.password,password):
                flash('Logged in successfully!',category='success')
                login_user(user,remember=True)
                return redirect(url_for('views.home'))
            else:
                flash('Password incorrect. try again',category='danger')
        else:
            flash('Email does not exist', category='danger')


    return render_template('login.html')



@auth.route('/sign-up',methods=['POST','GET'])
def sign_up():
    if session['auth_error']:
        session['auth_error'] = False
        flash('We could not validate the response from your social login provider. Please try again or use our alternative sign-in or sign-up options.',category='danger')
    
    
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
            new_user = User(email=email,first_name=FirstName,password=generate_password_hash(password1,method='scrypt'))
            db.session.add(new_user)
            db.session.commit()
            flash('Account created!', category='success')
            login_user(new_user, remember=True)
            return redirect(url_for('views.home'))


    return render_template('signUp.html')



@auth.route('/sign-in-google')
def sign_in_google():
    redirect_uri = url_for('auth.authorize',_external = True)
    return google.authorize_redirect(redirect_uri)



@auth.route('/authorize')
def authorize():
    try:
        token = google.authorize_access_token()
        userInfo = token['userinfo']
        user_email = userInfo['email']
        user = User.query.filter_by(email=user_email).first()

        if user:
            flash('Logged in successfully!',category='success')
            login_user(user,remember=True)
            return redirect(url_for('views.home'))
        else:
            new_user = User(email=userInfo['email'],first_name=userInfo['name'],password=generate_password_hash(userInfo['sub'],method='scrypt'))
            db.session.add(new_user)
            db.session.commit()
            flash('Logged in successfully!',category='success')
            login_user(new_user,remember=True)
            return redirect(url_for('views.home'))
        
    except Exception as e:
        session['auth_error'] = True
        return redirect(url_for('auth.login'))