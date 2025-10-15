from ..main import db

class Book(db.Model):
    __tablename__ = 'books'

    books_id = db.Column(db.Integer, primary_key=True)
    books_title = db.Column(db.String(80), nullable=False)
    books_author = db.Column(db.String(80), nullable=True)
    books_image = db.Column(db.String(255))
    books_info_url = db.Column(db.String(255))
    books_genre = db.Column(db.String(80))
    books_publication_date = db.Column(db.Date)
    books_description = db.Column(db.Text)

    users = db.relationship('UserBook', back_populates='book')
