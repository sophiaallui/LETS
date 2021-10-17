import React, { useEffect, useContext, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

// reactstrap components
import {
	Button,
	Row,
	Col,
	Card,
	CardBody,
	CardSubtitle,
	CardTitle,
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
import CardText from 'reactstrap/lib/CardText';
import './design/userProfileDesign.css'

function UserProfile(props) {
	const { username } = useParams();
	const { currentUser } = useContext(UserContext);
	const [loadedUser, setLoadedUser] = useState(null);
	const [currentTab, setCurrentTab] = useState('Goals');
	const [file, setFile] = useState(null);
	const PF = process.env.REACT_APP_PUBLIC_FOLDER;
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

	const handleProfileImageSubmit = async (e) => {
		e.preventDefault();
		if (file) {
			const data = new FormData();
			const filename = Date.now() + file.name;
			data.append('name', filename);
			data.append('file', file);
			try {
				await Api.request(`api/images`, data, 'POST');
				await Api.updateUser(
					currentUser?.username,
					{ profileImage: filename },
					'PUT'
				);
			} catch (e) {
				console.error(e);
			}
		}
		window.location.reload();
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
					<Card className='profile'>
						<div>
							<img
                                width='500'
								src={
									loadedUser?.profileImage
										? PF + loadedUser?.profileImage
										: require('assets/img/placeholder.jpg')
								}
							/>
							{loadedUser?.username === currentUser.username &&
								!currentUser.profileImage && (
									<form onSubmit={handleProfileImageSubmit}>
										<ImageUpload
											avatar
											addBtnClasses='mt-7'
											setFile={setFile}
										/>
										{file && (
											<Button
												size='sm'
												onSubmit={
													handleProfileImageSubmit
												}
											>
												Post
											</Button>
										)}
									</form>
								)}
						</div>
						<CardBody>
							<CardTitle>
								{loadedUser?.firstName} {loadedUser?.lastName}
							</CardTitle>

							<CardSubtitle>{loadedUser?.email}</CardSubtitle>
							{currentUser.username !== loadedUser?.username &&
								!friendsUsernames.includes(
									loadedUser?.username
								) && (
									<SendFriendRequestButton
										targetUsername={loadedUser?.username}
									/>
								)}
						</CardBody>
						<CardText>
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
						</CardText>
				
					</Card>
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
