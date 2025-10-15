from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token, set_access_cookies, set_refresh_cookies, unset_jwt_cookies, unset_access_cookies, jwt_required, get_jwt_identity

from ..models.user import User
from ..models.userbook import UserBook
from ..main import db
from ..validators import validate_password, validate_email

user_bp = Blueprint('user_bp', __name__)

@user_bp.route('/api/users/sign-up', methods=['POST'])
def sign_up():
    data = request.get_json()

    username = data.get('users_username')
    email = data.get('users_email')
    password = data.get('users_password')

    if not username or not email or not password:
        return jsonify({'error': 'All fields are required'}), 400
    
    if not validate_email(email):
        return jsonify({'error': 'Invalid email format'}), 400

    if not validate_password(password):
        return jsonify({'error': 'The password must have al least 6 characters'}), 400
    
    if User.query.filter_by(users_username=username).first():
        return jsonify({'error': 'Invalid username, already exists'}), 400
    
    if User.query.filter_by(users_email=email).first():
        return jsonify({'error': 'Invalid email, already exists'}), 400
    
    user = User(users_username=username, users_email=email)
    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    response = jsonify({
        'message': 'User registered successfully',
        'username': user.users_username
    })

    response.status_code = 201

    return response

@user_bp.route('/api/users/log-in', methods=['POST'])
def log_in():
    data = request.get_json()

    email = data.get('users_email')
    password = data.get('users_password')

    if not email or not password:
        return jsonify({'error': 'All fields are required'}), 400

    user = User.query.filter_by(users_email=email).first()

    if not user or not user.check_password(password):
        return jsonify({'error': 'Invalid user or password'}), 400

    access_token = create_access_token(identity=str(user.users_id))
    refresh_token = create_refresh_token(identity=str(user.users_id))

    response = jsonify({
        'message': 'Successful login',
        'access_token': access_token,
    })

    set_access_cookies(response, access_token)
    set_refresh_cookies(response, refresh_token)
    response.status_code = 200

    return response

@user_bp.route('/api/users/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    current_user = get_jwt_identity()
    access_token = create_access_token(identity=current_user)

    response = jsonify({"message": "Token refreshed"})
    set_access_cookies(response, access_token)
    return response

@user_bp.route('/api/users/log-out', methods=['POST'])
def log_out():
    response = jsonify({'message': 'Logged out'})
    unset_jwt_cookies(response)
    return response

@user_bp.route('/api/users/profile', methods=['GET'])
@jwt_required()
def perfil():
    user_id = get_jwt_identity()
    user_id = int(user_id)
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    pending_books = UserBook.query.filter_by(userbooks_user_id=user_id, userbooks_read=False).all()
    read_books = UserBook.query.filter_by(userbooks_user_id=user_id, userbooks_read=True).all()

    pending_books_list = []
    for user_book in pending_books:
        book = user_book.book
        pending_books_list.append({
            'book_id': book.books_id,
            'title': book.books_title,
            'author': book.books_author,
            'genre': book.books_genre,
            'publication_date': book.books_publication_date,
            'description': book.books_description,
            'status': 'To be read',
            'imageUrl': book.books_image,
            'infoUrl': book.books_info_url,
            'userbooks_read': user_book.userbooks_read
        })

    read_books_list = []
    for user_book in read_books:
        book = user_book.book
        read_books_list.append({
            'book_id': book.books_id,
            'title': book.books_title,
            'author': book.books_author,
            'genre': book.books_genre,
            'publication_date': book.books_publication_date,
            'description': book.books_description,
            'status': 'Read',
            'imageUrl': book.books_image,
            'infoUrl': book.books_info_url,
            'note': user_book.userbooks_note,
            'finished_date': user_book.userbooks_finished_date,
            'rating': user_book.userbooks_rating,
            'userbooks_read': user_book.userbooks_read
        })

    return jsonify({
        "username": user.users_username,
        "email": user.users_email,
        "pending_books": pending_books_list,
        "read_books": read_books_list
    }), 200

@user_bp.errorhandler(401)
def unauthorized_error(error):
    return jsonify({
        "message": "Session expired, please log in again"
    }), 401