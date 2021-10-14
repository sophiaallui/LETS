import React, { useState, useEffect, useContext } from "react";
import Api from "api/api";
import UserContext from "../UserContext";
import { Row, Col, Container, Nav, NavItem, NavLink, TabPane, TabContent, Card, CardBody } from "reactstrap";

import FriendCard from "MyComponents/FriendCard";
import Sidebar from "MyComponents/sidebar/Sidebar";

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
      } catch (e) {
        console.error(e);
      }
    }

    const getUsersWaitingForMyConfirmation = async () => {
      try {
        const usersWaitingUsernames = await Api.getPendingFriendRequests(currentUser.username);
        if (!usersAwaitingMyConfirmation.length) {
          return;
        }
        const usersWaitingPromise = Promise.all(usersWaitingUsernames?.map(username => Api.getCurrentUser(username)));
        const usersWaitingData = await usersWaitingPromise;
        setUsersAwaitingMyConfirmation(usersWaitingData);
      }
      catch (e) {
        console.error(e);
      }
    }

    const getMySentRequests = async () => {
      try {
        const myRequestsUsernames = await Api.getMySentRequests(currentUser.username);
        if (!myRequestsUsernames.length) {
          return;
        }
        const myRequestsPromise = Promise.all(myRequestsUsernames?.map(username => Api.getCurrentUser(username)));
        const myRequestsData = await myRequestsPromise;
        setMySentRequests(myRequestsData)
      }
      catch (e) {
        console.error(e);
      }
    }
    getCurrentFriends();
    getUsersWaitingForMyConfirmation();
    getMySentRequests();
  }, [currentUser.username]);

  console.debug("usersAwaitingMyConfirmation=", usersAwaitingMyConfirmation, "mySentRequests", mySentRequests, "myFriends=", myFriends);
  return (
    <>
      <Container fluid>
        <Row className="d-flex justify-content-end mb-3">
          <Col lg="3">
            <Sidebar />
          </Col>
          <Col lg="9">
            <div className="nav-wrapper">
              <Nav pills roles="tablist" className="nav-fill flex-column flex-md-row">
                <NavItem>
                  <NavLink
                    onClick={() => setHTabsIcons("hTabsIcons-1")}
                    className={`mb-sm-3 mb-md-0 ` + (hTabsIcons === "hTabsIcons-1" ? "active" : "")}>
                    Your Friends
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    onClick={() => setHTabsIcons("hTabsIcons-2")}
                    className={`mb-sm-3 mb-md-0 ` + (hTabsIcons === "hTabsIcons-2" ? "active" : "")}>
                    Friend Requests
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    onClick={() => setHTabsIcons("hTabsIcons-3")}
                    className={`mb-sm-3 mb-md-0 ` + (hTabsIcons === "hTabsIcons-3" ? "active" : "")}>
                    Still Waiting On
                  </NavLink>
                </NavItem>
              </Nav>
            </div>
            <Card className="shadow">
              <CardBody>
                <TabContent id="myTabContent" activeTab={hTabsIcons}>

                  <TabPane tabId="hTabsIcons-1">
                    <div className="description">
                      <h5>Friends ({myFriends.length})</h5>
                      <Row>
                        {myFriends?.map(user => (
                          <Col lg="2" md="6">
                            <FriendCard type="currentFriends" key={user.username} user={user} />
                          </Col>
                        ))}
                      </Row>
                    </div>
                  </TabPane>

                  <TabPane tabId="hTabsIcons-2">
                    <div className="description">
                      <h5>Friend Requests ({usersAwaitingMyConfirmation.length})</h5>
                      <Row>
                        {usersAwaitingMyConfirmation.length > 0 &&
                          usersAwaitingMyConfirmation.map(user => (
                            <Col lg="2" md="6">
                              <FriendCard type="pending" key={user.username} user={user} />
                            </Col>
                          ))}
                      </Row>
                    </div>
                  </TabPane>

                  <TabPane tabId="hTabsIcons-3">
                    <div className="description">
                      <h5>Still waiting on</h5>
                      {mySentRequests.length > 0 && mySentRequests.map(user => (
                        <Col lg="2" md="6">
                          <FriendCard type="sent" key={user.username} user={user} />
                        </Col>
                      ))}
                    </div>
                  </TabPane>
                </TabContent>
              </CardBody>
            </Card>

          </Col>
        </Row>
      </Container>


    </>
  )
};

export default Friends;