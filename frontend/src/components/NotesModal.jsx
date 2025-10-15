import React from "react";
import Modal from "react-modal";

function NotesModal({ isOpen, onRequestClose, book }) {
	if (!book) return null;
	return (
		<Modal
			isOpen={isOpen}
			onRequestClose={onRequestClose}
			contentLabel="Confirm Delete"
			className="notes-modal-content"
			overlayClassName="notes-modal-overlay"
		>
			<div className="modal-content">
				<h2>Notes for "{book.title}"</h2>
				{book.note ? (
					<p>{book.note}</p>
				) : (
					<p>There are no notes available for this book</p>
				)}
				<div className="modal-button">
					<button onClick={onRequestClose}>Close</button>
				</div>
			</div>
		</Modal>
	);
}

export default NotesModal;
