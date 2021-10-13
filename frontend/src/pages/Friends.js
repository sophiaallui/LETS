import React, { useState, useEffect, useContext } from "react";
import Api from "api/api";
import UserContext from "UserContext";
import { Row, Col, Card, CardHeader, CardBody, ListGroupItem, ListGroup, Button, Container } from "reactstrap";
import { Link } from "react-router-dom";
import { createImportSpecifier } from "typescript";

const Friends = props => {
  const { currentUser } = useContext(UserContext);
  const friendsUsernames = currentUser.friends.map(f => f.user_from === currentUser.username ? f.user_to : f.user_from)

  const [myFriends, setMyFriends] = useState(null)
  const [usersAwaitingMyConfirmation, setUsersAwaitingMyConfirmation] = useState(null);
  const [mySentRequests, setMySentRequests] = useState(null);

  useEffect(() => {
    const getCurrentFriends = async () => {
      try {
        const pendingMyConfirmation = await Api.getPendingFriendRequests(currentUser.username);
        setUsersAwaitingMyConfirmation(pendingMyConfirmation);
        const mySentFriendReqs = await Api.getMyrequests(currentUser.username);
        setMySentRequests(mySentFriendReqs);
      }
      catch(e) {
        console.error(e);
      }
    }
    getCurrentFriends();
  }, [currentUser]);

  console.debug("usersAwaitingMyConfirmation=", usersAwaitingMyConfirmation, "mySentRequests",mySentRequests);
  return (
    <>
      <Container fluid>
        <Row className="flex-row">
          <Col lg="8">
            
          </Col>
        </Row>
      </Container>
    </>
  )
};

export default Friends;