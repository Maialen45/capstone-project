import React from "react";

import NavBar from "../components/navbar/Navbar";

import Searchbar from "../components/Searchbar";

function Home() {
	return (
		<div>
			<NavBar />
			<div className="home-container">
				<div className="home-content">
					<h1>Find your next book!</h1>
					<p>Track your favourite books easily with BookNest.</p>
					<div className="home-searchbar-container">
						<Searchbar />
						<p>i.e. Sense and sensibility</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Home;
