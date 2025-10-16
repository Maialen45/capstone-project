# BookNest - Book Management App

**BookNest** is a full-stack web application that allows users to **search, organize, and track their favourite books**.  
It integrates with the **Google Books API** to fetch book data, offering an intuitive interface for both casual visitors and registered users.

## Features

### Public (unauthenticated) users

-   Search for books using the **Google Books API**.
-   View detailed information about each book.

### Authenticated users

-   Add books to a personal **"To Be Read"** list.
-   Mark books as **read** once completed.
-   Assign a **rating**, **completion date**, and optional **notes** to read books.
-   Manage and update your personal reading list anytime.

## Tech Stack

### Frontend

-   React (https://react.dev/) - component-based UI library
-   JavaScript (https://developer.mozilla.org/en-US/docs/Web/JavaScript) - main programming language
-   SCSS (https://sass-lang.com/) - for modular and maintainable styling

### Backend

-   Python (https://www.python.org/) - core backend language
-   Flask (https://flask.palletsprojects.com/) - lightweight web framework
-   PostgreSQL (https://www.postgresql.org/) - relational database

## Tools & Libraries

### Frontend

-   Axios (https://axios-http.com/) - for handling HTTP requests
-   React Router DOM (https://reactrouter.com/) - for navigation and routing
-   React Modal (https://www.npmjs.com/package/react-modal) - for custom modal components
-   Google Books API (https://developers.google.com/books) - to fetch book data
-   Font Awesome (https://fontawesome.com/) - for icons and UI enhancements

### Backend

-   SQLAlchemy (https://www.sqlalchemy.org/) - ORM for database interactions
-   Psycopg2 (https://www.psycopg.org/docs/) - PostgreSQL database adapter
-   Gunicorn (https://gunicorn.org/) - WSGI server for production deployment

## Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/Maialen45/capstone-project.git
cd capstone-project

cd backend
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python run.py

cd frontend
npm install
npm start
```

## Authentication

Authentication is required in order to have the full experience. Authenticated users can search books, view more information about the book, save the book to read later, mark the book as read (giving it a rating, finishing date and notes) and delete books from the lists.
Non-authenticated users can only search and view more information about the book.

## Contributing

Contributions are welcome!
Feel free to fork the repo and submit a pull request with improvements or new features.

## Author

Maialen
Full-Stack Developer
