import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const API_URL = process.env.REACT_APP_API_URL;
	const [auth, setAuth] = useState(false);
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const response = await axios.get(
					`${API_URL}/api/users/profile`,
					{ withCredentials: true }
				);
				setAuth(true);
				setUser(response.data);
			} catch (error) {
				if (error.response?.status === 401) {
					try {
						await axios.post(
							`${API_URL}/api/users/profile`,
							{},
							{ withCredentials: true }
						);

						const refreshedResponse = await axios.get(
							`${API_URL}/api/users/profile`,
							{ withCredentials: true }
						);

						setAuth(true);
						setUser(refreshedResponse.data);
					} catch (refreshError) {
						setAuth(false);
						setUser(null);
						axios
							.post(
								`${API_URL}/api/users/log-out`,
								{},
								{ withCredentials: true }
							)
							.catch(() => {});
					}
				} else {
					setAuth(false);
					setUser(null);
				}
			} finally {
				setLoading(false);
			}
		};

		fetchProfile();
	}, [API_URL]);

	return (
		<AuthContext.Provider
			value={{
				auth,
				setAuth,
				user,
				setUser,
				loading,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
