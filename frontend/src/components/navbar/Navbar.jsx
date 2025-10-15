import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

import NavbarButton from "./NavbarButton";
import NavbarLink from "./NavbarLink";
import { AuthContext } from "../auth/AuthContext";
import logo from "../../assets/logo2.png";

function NavBar() {
	const { auth, setAuth, setUser } = useContext(AuthContext);
	const navigate = useNavigate();
	const location = useLocation();
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	const handleLogOut = async () => {
		try {
			await axios.post(
				"http://localhost:5000/api/users/log-out",
				{},
				{ withCredentials: true }
			);
			setAuth(false);
			setUser(null);
			navigate("/login");
		} catch (error) {
			setAuth(false);
			setUser(null);
			navigate("/login");
		}
	};
	const showAppName =
		!auth &&
		(location.pathname === "/" ||
			location.pathname === "/log-in" ||
			location.pathname === "/sign-up" ||
			location.pathname.startsWith("/results/"));

	return (
		<div className="navbar-container">
			<div className="left-column">
				<div className="logo">
					<a href="/" className="logo-link">
						<img src={logo} alt="logo"></img>
						{showAppName && <p>BookNest</p>}
					</a>
				</div>
				<div className="navbar-links">
					{auth && (
						<>
							<NavbarLink label="Home" to="/" />
							<NavbarLink label="To Be Read" to="/to-be-read" />
							<NavbarLink label="Read" to="/read" />
						</>
					)}
				</div>
			</div>
			<div className="right-column">
				{!auth && (
					<div className="navbar-buttons">
						<NavbarButton label="Sign Up" to="/sign-up" />
						<NavbarButton label="Log In" to="/log-in" />
					</div>
				)}

				{auth && (
					<>
						<div className="navbar-buttons desktop-only">
							<NavbarButton
								label="Log Out"
								onClick={handleLogOut}
							/>
						</div>

						<div
							className="hamburger mobile-only"
							onClick={() => setIsDropdownOpen(!isDropdownOpen)}
						>
							<span></span>
							<span></span>
							<span></span>
						</div>
					</>
				)}
			</div>
			{auth && (
				<div className={`mobile-menu ${isDropdownOpen ? "open" : ""}`}>
					<NavbarLink
						label="Home"
						to="/"
						onClick={() => setIsDropdownOpen(false)}
					/>
					<NavbarLink
						label="To Be Read"
						to="/to-be-read"
						onClick={() => setIsDropdownOpen(false)}
					/>
					<NavbarLink
						label="Read"
						to="/read"
						onClick={() => setIsDropdownOpen(false)}
					/>
					<NavbarButton label="Log Out" onClick={handleLogOut} />
				</div>
			)}
		</div>
	);
}

export default NavBar;
