import React, { useContext } from "react";
import { Navigate } from "react-router-dom";

import { AuthContext } from "./AuthContext";
import LoadingSpinner from "../LoadingSpinner";

function PrivateRoute({ children }) {
	const { auth, loading } = useContext(AuthContext);

	if (loading) return <LoadingSpinner />;

	if (!auth) {
		return <Navigate to="/" replace />;
	}

	return children;
}

export default PrivateRoute;
