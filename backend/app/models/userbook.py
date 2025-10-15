from ..main import db

class UserBook(db.Model):
    __tablename__ = "users_books"

    userbooks_id = db.Column(db.Integer, primary_key=True)
    userbooks_user_id = db.Column(db.Integer, db.ForeignKey("users.users_id"), nullable=False)
    userbooks_book_id = db.Column(db.Integer, db.ForeignKey("books.books_id"), nullable=False)
    
    userbooks_read = db.Column(db.Boolean, default=False, nullable=False)
    userbooks_rating = db.Column(db.Integer)
    userbooks_note = db.Column(db.Text)
    userbooks_finished_date = db.Column(db.Date)

    user = db.relationship("User", back_populates="books")
    book = db.relationship("Book", back_populates="users")
