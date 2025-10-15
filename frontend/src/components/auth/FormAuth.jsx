import React from "react";
import { Link } from "react-router-dom";

function FormAuth({
	title,
	showUsername = false,
	email,
	password,
	username,
	setEmail,
	setUsername,
	setPassword,
	onSubmit,
	textButton,
	message,
	error,
}) {
	return (
		<div className="form">
			<div className="form-title">
				<h2>{title}</h2>
			</div>
			<div className="form-container">
				<div className="form-subtitle">Enter your credentials:</div>
				<form onSubmit={onSubmit}>
					{showUsername && (
						<input
							type="text"
							placeholder="Username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							required
						/>
					)}
					<br />
					<input
						type="email"
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
					<br />
					<input
						type="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
					<br /> {message && <p className="success-msg">{message}</p>}
					{error && <p className="error-msg">{error}</p>}
					<button type="submit">{textButton}</button>
				</form>
			</div>
			<div className="form-link">
				{showUsername ? (
					<p>
						Already registered?
						<Link to="/log-in"> Log in here</Link>
					</p>
				) : (
					<p>
						Don't have an account?
						<Link to="/sign-up"> Sign up here</Link>
					</p>
				)}
			</div>
		</div>
	);
}

export default FormAuth;
