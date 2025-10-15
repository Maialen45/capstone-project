import React, { useState } from "react";

function StarRating({ rating, setRating, isInteractive = true }) {
	const [hovered, setHovered] = useState(null);

	const handleMouseEnter = (star) => {
		if (isInteractive) setHovered(star);
	};

	const handleMouseLeave = () => {
		if (isInteractive) setHovered(null);
	};

	const handleClick = (star) => {
		if (isInteractive) {
			setRating(star);
		}
	};

	const activeValue = rating > 0 ? rating : hovered;

	return (
		<div className="star-rating">
			{[1, 2, 3, 4, 5].map((star) => (
				<span
					key={star}
					className={`star ${
						star <= (activeValue || 0) ? "filled" : ""
					}`}
					onMouseEnter={() => handleMouseEnter(star)}
					onMouseLeave={handleMouseLeave}
					onClick={() => handleClick(star)}
				>
					★
				</span>
			))}
		</div>
	);
}

export default StarRating;
