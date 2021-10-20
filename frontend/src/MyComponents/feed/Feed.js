import React, { useState, useEffect, useContext } from "react";
import UserContext from "UserContext";
import Api from "api/api";
import Share from "MyComponents/share/Share";
import "./feed.css";
import Post from "MyComponents/Post/Post";

const Feed = ({ username }) => {
	const [posts, setPosts] = useState([]);
	const { currentUser } = useContext(UserContext);
	useEffect(() => {
		const getPostsFullDetails = async () => {
			try {
				const posts = username 
					? await Api.getPostsDetailsByUsername(username)
					: await Api.getPostsDetailsByUsername(currentUser.username)
				setPosts(posts.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
			} catch (e) {
				console.error(e);
			}
		};
		getPostsFullDetails();
	}, [username, currentUser.username]);
	console.log("Feed posts=", posts)
	
	return (
		<div className="feed">
			<div className="feedWrapper">
				{!username || username === currentUser.username && <Share />}
				{posts.map(post => {
					return <Post key={post.id} post={post} />
				})}
			</div>
		</div>
	)
};

export default Feed;