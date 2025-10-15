import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

import NavBar from "../components/navbar/Navbar";
import Searchbar from "../components/Searchbar";
import { AuthContext } from "../components/auth/AuthContext";
import BookCard from "../components/BookCard";
import LoadingSpinner from "../components/LoadingSpinner";
import SuccessMessage from "../components/SuccessMessage";

function Results() {
	const { query } = useParams();
	const [results, setResults] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [message, setMessage] = useState("");
	const [isMessageVisible, setIsMessageVisible] = useState(false);
	const navigate = useNavigate();

	const { auth } = useContext(AuthContext);

	useEffect(() => {
		if (!query) {
			setResults([]);
			return;
		}

		axios
			.get("http://localhost:5000/search", {
				params: { q: query },
			})
			.then((res) => {
				const items =
					res.data && Array.isArray(res.data.items)
						? res.data.items
						: [];
				setResults(items);
			})
			.catch((error) => {
				setResults([]);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, [query]);

	const handleMoreInfo = (infoLink) => {
		if (infoLink) {
			window.open(infoLink, "_blank");
		}
	};

	const handleAddToList = (book) => {
		const volumeInfo = book.volumeInfo;
		const payload = {
			title: volumeInfo.title || "",
			author: volumeInfo.authors ? volumeInfo.authors.join(", ") : "",
			genre: "",
			publication_date: volumeInfo.publishedDate || "",
			description: volumeInfo.description || "",
			imageUrl: volumeInfo.imageLinks?.thumbnail || null,
			infoUrl: volumeInfo.infoLink || "",
		};

		if (auth) {
			axios
				.post("http://localhost:5000/api/users/add-book", payload, {
					withCredentials: true,
				})
				.then((response) => {
					setMessage(response.data.message);
					setIsMessageVisible(true);
					setTimeout(() => {
						setIsMessageVisible(false);
					}, 5000);
				})
				.catch((error) => {
					if (error.response?.status === 401) {
						axios
							.post(
								"http://localhost:5000/api/users/refresh",
								{},
								{ withCredentials: true }
							)
							.then(() => {
								return axios.post(
									"http://localhost:5000/api/users/add-book",
									payload,
									{ withCredentials: true }
								);
							})
							.then((response) => {
								setMessage(response.data.message);
								setIsMessageVisible(true);
								setTimeout(
									() => setIsMessageVisible(false),
									5000
								);
							})
							.catch((refreshErr) => {
								setMessage(
									"Your session has expired. Please log in again."
								);
								setIsMessageVisible(true);
							});
					} else if (
						error.response &&
						error.response.status === 400
					) {
						setMessage(error.response.data.message);
						setIsMessageVisible(true);
						setTimeout(() => setIsMessageVisible(false), 5000);
					}
				});
		} else {
			navigate("/sign-up");
		}
	};

	return (
		<div>
			<NavBar></NavBar>
			{isLoading ? (
				<LoadingSpinner />
			) : (
				<div className="results-container">
					<Searchbar></Searchbar>
					{!isLoading && results.length === 0 ? (
						<div className="no-books-results">
							Sorry, we couldn't find your book. Try again.
						</div>
					) : (
						<div className="card-container">
							{Array.isArray(results) &&
								results.length > 0 &&
								results.map((book) => (
									<BookCard
										key={book.id}
										book={book}
										onMoreInfo={handleMoreInfo}
										onAddToList={handleAddToList}
									/>
								))}
						</div>
					)}
				</div>
			)}
			<SuccessMessage message={message} isVisible={isMessageVisible} />
		</div>
	);
}

export default Results;
