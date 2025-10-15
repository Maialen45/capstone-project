import React from "react";

const SuccessMessage = ({ message, isVisible }) => {
	if (!isVisible) return null;

	return <div className="success-message">{message}</div>;
};

export default SuccessMessage;
