from ..main import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__ = 'users'

    users_id = db.Column(db.Integer, primary_key=True)
    users_username = db.Column(db.String(80), unique=True, nullable=False)
    users_email = db.Column(db.String(80), unique=True, nullable=False)
    users_password = db.Column(db.String(256), nullable=False)

    books = db.relationship('UserBook', back_populates='user')

    def set_password(self, password_hash):
        self.users_password = generate_password_hash(password_hash)
    
    def check_password(self, password_hash):
        return check_password_hash(self.users_password, password_hash)