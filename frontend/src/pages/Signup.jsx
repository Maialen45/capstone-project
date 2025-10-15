import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import NavBar from "../components/navbar/Navbar";
import FormAuth from "../components/auth/FormAuth";
import FormSide from "../components/auth/FormSide";

function Signup() {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const [message, setMessage] = useState("");
	const [error, setError] = useState("");

	const navigate = useNavigate();

	const handleSubmit = (e) => {
		e.preventDefault();

		axios
			.post(
				"http://localhost:5000/api/users/sign-up",
				{
					users_username: username,
					users_email: email,
					users_password: password,
				},
				{
					withCredentials: true,
					headers: {
						"Content-Type": "application/json",
					},
				}
			)
			.then((response) => {
				setMessage(response.data.message);
				setError("");

				setTimeout(() => {
					navigate("/log-in");
				}, 1500);
			})
			.catch((error) => {
				const errorMsg =
					error.response?.data?.error || "Error while signin up";
				setError(errorMsg);
				setMessage("");
			});
	};

	return (
		<div>
			<NavBar />
			<div className="auth">
				<div className="left-column">
					<FormSide tipo="sign-up" />
				</div>
				<div className="right-column">
					<FormAuth
						title="Sign Up"
						showUsername={true}
						username={username}
						setUsername={setUsername}
						email={email}
						setEmail={setEmail}
						password={password}
						setPassword={setPassword}
						textButton="Sign Up"
						onSubmit={handleSubmit}
						message={message}
						error={error}
					/>
				</div>
			</div>
		</div>
	);
}

export default Signup;
