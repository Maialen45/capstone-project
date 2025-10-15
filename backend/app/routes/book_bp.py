from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

from ..models.book import Book
from ..models.userbook import UserBook
from ..main import db

book_bp = Blueprint('book_bp', __name__)

@book_bp.route('/api/users/add-book', methods=['POST'])
@jwt_required()
def add_book_to_user():
    user_id = get_jwt_identity()

    data = request.get_json()
    title = data.get('title')
    author = data.get('author')
    genre = data.get('genre')
    publication_date = data.get('publication_date')
    description = data.get('description')
    image = data.get('imageUrl')
    info_url = data.get('infoUrl')

    existing_book = Book.query.filter_by(books_info_url=info_url).first()

    if not existing_book:
        book = Book(
            books_title=title,
            books_author=author,
            books_genre=genre,
            books_publication_date=publication_date,
            books_description=description,
            books_image=image,
            books_info_url=info_url
        )
        db.session.add(book)
        db.session.commit()
    else:
        book = existing_book
    
    existing_user_book = UserBook.query.filter_by(userbooks_user_id=user_id, userbooks_book_id=book.books_id).first()

    if existing_user_book:
        return jsonify({
            'message': 'This book is already on your lists'
        }), 400

    user_book = UserBook(
        userbooks_user_id=user_id,
        userbooks_book_id=book.books_id,
        userbooks_read=False
    )

    db.session.add(user_book)
    db.session.commit()

    return jsonify({
        'message': 'Book added to your to be read',
        'book': {
            'title': book.books_title,
            'author': book.books_author
        }
    }), 201

@book_bp.route('/api/users/mark-as-read/<int:book_id>', methods=['PATCH'])
@jwt_required()
def mark_as_read(book_id):
    user_id = get_jwt_identity()
    user_id = int(user_id)
    data = request.get_json()

    rating = data.get('rating')
    note = data.get('note')
    finished_date = data.get('finished_date')

    if finished_date:
        try:
            finished_date = datetime.strptime(finished_date, '%Y-%m-%d').date()
        except ValueError:
            return jsonify({"error": "The end date must be in the format YYYY-MM-DD."}), 400
        
    user_book = UserBook.query.filter_by(
        userbooks_user_id=user_id,
        userbooks_book_id=book_id
    ).first()

    if not user_book:
        return jsonify({"error": "This book is not on your list."}), 400
    
    user_book.userbooks_read = True

    if rating:
        user_book.userbooks_rating = rating
    if note:
        user_book.userbooks_note = note
    if finished_date:
        user_book.userbooks_finished_date = finished_date

    db.session.commit()

    return jsonify({
        "message": "Book marked as read",
        "book": {
            "title": user_book.book.books_title,
            "author": user_book.book.books_author,
            "note": user_book.userbooks_note,
            "finished_date": user_book.userbooks_finished_date
        }
    }), 200

@book_bp.route('/api/users/delete-book/<int:book_id>', methods=['DELETE'])
@jwt_required()
def delete_book(book_id):
    user_id = get_jwt_identity()

    user_book = UserBook.query.filter_by(
        userbooks_user_id=user_id,
        userbooks_book_id=book_id
    ).first()

    if not user_book:
        return jsonify({"error": "This book is not on your list"}), 400
    
    db.session.delete(user_book)
    db.session.commit()

    return jsonify({"message": "Book removed from your list"}), 200