import React, { useState, useEffect, useContext } from "react";
import UserContext from "UserContext";
import Api from "api/api";

const UserFeed = ({friendsUsernames}) => {
	const [feed, setFeed] = useState(null);
	const { currentUser } = useContext(UserContext);
	
	useEffect(() => {
		const fetchFeed = async () => {
			try {
				const res = await Api.getUserFeed(currentUser.username);
			} catch(e) {
				console.error(e);
			}
		}
	}, [currentUser.username, friendsUsernames]);
	
	return (
		<h1>Feed</h1>
	)
};

export default UserFeed;