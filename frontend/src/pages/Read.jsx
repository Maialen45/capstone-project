import React, { useEffect, useState } from "react";
import axios from "axios";

import NavBar from "../components/navbar/Navbar";
import LoadingSpinner from "../components/LoadingSpinner";
import BookCard from "../components/BookCard";
import SuccessMessage from "../components/SuccessMessage";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import NotesModal from "../components/NotesModal";

function Read() {
	const API_URL = process.env.REACT_APP_API_URL;
	const [readBooks, setReadBooks] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [selectedBookId, setSelectedBookId] = useState(null);
	const [selectedBookTitle, setSelectedBookTitle] = useState("");
	const [message, setMessage] = useState("");
	const [isMessageVisible, setIsMessageVisible] = useState(false);
	const [notesModalOpen, setNotesModalOpen] = useState(false);
	const [selectedBook, setSelectedBook] = useState(null);

	useEffect(() => {
		fetchReadBooks();
	}, []);

	const fetchReadBooks = () => {
		setIsLoading(true);
		axios
			.get(`${API_URL}/api/users/profile`, {
				withCredentials: true,
			})
			.then((response) => {
				const readBooks = [...response.data.read_books].reverse();
				setReadBooks(readBooks);
				setIsLoading(false);
			})
			.catch((err) => {
				if (err.response?.status === 401) {
					axios
						.post(
							`${API_URL}/api/users/refresh`,
							{},
							{ withCredentials: true }
						)
						.then(() => {
							return axios.get(`${API_URL}/api/users/profile`, {
								withCredentials: true,
							});
						})
						.then((response) => {
							const readBooks = [
								...response.data.read_books,
							].reverse();
							setReadBooks(readBooks);
						})
						.catch(() => {
							setMessage(
								"Your session has expired. Please log in again."
							);
							setIsMessageVisible(true);
						});
				} else {
					setMessage("Failed to fetch books");
					setIsMessageVisible(true);
				}
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	const openDeleteModal = (bookId, bookTitle) => {
		setSelectedBookId(bookId);
		setSelectedBookTitle(bookTitle);
		setDeleteModalOpen(true);
	};

	const closeDeleteModal = () => {
		setSelectedBookId(null);
		setSelectedBookTitle("");
		setDeleteModalOpen(false);
	};

	const openNotesModal = (book) => {
		setSelectedBook(book);
		setNotesModalOpen(true);
	};

	const closeNotesModal = () => {
		setSelectedBook(null);
		setNotesModalOpen(false);
	};

	const handleMoreInfo = (infoUrl) => {
		if (infoUrl) {
			window.open(infoUrl, "_blank");
		}
	};

	const handleDeleteBook = () => {
		axios
			.delete(`${API_URL}/api/users/delete-book/${selectedBookId}`, {
				withCredentials: true,
			})
			.then((response) => {
				const updatedReadBooks = readBooks.filter(
					(book) => book.book_id !== selectedBookId
				);
				setReadBooks(updatedReadBooks);
				setMessage(response.data.message);
				setIsMessageVisible(true);
				closeDeleteModal();
				setTimeout(() => {
					setIsMessageVisible(false);
				}, 5000);
			})
			.catch((error) => {
				if (error.response?.status === 401) {
					axios
						.post(
							`${API_URL}/api/users/refresh`,
							{},
							{ withCredentials: true }
						)
						.then(() => {
							return axios.delete(
								`${API_URL}/api/users/delete-book/${selectedBookId}`,
								{ withCredentials: true }
							);
						})
						.then((response) => {
							const updatedReadBooks = readBooks.filter(
								(book) => book.book_id !== selectedBookId
							);
							setReadBooks(updatedReadBooks);
							setMessage(response.data.message);
							setIsMessageVisible(true);
							closeDeleteModal();
							setTimeout(() => setIsMessageVisible(false), 5000);
						})
						.catch((refreshErr) => {
							setMessage(
								"Your session has expired. Please log in again."
							);
							setIsMessageVisible(true);
						});
				} else if (error.response?.status === 400) {
					setMessage(error.response.data.message);
					setIsMessageVisible(true);
					closeDeleteModal();
					setTimeout(() => setIsMessageVisible(false), 5000);
				}
			});
	};

	return (
		<div>
			<NavBar></NavBar>
			{isLoading ? (
				<LoadingSpinner />
			) : readBooks && readBooks.length > 0 ? (
				<div className="card-container">
					{readBooks.map((book) => (
						<BookCard
							key={book.book_id}
							book={book}
							onMoreInfo={handleMoreInfo}
							onDelete={() =>
								openDeleteModal(book.book_id, book.title)
							}
							onViewNotes={() => openNotesModal(book)}
						/>
					))}
				</div>
			) : (
				<div className="no-books">Mark a book as read</div>
			)}
			<ConfirmDeleteModal
				isOpen={deleteModalOpen}
				onRequestClose={closeDeleteModal}
				onConfirm={handleDeleteBook}
				bookTitle={selectedBookTitle}
			/>
			<SuccessMessage message={message} isVisible={isMessageVisible} />
			<NotesModal
				isOpen={notesModalOpen}
				onRequestClose={closeNotesModal}
				book={selectedBook}
			/>
		</div>
	);
}

export default Read;
