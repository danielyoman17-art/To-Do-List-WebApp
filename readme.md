
# To Do list website

This project is an introduction for me to the web developpement.
this website is used to create **task** on website. And a lot of other stuff.
this webstie is host using [pythonanywhere](https://www.pythonanywhere.com/).





##  Link
[click here go to the website](https://danielyoman17.pythonanywhere.com/)


## Features
- Light/dark mode toggle
- Sign Up and login page
- responsive webstie
- create and delete note
- register with google


## Run Locally

Because of google Oauth you need a google Oauth client ID and a secret key so you should watch this youtube video
[How to set up Google OAuth 2.0 with the authlib pakcage in Python](https://www.youtube.com/watch?v=BgYo-wpqi3s&t=6s).


Clone the project

```bash
  git clone https://github.com/danielyoman17-art/To-Do-List-WebApp.git
```


Create .env file and past those information on it
```bash
  CLIENT_ID = '<Your-secrey-id>'
  CLIENT_SECRET = '<Your-secret-key>'
```


Install dependencies

```bash
  pip install -r requirements.txt
```

Start the server

```bash
  python main.py
```
