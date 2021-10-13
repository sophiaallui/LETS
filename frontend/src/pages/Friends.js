import React, { useState, useEffect, useContext } from "react";
import Api from "api/api";
import UserContext from "UserContext";
import { Row, Col, Container, Nav, NavItem, NavLink, TabPane, TabContent, Button } from "reactstrap";

import FriendCard from "MyComponents/FriendCard";

const Friends = props => {
  const [myFriends, setMyFriends] = useState([])
  const [usersAwaitingMyConfirmation, setUsersAwaitingMyConfirmation] = useState([]);
  const [mySentRequests, setMySentRequests] = useState([]);
  const [hTabsIcons, setHTabsIcons] = useState("hTabsIcons-1");
  const { currentUser } = useContext(UserContext);
  const friendsUsernames = currentUser.friends.map(f => f.user_from === currentUser.username ? f.user_to : f.user_from)


  useEffect(() => {
    const getCurrentFriends = async () => {
      try {
        const myFriendsPromise = Promise.all(friendsUsernames.map(username => Api.getCurrentUser(username)));
        const myFriendsData = await myFriendsPromise;
        setMyFriends(myFriendsData);
      }catch(e) {
        console.error(e);
      }
    }
    
    const getUsersWaitingForMyConfirmation = async () => {
      try {
        const usersWaitingUsernames = await Api.getPendingFriendRequests(currentUser.username);
        if(!usersAwaitingMyConfirmation.length) {
          return;
        }
        const usersWaitingPromise = Promise.all(usersWaitingUsernames?.map(username => Api.getCurrentUser(username)));
        const usersWaitingData = await usersWaitingPromise;
        setUsersAwaitingMyConfirmation(usersWaitingData);
      }
      catch(e) {
        console.error(e);
      }
    }

    const getMySentRequests = async () => {
      try{
        const myRequestsUsernames = await Api.getMySentRequests(currentUser.username);
        if(!myRequestsUsernames.length) {
          return;
        }
        const myRequestsPromise = Promise.all(myRequestsUsernames?.map(username => Api.getCurrentUser(username)));
        const myRequestsData = await myRequestsPromise;
        setMySentRequests(myRequestsData)
      }
      catch(e) {
        console.error(e);
      }
    }
    getCurrentFriends();
    getUsersWaitingForMyConfirmation();
    getMySentRequests();
  }, [currentUser?.username, friendsUsernames]);

  console.debug("usersAwaitingMyConfirmation=", usersAwaitingMyConfirmation, "mySentRequests",mySentRequests, "myFriends=", myFriends);
  return (
    <>
      <Container fluid>
        <Row className="flex-row">
          <Col lg="8">
            <div className="nav-wrapper">
              <Nav pills roles="tablist" className="nav-fill flex-column flex-md-row">
                <NavItem>
                  <NavLink 
                    onClick={()=>setHTabsIcons("hTabsIcons-1")}
                    className={`mb-sm-3 mb-md-0 ` + (hTabsIcons === "hTabsIcons-1" ? "active" : "")}>
                      Your Friends
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink 
                    onClick={()=>setHTabsIcons("hTabsIcons-2")}
                    className={`mb-sm-3 mb-md-0 ` + (hTabsIcons === "hTabsIcons-2" ? "active" : "")}>
                      Friend Requests
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink 
                    onClick={()=>setHTabsIcons("hTabsIcons-3")}
                    className={`mb-sm-3 mb-md-0 ` + (hTabsIcons === "hTabsIcons-2" ? "active" : "")}>
                      Still Waiting On
                  </NavLink>
                </NavItem>
              </Nav>
            </div>
            {myFriends?.map(user => (
              <FriendCard key={user.username} user={user} />
            ))}
          </Col>
        </Row>
      </Container>
    </>
  )
};

export default Friends;