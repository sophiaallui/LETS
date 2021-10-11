import React, { useEffect, useState, useContext } from "react";
import Api from "api/api";
import {
  Card,
  CardHeader,
  CardBody,
  ListGroup,
  ListGroupItem,
  Col,
  Row,
  Button,
} from "reactstrap";
import UserContext from "UserContext";
import { Link } from "react-router-dom";

const OnlineFriends = ({ friendsUsernames, setCurrentChat, onlineUsers }) => {
  const [friends, setFriends] = useState(null);
  const [onlineFriends, setOnlineFriends] = useState([]);

  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const allPromise = Promise.all(
          friendsUsernames.map((uName) => Api.getCurrentUser(uName))
        );
        const usersArray = await allPromise;
        setFriends(usersArray);
      } catch (e) {
        console.error(e);
      }
    };
    if (friendsUsernames.length > 0) {
      fetchFriends();
    }
  }, [friendsUsernames]);

  useEffect(() => {
    setOnlineFriends(
      friendsUsernames.filter((f) => onlineUsers.map(u => u.username).includes(f))
    );
  }, [onlineUsers, friends]);

  const handleClick = async (friendUsername) => {
    if(!friendUsername) return;
    try {
      const foundConversations = await Api.findRoom(currentUser.username, friendUsername);
      if(!Object.keys(foundConversations).length) {
        const data = { 
          recieverUsername : friendUsername
        }
        const newRoom = await Api.createRoom(currentUser.username, data);
        console.debug("newRoom=",newRoom)
        setCurrentChat(newRoom)  
      }
      setCurrentChat(foundConversations)
    }
    catch(e) {
      console.error(e)
    }
  }

  console.debug("onlineFriends=", onlineFriends, "friends", friends)
  return (
    <Card>
      <CardHeader>
        <h5 className="h3 mb-0">Friends</h5>
      </CardHeader>

      <CardBody>
        <ListGroup className="list my--3" flush>
          {friends?.map((f) => (
            <ListGroupItem className="px-0" key={f.username} onClick={() => handleClick(f.username)}>
              <Row className="align-items-center">
                <Col className="col-auto">
                  <Link
                    className="avatar rounded-circle"
                    to={`/profile/${f.username}`}
                  >
                    <img
                      alt="..."
                      src={require("assets/img/placeholder.jpg")}
                    />
                  </Link>
                </Col>
                <div className="col ml--2">
                  <h4 className="mb-0">
                    <a href="#pablo" onClick={(e) => e.preventDefault()}>
                      {f.firstName} {f.lastName}
                    </a>
                  </h4>
                  {onlineFriends.includes(f.username) ? (
                    <>
                      <span className="text-success">●</span>
                      <small>Online</small>
                    </>
                  ) : (
                    <>
                      <span className="text-danger">●</span>
                      <small>Offline</small>
                    </>
                  )}
                </div>
                <Col className="col-auto">
                  <Button color="primary" size="sm" type="button">
                    Add
                  </Button>
                </Col>
              </Row>
            </ListGroupItem>
          ))}
        </ListGroup>
      </CardBody>
    </Card>
  );
};

export default OnlineFriends;
