import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import {
	Card,
	CardHeader,
	CardBody,
	FormGroup,
	Input,
	InputGroupAddon,
	InputGroupText,
	InputGroup,
	ListGroup,
	Row,
	Col,
	Form
} from "reactstrap";

import Message, { TypingMessage } from "MyComponents/messenger/Message";
import UserContext from "UserContext";
import Api from "api/api";
import Conversation from "MyComponents/messenger/Conversation";
import ChatHeader from "MyComponents/messenger/ChatHeader";
import OnlineFriends from "MyComponents/messenger/MessengerFriends";
import { io } from "socket.io-client";
/**
 * conversations : [
 *  {
 *     createdAt : date,
 *     updatedAt : date
 *     members : [ usernames, usernames ]
 *   },
 *   {
 *     createdAt : date,
 *     updatedAt : date,
 *     members : [usernames, usernames ]
 *   }
 * ]
 *
 * currentChat = {
 *   id : int,
 *   members : ['username', 'username'],
 *   name : string
 * }
 *
 *
 */

function Messenger() {
	const [searchFocus, setSearchFocus] = useState('');
	const [messageFocus, setMessageFocus] = useState('');
	const { currentUser } = useContext(UserContext);

	const [conversations, setConversations] = useState([]);
	const [currentChat, setCurrentChat] = useState(null);
	const [messages, setMessages] = useState(null);
	const [message, setMessage] = useState('');
	const [typing, setTyping] = useState(null);

	const [arrivalMessage, setArrivalMessage] = useState(null);
	const [onlineUsers, setOnlineUsers] = useState([]);

	const scrollRef = useRef();
	const socket = useRef();

	React.useEffect(() => {
		const getConversations = async () => {
			try {
				const res = await Api.getConversations(currentUser.username);
				console.log(res)
				setConversations(res);
			}
			catch (e) {
				console.error(e);
			}
		}
		getConversations();
	}, [currentUser.username]);

	React.useEffect(() => {
		const getMessages = async () => {
			try {
				const res = await Api.getMessages(currentChat?.roomId);
				setMessages(res)
			} catch (e) {
				console.error(e);
			}
		};
		getMessages();
	}, [currentChat]);

	useEffect(() => {
		socket.current = io('ws://localhost:8900');
		socket.current.on('getMessage', (data) => {
			console.log(data);
			setArrivalMessage({ sentBy: data.senderUsername, text: data.text });
		});
		socket.current.on('getTyping', (bool) => setTyping(bool));
		socket.current.on('done-typing', (bool) => setTyping(bool));
		setFriendsList(friendsUsernames);
	}, []);

	useEffect(() => {
		arrivalMessage && currentChat?.members.includes(arrivalMessage.sentBy) && setMessages(messages => [...messages, arrivalMessage]);
		console.debug("socket arrivalMessage", arrivalMessage)
	}, [currentChat, arrivalMessage])

	useEffect(() => {
		socket && socket.current.emit('addUser', currentUser.username);
		socket &&
			socket.current.on('getUsers', (users) => {
				console.log(users);
				setOnlineUsers(users); // [{ username, socketId }, { username, socketId }]
			});
	}, [currentUser]);

	useEffect(() => {
		const getConversations = async () => {
			try {
				const res = await Api.getConversations(currentUser.username);
				setConversations(res);
			} catch (e) {
				console.error(e);
			}
		};
		getConversations();
	}, [currentUser.username]);

	useEffect(() => {
		const getMessages = async () => {
			try {
				const res = await Api.getMessages(currentChat.id);
				setMessages(res);
			} catch (e) {
				console.error(e);
			}
		};
		getMessages();
	}, [currentChat]);

	const handleChange = (e) => {
		setMessage(e.target.value);
		const roomMembersExceptForMe = currentChat.members.filter(
			(username) => username !== currentUser.username
		);
		for (const user of roomMembersExceptForMe) {
			socket.current.emit('typing', {
				senderUsername: currentUser.username,
				receiverUsername: user,
			});
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const messageBody = {
			text: message,
			roomId: currentChat?.id,
		};
		const roomMembersExceptForMe = currentChat.members.filter(
			(username) => username !== currentUser.username
		);
		for (const user of roomMembersExceptForMe) {
			socket.current.emit('sendMessage', {
				senderUsername: currentUser.username,
				receiverUsername: user,
				text: message,
			});
		}

		try {
			const message = await Api.sendMessage(
				messageBody,
				currentUser.username
			);
			setMessages((messages) => [...messages, message]);
			setMessage('');
		} catch (e) {
			console.error(e);
		}
	};

	useEffect(() => {
		message.length === 0 &&
			socket.current.emit('done-typing', currentUser.username);
	}, [message]);

	useEffect(() => {
		scrollRef.current &&
			scrollRef.current.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	useEffect(() => { }, [friendsUsernames]);

	useEffect(() => {
		console.log(searchFriendText);
	}, [searchFriendText]);

	console.debug(
		'MessengerConversations=',
		conversations,
		'MessengerCurrentChat=',
		currentChat,
		'MessengerMessages=',
		messages,
		'MessengerMessage=',
		message,
		'MessengerOnlineUsers=',
		onlineUsers
	);
	return (
		<>
			<Row className='flex-row chat'>
				<Col lg='3'>
					<Card className='bg-secondary'>
						<CardHeader className={'mb-3 ' + searchFocus}>
							<InputGroup className='input-group-alternative'>
								<Input
									placeholder='Search contact'
									type='text'
									onChange={(text) =>
										setSearchFriendText(text)
									}
									onFocus={() => setSearchFocus('focused')}
									onBlur={() => setSearchFocus('')}
								/>
							</InputGroup>
							<ListGroup>
								{friendsUsernames.map((friend) => {
									return (
										<ListGroupItem className='lgi'>{friend}</ListGroupItem>
									);
								})}
							</ListGroup>
						</CardHeader>
                        <CardBody>
                            <InputGroupAddon addonType='append'>
									<Button type= 'button'>Button</Button>
							</InputGroupAddon>
                        </CardBody>
                        
						<ListGroup className='list-group-chat' flush tag='div'>
							{conversations?.map((c) => (
								<div
									onClick={() => {
										setCurrentChat(c);
									}}
								>
									<Conversation conversation={c} />
								</div>
							))}
						</ListGroup>
					</Card>
				</Col>

				<Col lg='6'>
					<Card>
						<CardHeader className='d-inline-block'>
							{currentChat ? (
								<ChatHeader members={currentChat?.members} />
							) : null}
						</CardHeader>
						<CardBody>
							{currentChat ? (
								messages?.map((m) => (
									<div ref={scrollRef}>
										<Message
											message={m}
											mine={
												m.sentBy ===
												currentUser.username
											}
										/>
									</div>
								))
							) : (
								<span>Open a conversation to start a chat</span>
							)}
                            {typing?<TypingMessage/>:null}
						</CardBody>
					</Card>
					<Card>
						{currentChat ? (
							<Form onSubmit={handleSubmit} role='form'>
								<FormGroup className={messageFocus}>
									<InputGroup className='mb-4'>
										<Input
											placeholder='Your message'
											type='text'
											onFocus={() =>
												setMessageFocus('focused')
											}
											onBlur={() => setMessageFocus('')}
											onChange={handleChange}
											value={message}
										/>
										<InputGroupAddon addonType='append'>
											<InputGroupText>
												<i className='ni ni-send'></i>
											</InputGroupText>
										</InputGroupAddon>
									</InputGroup>
								</FormGroup>
							</Form>
						) : null}
					</Card>
				</Col>
				<Col lg='3'>
					<OnlineFriends
						friendsUsernames={friendsUsernames}
						onlineUsers={onlineUsers}
						setCurrentChat={setCurrentChat}
					/>
				</Col>
			</Row>
		</>
	);
}

export default Messenger;
