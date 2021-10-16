import React, { useEffect, useContext, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

// reactstrap components
import {
	Button,
	Row,
	Col,
	Card,
	CardBody,
    CardImg,
	CardTitle,
	CardSubtitle,
	TabContent,
	TabPane,
} from 'reactstrap';
import Sidebar from 'MyComponents/sidebar/Sidebar';
// Core Components
import Api from 'api/api';
import UserContext from 'UserContext';
import SendFriendRequestButton from 'MyComponents/SendFriendRequestButton';
import ImageUpload from 'MyComponents/common/ImageUpload';
import Charts from 'MyComponents/Charts';
import Post from 'MyComponents/Posts';
import NewPostFormModal from 'MyComponents/NewPostFormModal';
import './design/userProfileDesign.css';

function UserProfile(props) {
	const { username } = useParams();
	const { currentUser } = useContext(UserContext);
	const [loadedUser, setLoadedUser] = useState(null);
	const [currentTab, setCurrentTab] = useState('Goals');
	const PF = process.env.REACT_APP_PF;
	const friendsUsernames = currentUser.friends.map((f) =>
		f.user_from === currentUser.username ? f.user_to : f.user_from
	);

	useEffect(() => {
		const getLoadedUser = async () => {
			try {
				const user = await Api.getCurrentUser(username);
				setLoadedUser(user);
			} catch (e) {
				console.error(e);
			}
		};
		getLoadedUser();
	}, [username]);

	console.debug(
		'UserProfile:',
		'username=',
		username,
		'loadedUser=',
		loadedUser
	);

	const handleSideBarClick = (tab) => {
		setCurrentTab(tab);
	};

	return (
		<>
			<Row className='profile-container'>
				<Col lg='3'>
					<Sidebar
						currentPage='profile'
						posts={loadedUser?.posts}
						goals={loadedUser?.goals}
						setCurrentTab={handleSideBarClick}
						currentTab={currentTab}
					/>
				</Col>
				<Col lg='2'>
					<Card>
						{loadedUser?.username === currentUser.username &&
							!currentUser.profileImage && (
								<ImageUpload avatar addBtnClasses='mt-7' />
							)}
                        
						<CardTitle>
							<h3>
								{loadedUser?.firstName} {loadedUser?.lastName}
							</h3>

							<div>{loadedUser?.email}</div>
						</CardTitle>
						<CardSubtitle>
							<div>
								<span>{loadedUser?.posts?.length}</span>
								<span>Posts</span>
							</div>

							<div>
								<span>{loadedUser?.friends?.length}</span>
								<span>Friends</span>
							</div>

							<div>
								<span>{loadedUser?.goals?.length}</span>
								<span>Goals</span>
							</div>
						</CardSubtitle>
					</Card>
					{/*<div>
						{currentUser.username !== loadedUser?.username &&
							!friendsUsernames.includes(
								loadedUser?.username
							) && (
								<SendFriendRequestButton
									targetUsername={loadedUser?.username}
								/>
							)}
					</div>*/}
				</Col>

				<Col lg='7'>
					{/* The ProfileTab was here */}
					<Card>
						<CardBody>
							<TabContent
								id='myTabContent'
								activeTab={currentTab}
							>
								<TabPane tabId='Goals' role='tabpanel'>
									{loadedUser?.goals?.length === 0 ? (
										<div>
											<h2>No goals</h2>
											{currentUser.username ===
												loadedUser?.username && (
												<Button>Post One</Button>
											)}
										</div>
									) : (
										// Do the Goals HERE
										<div>
											{loadedUser?.goals?.map((goal) => (
												<div key={goal.id}>
													{goal.id}
												</div>
											))}
										</div>
									)}
								</TabPane>

								<TabPane tabId='Posts' role='tabpanel'>
									{loadedUser?.posts?.length === 0 ? (
										<>
											<h2>No posts</h2>
											{currentUser.username ===
												loadedUser?.username && (
												<NewPostFormModal buttonText='Post one' />
											)}
										</>
									) : (
										<>
											<NewPostFormModal buttonText='New post' />
											{loadedUser?.posts?.map((p) => (
												<Post
													profileImage={
														loadedUser?.profileImage
													}
													type='Posts'
													post={p}
													key={p.id}
												/>
											))}
										</>
									)}
								</TabPane>

								<TabPane tabId='Progress' role='tabpanel'>
									<Charts />
								</TabPane>

								<TabPane tabId='Feed' role='tabpanel'></TabPane>
							</TabContent>
						</CardBody>
					</Card>
				</Col>
			</Row>
		</>
	);
}

export default UserProfile;
