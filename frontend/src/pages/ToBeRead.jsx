import React, { useEffect, useState } from "react";
import axios from "axios";

import NavBar from "../components/navbar/Navbar";
import BookCard from "../components/BookCard";
import MarkAsReadModal from "../components/MarkAsReadModal";
import LoadingSpinner from "../components/LoadingSpinner";
import SuccessMessage from "../components/SuccessMessage";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

function ToBeRead() {
	const [pendingBooks, setPendingBooks] = useState([]);
	const [selectedBookId, setSelectedBookId] = useState(null);
	const [selectedBookTitle, setSelectedBookTitle] = useState("");
	const [markAsReadModalOpen, setMarkAsReadModalOpen] = useState(false);
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [message, setMessage] = useState("");
	const [isMessageVisible, setIsMessageVisible] = useState(false);

	useEffect(() => {
		fetchPendingBooks();
	}, []);

	const fetchPendingBooks = () => {
		setIsLoading(true);
		axios
			.get("http://localhost:5000/api/users/profile", {
				withCredentials: true,
			})
			.then((response) => {
				const pendingBooks = [...response.data.pending_books].reverse();
				setPendingBooks(pendingBooks);
				setIsLoading(false);
			})
			.catch((err) => {
				if (err.response?.status === 401) {
					axios
						.post(
							"http://localhost:5000/api/users/refresh",
							{},
							{ withCredentials: true }
						)
						.then(() => {
							return axios.get(
								"http://localhost:5000/api/users/profile",
								{
									withCredentials: true,
								}
							);
						})
						.then((response) => {
							const pendingBooks = [
								...response.data.pending_books,
							].reverse();
							setPendingBooks(pendingBooks);
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

	const openMarkAsReadModal = (bookId) => {
		setSelectedBookId(bookId);
		setMarkAsReadModalOpen(true);
	};

	const closeMarkAsReadModal = () => {
		setSelectedBookId(null);
		setMarkAsReadModalOpen(false);
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

	const handleMoreInfo = (infoUrl) => {
		if (infoUrl) {
			window.open(infoUrl, "_blank");
		}
	};

	const handleMarkAsRead = (data) => {
		axios
			.patch(
				`http://localhost:5000/api/users/mark-as-read/${selectedBookId}`,
				data,
				{
					withCredentials: true,
				}
			)
			.then((response) => {
				const updatedPendingBooks = pendingBooks.filter(
					(book) => book.book_id !== selectedBookId
				);
				setPendingBooks(updatedPendingBooks);
				setMessage(response.data.message);
				setIsMessageVisible(true);
				closeMarkAsReadModal();
				setTimeout(() => {
					setIsMessageVisible(false);
				}, 5000);
			})
			.catch((err) => {
				if (err.response?.status === 401) {
					axios
						.post(
							"http://localhost:5000/api/users/refresh",
							{},
							{ withCredentials: true }
						)
						.then(() => {
							return axios.patch(
								`http://localhost:5000/api/users/mark-as-read/${selectedBookId}`,
								data,
								{ withCredentials: true }
							);
						})
						.then((response) => {
							const updatedPendingBooks = pendingBooks.filter(
								(book) => book.book_id !== selectedBookId
							);
							setPendingBooks(updatedPendingBooks);
							setMessage(response.data.message);
							setIsMessageVisible(true);
							closeMarkAsReadModal();
							setTimeout(() => setIsMessageVisible(false), 5000);
						})
						.catch(() => {
							setMessage(
								"Your session has expired. Please log in again."
							);
							setIsMessageVisible(true);
						});
				}
			});
	};

	const handleDeleteBook = () => {
		axios
			.delete(
				`http://localhost:5000/api/users/delete-book/${selectedBookId}`,
				{
					withCredentials: true,
				}
			)
			.then((response) => {
				const updatedPendingBooks = pendingBooks.filter(
					(book) => book.book_id !== selectedBookId
				);
				setPendingBooks(updatedPendingBooks);
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
							"http://localhost:5000/api/users/refresh",
							{},
							{ withCredentials: true }
						)
						.then(() => {
							return axios.delete(
								`http://localhost:5000/api/users/delete-book/${selectedBookId}`,
								{ withCredentials: true }
							);
						})
						.then((response) => {
							const updatedPendingBooks = pendingBooks.filter(
								(book) => book.book_id !== selectedBookId
							);
							setPendingBooks(updatedPendingBooks);
							setMessage(response.data.message);
							setIsMessageVisible(true);
							closeDeleteModal();
							setTimeout(() => setIsMessageVisible(false), 5000);
						})
						.catch(() => {});
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
			) : pendingBooks && pendingBooks.length > 0 ? (
				<div className="card-container">
					{pendingBooks.map((book) => (
						<BookCard
							key={book.book_id}
							book={book}
							onMoreInfo={handleMoreInfo}
							onMarkAsReadClick={() =>
								openMarkAsReadModal(book.book_id)
							}
							showMarkAsRead={true}
							onDelete={() =>
								openDeleteModal(book.book_id, book.title)
							}
						/>
					))}
				</div>
			) : (
				<div className="no-books">Add a book to be read</div>
			)}
			<MarkAsReadModal
				isOpen={markAsReadModalOpen}
				onRequestClose={closeMarkAsReadModal}
				onSubmit={handleMarkAsRead}
			/>
			<SuccessMessage message={message} isVisible={isMessageVisible} />
			<ConfirmDeleteModal
				isOpen={deleteModalOpen}
				onRequestClose={closeDeleteModal}
				onConfirm={handleDeleteBook}
				bookTitle={selectedBookTitle}
			/>
		</div>
	);
}

export default ToBeRead;
