import React from "react";
import { Link } from "react-router-dom";

function NavBarButton({ label, to, onClick }) {
	return (
		<div className="navbar-button">
			{onClick ? (
				<button onClick={onClick}>{label}</button>
			) : (
				<Link to={to}>{label}</Link>
			)}
		</div>
	);
}

export default NavBarButton;
