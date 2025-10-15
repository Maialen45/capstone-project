import React from "react";
import { Link } from "react-router-dom";

function NavbarLink({ label, to }) {
	return (
		<div className="navbar-link">
			<Link to={to}>{label}</Link>
		</div>
	);
}

export default NavbarLink;
