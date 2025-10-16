import os
from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from .routes.google_book_bp import google_book_bp
from dotenv import load_dotenv
from datetime import timedelta

load_dotenv()

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

DATABASE_URL = os.getenv('DATABASE_URL')

def create_app():
    app = Flask(__name__)
    CORS(app, resources={
        r"/*": {
            "origins": [
                "https://booknest-ipng.onrender.com",
                "http://localhost:3000",
            ]
        }
    }, supports_credentials=True)   

    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
    app.config['JWT_TOKEN_LOCATION'] = ['cookies']
    app.config['JWT_ACCESS_COOKIE_NAME'] = 'access_token_cookie'
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=60)
    app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=7)
    app.config['JWT_COOKIE_CSRF_PROTECT'] = False  
    app.config['JWT_COOKIE_SECURE'] = True
    app.config['JWT_COOKIE_SAMESITE'] = 'None'

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    
    from .routes.user_bp import user_bp
    from .routes.book_bp import book_bp

    app.register_blueprint(google_book_bp)
    app.register_blueprint(user_bp)
    app.register_blueprint(book_bp)

    @app.route('/')
    def home():
        return "Backend is running!"

    return app

