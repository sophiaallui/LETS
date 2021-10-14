import React, { useState, useEffect, useContext } from "react";
import Api from "api/api";
import UserContext from "../UserContext";
import { Row, Col, Container,  TabPane, TabContent, Card, CardBody } from "reactstrap";

import FriendCard from "MyComponents/FriendCard";
import Sidebar from "MyComponents/sidebar/Sidebar";

const Friends = props => {
  const [myFriends, setMyFriends] = useState([])
  const [usersAwaitingMyConfirmation, setUsersAwaitingMyConfirmation] = useState([]);
  const [mySentRequests, setMySentRequests] = useState([]);
  const [currentTab, setCurrentTab] = useState("Friends")
  const { currentUser } = useContext(UserContext);
  const friendsUsernames = currentUser.friends.map(f => f.user_from === currentUser.username ? f.user_to : f.user_from)

  const handleClick = (tab) => {
    setCurrentTab(tab)
  };

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
            <Sidebar currentPage="friends" currentTab={currentTab} setCurrentTab={handleClick} />
          </Col>
          <Col lg="9">
            <Card className="shadow">
              <CardBody>
                <TabContent id="myTabContent" activeTab={currentTab}>

                  <TabPane tabId="Friends">
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

                  <TabPane tabId="Friend Requests">
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

                  <TabPane tabId="Still Waiting On">
                    <div className="description">
                      <h5>Still Waiting On ({mySentRequests.length})</h5>
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