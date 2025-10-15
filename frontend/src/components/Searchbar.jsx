import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

function Searchbar() {
	const [query, setQuery] = useState("");
	const navigate = useNavigate();

	const handleBookSearch = () => {
		if (!query.trim()) {
			return;
		}
		navigate(`/results/${encodeURIComponent(query)}`);
		setQuery("");
	};

	const handleKeyDown = (e) => {
		if (e.key == "Enter") {
			e.preventDefault();
			handleBookSearch();
		}
	};

	return (
		<div className="search-bar">
			<FontAwesomeIcon icon={faSearch} />
			<input
				type="text"
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				onKeyDown={handleKeyDown}
				placeholder="Search a book by title or author"
			/>
			<button onClick={handleBookSearch}>Search</button>
		</div>
	);
}

export default Searchbar;
