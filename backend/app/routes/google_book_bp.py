import os
import requests
from flask import Blueprint, request, jsonify
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

API_KEY = os.getenv('GOOGLE_BOOKS_API_KEY')
BASE_URL = "https://www.googleapis.com/books/v1/volumes"

google_book_bp = Blueprint('google_books_api', __name__)
@google_book_bp.route('/search')
def search_books():
    query = request.args.get('q')
    if not query:
        return jsonify({'error': '"q" parameter is missing'}), 400
    
    url = f'{BASE_URL}?q={query}&key={API_KEY}&maxResults={12}'
    response = requests.get(url)
    books_data = response.json()

    if 'items' in books_data:
        for item in books_data['items']:
            if 'volumeInfo' in item and 'publishedDate' in item['volumeInfo']:
                pub_date_str = item['volumeInfo']['publishedDate']

                if 'T' in pub_date_str and '+' in pub_date_str:
                    try:
                        pub_date = datetime.fromisoformat(pub_date_str)
                        formatted_date = pub_date.strftime('%d-%m-%Y')
                        item['volumeInfo']['publishedDate'] = formatted_date
                    except ValueError:
                        continue

    return jsonify(books_data)