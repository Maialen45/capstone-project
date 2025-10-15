import React from "react";

import noCover from "../assets/logo2.png";
import StarRating from "./StarRating";

const formatDate = (date) => {
	const options = { year: "numeric", month: "long", day: "numeric" };
	return new Date(date).toLocaleDateString("en-US", options);
};

function BookCard({
	book,
	onMoreInfo,
	onAddToList,
	onMarkAsReadClick,
	showMarkAsRead,
	onDelete,
	onViewNotes,
}) {
	const isGoogleBook = !!book.volumeInfo;

	const id = book.book_id || book.id;
	const title = isGoogleBook
		? book.volumeInfo.title || "Title not available"
		: book.title || "Title not available";

	const authors = isGoogleBook
		? book.volumeInfo.authors?.join(", ") || "Author not available"
		: book.author || "Author not available";

	const description = isGoogleBook
		? book.volumeInfo.description || "Description not available"
		: book.description || "Description not available";

	const imageUrl = isGoogleBook
		? book.volumeInfo.imageLinks?.thumbnail || noCover
		: book.imageUrl || noCover;

	const infoLink = isGoogleBook
		? book.volumeInfo.infoLink || "#"
		: book.infoUrl || "#";

	const publicationDate = isGoogleBook
		? book.volumeInfo.publishedDate || "Not available"
		: book.publication_date || "Not available";

	const isUserBook = book.book_id;
	const isRead = book.userbooks_read;

	const rating = book.rating || "No rating";
	const finishedDate = book.finished_date || " Date not available";

	const formattedFinishedDate =
		finishedDate !== "Date not available"
			? formatDate(finishedDate)
			: "Not available";

	return (
		<div className="card" key={id}>
			{isUserBook ? (
				<button className="delete-btn" onClick={() => onDelete(id)}>
					<i className="fas fa-trash-alt"></i>
				</button>
			) : (
				""
			)}

			<div className="book-image">
				<img
					src={imageUrl}
					alt={imageUrl ? title : "Cover not available"}
					loading="lazy"
					className={imageUrl === noCover ? "default-cover" : ""}
				/>
			</div>

			<div className="book-details">
				<h3 className="title">{title}</h3>
				<p className="author">{authors}</p>
				<p>{publicationDate}</p>
				{isRead ? (
					<div className="read-books">
						<div className="finished-date">
							<strong>Finished on: </strong>
							{formattedFinishedDate}
						</div>
						<div className="rating">
							<strong>
								Rating:
								<StarRating
									rating={rating}
									setRating={() => {}}
									isInteractive={false}
								/>
							</strong>
						</div>
						<button
							className="view-notes-btn"
							onClick={() => onViewNotes(id)}
						>
							Show notes
						</button>
					</div>
				) : (
					<div className="pending-books">
						<p className="description">{description}</p>
						<div className="description-btn">
							<button onClick={() => onMoreInfo(infoLink)}>
								+ Info
							</button>
							{onAddToList && (
								<button onClick={() => onAddToList(book)}>
									Add to list
								</button>
							)}
							{showMarkAsRead && (
								<button
									onClick={() => {
										onMarkAsReadClick();
									}}
								>
									Mark as read
								</button>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

export default BookCard;
