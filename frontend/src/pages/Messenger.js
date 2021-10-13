import React, {useState, useEffect, useContext ,useRef}from 'react';
// reactstrap components
import {
	Card,
	CardHeader,
	CardBody,
	CardFooter,
	FormGroup,
	Input,
	InputGroupAddon,
	InputGroupText,
	InputGroup,
	ListGroup,
    ListGroupItem,
    Spinner,
	Row,
	Col,
	Form,
} from 'reactstrap';
import Message, { TypingMessage } from 'MyComponents/messenger/Message';
import UserContext from 'UserContext';
import Api from 'api/api';
import Conversation from 'MyComponents/messenger/Conversation';
import ChatHeader from 'MyComponents/messenger/ChatHeader';
import OnlineFriends from 'MyComponents/messenger/MessengerFriends';
import { io } from 'socket.io-client';
import './design/messengerDesign.css';
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
	const [conversations, setConversations] = useState([]);
	const [currentChat, setCurrentChat] = useState(null);
	const [messages, setMessages] = useState(null);
	const [message, setMessage] = useState('');
	const [typing, setTyping] = useState(null);
    const [searchFriendText, setSearchFriendText]= useState('');
	const [arrivalMessage, setArrivalMessage] = useState(null);
	const [onlineUsers, setOnlineUsers] = useState([]);
    const [loading, setLoading]=useState(false);
    const [friendsList, setFriendsList]=useState(null);

    const { currentUser } = useContext(UserContext);

	const scrollRef = useRef();
	const socket = useRef();

	const friendsUsernames = currentUser.friends.map((f) =>
		f.user_from === currentUser.username ? f.user_to : f.user_from
	);

    
	console.debug(friendsUsernames);
	useEffect(() => {
		socket.current = io('ws://localhost:8900');
		socket.current.on('getMessage', (data) => {
			console.log(data);
			setArrivalMessage({ sentBy: data.senderUsername, text: data.text });
		});
		socket.current.on('getTyping', (bool) => setTyping(bool));
		socket.current.on('done-typing', (bool) => setTyping(bool));
	}, []);

	useEffect(() => {
		arrivalMessage &&
			currentChat?.members.includes(arrivalMessage.sentBy) &&
			setMessages((messages) => [...messages, arrivalMessage]);
		console.debug('socket arrivalMessage=', arrivalMessage);
	}, [arrivalMessage, currentChat]);

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
				console.log(res);
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
                if(currentChat) {
                    const res = await Api.getMessages(currentChat.roomId);
                    setMessages(res);
                }

			} catch (e) {
				console.error(e);
			}
		};
		getMessages();
	}, [currentChat]);

    useEffect(() => {
		message.length === 0 &&
			socket.current.emit('done-typing', currentUser.username);
	}, [message]);

	useEffect(() => {
		scrollRef.current &&
			scrollRef.current.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

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
			roomId: currentChat?.roomId,
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

    let filteredFriendsList = friendsUsernames.filter((friend)=>{
        if(searchFriendText ===''){
            return null;
        } else if(friend.toLowerCase().includes(searchFriendText.toLowerCase())){
            return friend
        }
    }).map((name)=>{
        console.log(name)
        return <ListGroupItem>{name}</ListGroupItem>
    })

	return (
		<>
			<Row>
				<Col lg='3'>
                    <Card className='messenger-search'>
                        <InputGroup>
                            <Input
                                placeholder='Search contact'
                                type='text'
                                value={searchFriendText}
                                onChange={(e)=>{
                                    setLoading(true)
                                    setSearchFriendText(e.target.value)}}
                            />
                            <InputGroupAddon addonType='append'>
                                <InputGroupText>
                                    <i
                                        onClick={() => {
                                            console.log('x clicked');
                                            setSearchFriendText('');
                                        }}
                                        className='ni ni-fat-remove'/>
                                </InputGroupText>
                            </InputGroupAddon>
                        </InputGroup>
                    </Card>
                    <div className='list-group-container'>
                        <ListGroup className='friend-search-result'>
                            {filteredFriendsList}
                        </ListGroup>
                    </div>
                    

					<ListGroup>
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
				</Col>

				<Col lg='6'>
					<Card>
						<CardHeader>
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
							{typing ? <TypingMessage /> : null}
						</CardBody>
						<CardFooter>
							{currentChat ? (
								<Form onSubmit={handleSubmit} role='form'>
									<FormGroup className={messageFocus}>
										<InputGroup className='mb-4'>
											<Input
												placeholder='Your message'
												type='text'
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
						</CardFooter>
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
