import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

import logo from "../../assets/logo.png";

function FormSide({ tipo }) {
	return (
		<div className="form-side">
			{tipo === "sign-up" ? (
				<div className="advantages-container">
					<div className="title">Advantages of registering</div>
					<ul>
						<li>
							<FontAwesomeIcon icon={faCheck} className="check" />
							<strong>Personalized Book Management:</strong> Once
							registered, you can mark books as "to-be-read" or
							"finished" and keep track of your progress in a more
							organized and personalized way.
						</li>
						<li>
							<FontAwesomeIcon icon={faCheck} className="check" />
							<strong>Save Your Book Preferences:</strong> By
							registering, all your preferences, notes, and
							ratings will be stored, allowing you to pick up
							right where you left off, without losing your book
							data.
						</li>
						<li>
							<FontAwesomeIcon icon={faCheck} className="check" />
							<strong>Rate and Review Books:</strong> Registered
							users can provide valuable feedback by rating books
							and adding personalized notes.
						</li>
					</ul>
				</div>
			) : (
				<div className="image-container">
					<img src={logo} alt="Welcome to XXXXXXX" />
				</div>
			)}
		</div>
	);
}

export default FormSide;
