import React, { useState } from "react";
import Modal from "react-modal";

import StarRating from "./StarRating";

Modal.setAppElement("#root");

function MarkAsReadModal({ isOpen, onRequestClose, onSubmit }) {
	const [rating, setRating] = useState(0);
	const [note, setNote] = useState("");
	const [finishedDate, setFinishedDate] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	const handleSubmit = () => {
		if (finishedDate === "") {
			setErrorMessage("Finished date is required!");
			return;
		}

		onSubmit({
			rating,
			note,
			finished_date: finishedDate,
		});

		setRating(0);
		setNote("");
		setFinishedDate("");
		setErrorMessage("");
		onRequestClose();
	};

	return (
		<Modal
			isOpen={isOpen}
			onRequestClose={onRequestClose}
			contentLabel="Mark as Read"
			className="modal-content"
			overlayClassName="modal-overlay"
		>
			<h2>Mark as Read</h2>
			<label>
				Rating (1-5):
				<StarRating
					rating={rating}
					setRating={setRating}
					isInteractive={true}
				/>
			</label>
			<label>
				Note:
				<textarea
					value={note}
					onChange={(e) => setNote(e.target.value)}
					maxLength={500}
				/>
				<div className="character-counter">
					{note.length} / 500 characters
				</div>
			</label>
			<label>
				Finished date:
				<input
					type="date"
					value={finishedDate}
					onChange={(e) => setFinishedDate(e.target.value)}
				/>
			</label>
			{errorMessage && <p className="error-message">{errorMessage}</p>}
			<div className="modal-buttons">
				<button onClick={handleSubmit}>Submit</button>
				<button onClick={onRequestClose}>Cancel</button>
			</div>
		</Modal>
	);
}

export default MarkAsReadModal;
