import React from "react";
import Modal from "react-modal";

function ConfirmDeleteModal({ isOpen, onRequestClose, onConfirm, bookTitle }) {
	return (
		<Modal
			isOpen={isOpen}
			onRequestClose={onRequestClose}
			contentLabel="Confirm Delete"
			className="delete-modal-content"
			overlayClassName="delete-modal-overlay"
		>
			<div className="modal-content">
				<h2>Are you sure you want to delete the book "{bookTitle}"?</h2>
				<div className="modal-actions">
					<button className="cancel-btn" onClick={onRequestClose}>
						Cancel
					</button>
					<button className="confirm-btn" onClick={onConfirm}>
						Delete
					</button>
				</div>
			</div>
		</Modal>
	);
}

export default ConfirmDeleteModal;
