import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Results from "./pages/Results";
import Login from "./pages/Login";
import Signin from "./pages/Signin";
import ToBeRead from "./pages/ToBeRead";
import Read from "./pages/Read";
import PrivateRoute from "./components/auth/PrivateRoute";

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/results/:query" element={<Results />} />
				<Route path="/log-in" element={<Login />} />
				<Route path="/sign-in" element={<Signin />} />
				<Route
					path="/to-be-read"
					element={
						<PrivateRoute>
							<ToBeRead />
						</PrivateRoute>
					}
				></Route>
				<Route
					path="/read"
					element={
						<PrivateRoute>
							<Read />
						</PrivateRoute>
					}
				></Route>
				<Route path="*" element={<Navigate to="/" replace />}></Route>
			</Routes>
		</Router>
	);
}

export default App;
