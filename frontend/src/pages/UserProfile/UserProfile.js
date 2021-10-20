import React, { useEffect, useContext, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

// reactstrap components
import {
	Button,
	TabContent,
	TabPane,
} from 'reactstrap';
import Sidebar from 'MyComponents/sidebar/Sidebar';
// Core Components
import Api from 'api/api';
import UserContext from 'UserContext';
import SendFriendRequestButton from 'MyComponents/SendFriendRequestButton';
import Charts from 'MyComponents/Charts';
import Post from 'MyComponents/Post/Post';
import NewPostFormModal from 'MyComponents/NewPostFormModal';
import UserFeed from '../../MyComponents/feed/Feed.js';
import RightBar from "MyComponents/rightbar/RightBar";
import "./userProfile.css";

function UserProfile(props) {
	const PF = process.env.REACT_APP_PUBLIC_FOLDER;
	const { username } = useParams();
	const { currentUser, friendsUsernames } = useContext(UserContext);
	const [loadedUser, setLoadedUser] = useState(null);
	const [currentTab, setCurrentTab] = useState('Feed');

	const [posts, setPosts] = useState(null);
	const [mySentRequests, setMySentRequests] = useState([]);
	const [isMyProfile, setIsMyProfile] = useState(username === currentUser?.username)

	useEffect(() => {
		const fetchMySentReqs = async () => {
			try {
				const myRequests = await Api.request(`friends/${currentUser.username}/sent`);
				setMySentRequests(myRequests?.myRequests.map((f) => f.user_to));
			} catch (e) {
				console.error(e);
			}
		};
		setIsMyProfile(username === currentUser?.username)
		fetchMySentReqs();
	}, [username]);

	useEffect(() => {
		const getLoadedUser = async () => {
			try {
				const user = await Api.getCurrentUser(username);
				setLoadedUser(user);
			} catch (e) {
				console.error(e);
			}
		};
		const getPostsFullDetails = async () => {
			try {
				const posts = await Api.getPostsDetailsByUsername(username);
				setPosts(posts);
			} catch (e) {
				console.error(e);
			}
		};
		getLoadedUser();
		getPostsFullDetails();
	}, [username, posts?.length]);

	const handleSideBarClick = (tab) => {
		setCurrentTab(tab);
	};

	const deletePost = async (postId) => {
		try {
			await Api.deletePost(currentUser.username, postId);
			setPosts((posts) => posts.filter((p) => p.id !== postId));
		} catch (e) {
			console.error(e);
		}
	};

	console.debug(
		'UserProfile:',
		'username=',
		username,
		'loadedUser=',
		loadedUser,
		'posts=',
		posts
	);
	return (
		<>
			<div className="profile">
				<Sidebar
					currentPage='profile'
					posts={loadedUser?.posts}
					goals={loadedUser?.goals}
					setCurrentTab={handleSideBarClick}
					currentTab={currentTab}
				/>
				<div className="profileRight">
					<div className="profileRightTop">
						<div className="profileCover">
							<img
								className="profileCoverImg"
								src={loadedUser?.profileImage ? PF + loadedUser?.profileImage : require("assets/img/placeholder.jpg")}
								alt=""
							/>
							<img
								className="profileUserImg"
								src={loadedUser?.profileImage ? PF + loadedUser?.profileImage : require("assets/img/placeholder.jpg")}
								alt=""
							/>
						</div>
						<div className="profileInfo">
							<h4 className="profileInfoName">{loadedUser?.username}</h4>
							<span className="profileInfoDesc">{loadedUser?.firstName} {loadedUser?.lastName}</span>
						</div>

					</div>
					<div className="profileRightBottom">
						<TabContent id='myTabContent' activeTab={currentTab}>
							<TabPane tabId='Goals' role='tabpanel'>
								{loadedUser?.goals?.length === 0 ? (
									<div>
										<h2>No goals</h2>
										{isMyProfile && (<Button>Post One</Button>)}
									</div>
								) : (
									// Do the Goals HERE
									<div>
										{loadedUser?.goals?.map((goal) => (
											<div key={goal.id}>{goal.id}</div>
										))}
									</div>
								)}
							</TabPane>

							<TabPane tabId='Posts' role='tabpanel'>
								{loadedUser?.posts?.length === 0 ? (
									<>
										<h2>No posts</h2>
										{isMyProfile && (<NewPostFormModal buttonText='Post one' />)}
									</>
								) : (
									<>
										{posts?.map((p) => (
											<Post
												profileImage={loadedUser?.profileImage}
												loadedUser={loadedUser}
												type='Posts'
												post={p}
												key={p.id}
												friendsUsernames={friendsUsernames}
												deletePost={() => deletePost(p.id)}
											/>
										))}
									</>
								)}
							</TabPane>

							<TabPane tabId='Progress' role='tabpanel'>
								<Charts />
							</TabPane>
							<TabPane tabId='Feed' role='tabpanel'>
								<UserFeed username={username} />
							</TabPane>
						</TabContent>

					</div>

				</div>
				<RightBar user={loadedUser} />
		
			</div>
		</>
	);
}

export default UserProfile;
