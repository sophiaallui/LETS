import React, { useState, useEffect, useContext, useRef } from "react";
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
  Row,
  Col,
  Form,
} from "reactstrap";
import Message, { TypingMessage } from "MyComponents/messenger/Message";
import UserContext from "UserContext";
import Api from "api/api";
import Conversation from "MyComponents/messenger/Conversation";
import ChatHeader from "MyComponents/messenger/ChatHeader";
import OnlineFriends from "MyComponents/messenger/MessengerFriends";
import { io } from "socket.io-client";
import "./design/messengerDesign.css";
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
  const [messageFocus, setMessageFocus] = useState("");
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState(null);
  const [message, setMessage] = useState("");
  const [typing, setTyping] = useState(null);
  const [searchFriendText, setSearchFriendText] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hideSearchResults, setHideSearchResults] = useState(false);

  const [unreadMessage, setUndreadMessage] = useState(0);
  const [onlineChatroomMembers, setOnlineChatroomMembers] = useState(null);
  const [currentOnlineRoomId, setCurrentOnlineRoomId] = useState(null);
  const { currentUser, friendsUsernames, onlineUsers } = useContext(UserContext);

  const scrollRef = useRef();
  const socket = useRef();

  useEffect(() => {
    socket.current = io("ws://localhost:8900");
    socket.current.on("getMessage", (data) => {
      console.log(data);
      setArrivalMessage({ sentBy: data.senderUsername, text: data.text, roomId : data.roomId });
    });
    socket.current.on("getTyping", (bool) => setTyping(bool));
    socket.current.on("done-typing", (bool) => setTyping(bool));
    socket.current.on("user-joined", (obj) => {
      setOnlineChatroomMembers(obj.members);
      setCurrentOnlineRoomId(obj.roomId)
    })
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sentBy) &&
      setMessages((messages) => [...messages, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    arrivalMessage && 
    currentOnlineRoomId !== arrivalMessage?.roomId && setUndreadMessage(num => num + 1) 
  }, [arrivalMessage, currentOnlineRoomId])

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
        if (currentChat) {
          const res = await Api.getMessages(currentChat?.roomId);
          setMessages(res);
        }
      } catch (e) {
        console.error(e);
      }
    };
    getMessages();
    setUndreadMessage(0)

    // If currentChat.roomId BOTH currentOnlineRoomId exists, and they're not the same leave that room in socket.
    // should be triggered everytime currentChat changes/
    currentChat?.roomId && currentOnlineRoomId &&  
      currentChat.roomId !== currentOnlineRoomId && 
        socket.current.emit("leaveRoom", {roomId: currentOnlineRoomId, username : currentUser.username}) 
    
    // If ONLY currentChat.roomId exists and currentChat.roomId doesn't exist or isn't the same same as currentOnlineRoomId
    // join that new room.
    currentChat?.roomId && 
      currentChat?.roomId !== currentOnlineRoomId && 
        socket.current.emit("joinRoom", {roomId : currentChat.roomId, username : currentUser.username})
 
  }, [currentChat]);

  useEffect(() => {
    message.length === 0 &&
      socket.current.emit("done-typing", currentOnlineRoomId);
  }, [message]);

  useEffect(() => {
    scrollRef.current &&
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleChange = (e) => {
    setMessage(e.target.value);
    socket.current.emit("typing", {
      senderUsername: currentUser.username,
      roomId : currentChat?.roomId
    })
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const messageBody = {
      text: message,
      roomId: currentChat?.roomId,
    };
    socket.current.emit("sendMessage", {
      senderUsername : currentUser.username,
      roomId : currentChat?.roomId,
      text : message
    })

    try {
      const message = await Api.sendMessage(messageBody, currentUser.username);
      setMessages((messages) => [...messages, message]);
      setMessage("");
    } catch (e) {
      console.error(e);
    }
  };

  console.debug(
    "MessengerConversations=",
    conversations,
    "MessengerCurrentChat=",
    currentChat,
    "MessengerMessages=",
    messages,
    "MessengerOnlineChatroomMembers=", onlineChatroomMembers,
    "currentOnlineRoomId", currentOnlineRoomId
  );

  let filteredFriendsList = friendsUsernames
    .filter((friend) => {
      if (searchFriendText === "") {
        return null;
      } else if (
        friend.toLowerCase().includes(searchFriendText.toLowerCase())
      ) {
        return friend;
      }
    })
    .map((name) => {
      return <ListGroupItem>{name}</ListGroupItem>;
    });

  return (
    <>
      <Row className='messenger-container'>
        <Col lg="3">
          <Card className="messenger-search">
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <i className="fas fa-search" />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                placeholder="Search contact"
                type="text"
                value={searchFriendText}
                onFocus={() => setHideSearchResults(false)}
                onBlur={() => setHideSearchResults(true)}
                onChange={(e) => {
                  setLoading(true);
                  setSearchFriendText(e.target.value);
                }}
              />
              <InputGroupAddon addonType="append">
                <InputGroupText>
                  <i
                    onClick={() => {
                      console.log("x clicked");
                      setSearchFriendText("");
                    }}
                    className="ni ni-fat-remove"
                  />
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </Card>
          <div
            className={`${
              hideSearchResults
                ? "hide-list-group-container"
                : "list-group-container"
            }`}
          >
            <ListGroup className="friend-search-result">
              {filteredFriendsList.length === 0 &&
              searchFriendText.length > 0 ? (
                <ListGroupItem>No Match</ListGroupItem>
              ) : (
                filteredFriendsList
              )}
            </ListGroup>
          </div>

          <ListGroup>
            {conversations?.map((c) => (
              <div
                key={c.roomId}
                onClick={() => {
                  setCurrentChat(c);
                }}
              >
                <Conversation conversation={c} unreadMessage={unreadMessage} />
              </div>
            ))}
          </ListGroup>
        </Col>

        <Col lg="6">
          <Card>
            <CardHeader>
              {currentChat ? (
                <ChatHeader members={currentChat?.members} />
              ) : null}
            </CardHeader>
            <CardBody className="chat-box">
              {currentChat ? (
                messages?.map((m) => (
                  <div ref={scrollRef} key={m.id}>
                    <Message
                      message={m}
                      mine={m.sentBy === currentUser.username}
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
                <Form onSubmit={handleSubmit} role="form">
                  <FormGroup className={messageFocus}>
                    <InputGroup className="mb-4">
                      <Input
                        placeholder="Your message"
                        type="text"
                        onChange={handleChange}
                        value={message}
                      />
                      <InputGroupAddon addonType="append">
                        <InputGroupText>
                          <i className="ni ni-send"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                  </FormGroup>
                </Form>
              ) : null}
            </CardFooter>
          </Card>
        </Col>
        <Col lg="3">
          <OnlineFriends
            setCurrentChat={setCurrentChat}
          />
        </Col>
      </Row>
    </>
  );
}

export default Messenger;
