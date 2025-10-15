import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/auth/AuthContext";

import NavBar from "../components/navbar/Navbar";
import FormAuth from "../components/auth/FormAuth";
import FormSide from "../components/auth/FormSide";

function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const [message, setMessage] = useState("");
	const [error, setError] = useState("");

	const { setAuth, setUser } = useContext(AuthContext);
	const navigate = useNavigate();

	const handleLogin = (e) => {
		e.preventDefault();

		axios
			.post(
				"http://localhost:5000/api/users/log-in",
				{
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
				setAuth(true);
				setUser(response.data);
				navigate("/");
			})
			.catch((error) => {
				const errorMsg =
					error.response?.data?.error || "Error while loging in";
				setError(errorMsg);
				setMessage("");
			});
	};

	return (
		<div>
			<NavBar />
			<div className="auth">
				<div className="left-column">
					<FormSide tipo="log-in" />
				</div>
				<div className="right-column">
					<FormAuth
						title="Log In"
						showUsername={false}
						email={email}
						setEmail={setEmail}
						password={password}
						setPassword={setPassword}
						textButton="Log In"
						onSubmit={handleLogin}
						message={message}
						error={error}
					/>
				</div>
			</div>
		</div>
	);
}

export default Login;
