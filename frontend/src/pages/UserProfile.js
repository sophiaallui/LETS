import React, { useEffect, useContext, useState } from "react";
import { useParams, Link } from "react-router-dom";

// reactstrap components
import { Button, Row, Col, Card, CardBody, TabContent, TabPane } from "reactstrap";
import Sidebar from "MyComponents/sidebar/Sidebar";
// Core Components
import Api from "api/api";
import UserContext from "UserContext";
import SendFriendRequestButton from "MyComponents/SendFriendRequestButton";
import ImageUpload from "MyComponents/common/ImageUpload";
import Charts from "MyComponents/Charts";
import Post from "MyComponents/Posts";
import NewPostFormModal from "MyComponents/NewPostFormModal";

function UserProfile(props) {
  const { username } = useParams();
  const { currentUser } = useContext(UserContext);
  const [loadedUser, setLoadedUser] = useState(null);
  const [currentTab, setCurrentTab] = useState("Goals");
  const PF = process.env.PUBLIC_IMAGES_FOLDER;
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
    "UserProfile:",
    "username=",
    username,
    "loadedUser=",
    loadedUser
  );

  const handleSideBarClick = (tab) => {
    setCurrentTab(tab)
  }

  return (
    <>
      <Row>
        <Col lg="3">
          <Sidebar
            currentPage="profile"
            posts={loadedUser?.posts}
            goals={loadedUser?.goals}
            setCurrentTab={handleSideBarClick}
            currentTab={currentTab}
          />
        </Col>
        <Col lg="9" className="mt-7">
          <div className="px-4">
            <Row className="justify-content-center">
              <Col className="order-lg-2" lg="1">
                <div className="card-profile-image">
                  <img 
                    src={
                      loadedUser?.profileImage ?
                      PF + loadedUser.profileImage :
                      require("assets/img/placeholder.jpg")
                    }
                  />
                  {
                    loadedUser?.username === 
                      currentUser.username && 
                        !currentUser.profileImage && 
                      <ImageUpload avatar addBtnClasses="mt-7" />
                  }
                </div>
              </Col>
              <Col className="order-lg-3 text-lg-right" lg="5">
                <div className="card-profile-actions py-4 mt-lg-0">
                  {currentUser.username === 
                    loadedUser?.username && (
                    <Button
                      className="float-right"
                      color="info"
                      tag={Link}
                      to="/edit-profile"
                    >
                      Edit Profile
                    </Button>
                  )}

                  {currentUser.username !== 
                    loadedUser?.username && 
                      !friendsUsernames.includes(loadedUser?.username) 
                    && (
                    <SendFriendRequestButton
                      targetUsername={loadedUser?.username}
                    />
                  )}

                </div>
              </Col>

              <Col className="order-lg-1" lg="5">
                <div className="card-profile-stats d-flex justify-content-center">
                  <div>
                    <span className="heading">{loadedUser?.posts?.length}</span>
                    <span className="description">Posts</span>
                  </div>

                  <div>
                    <span className="heading">
                      {loadedUser?.friends?.length}
                    </span>
                    <span className="description">Friends</span>
                  </div>

                  <div>
                    <span className="heading">{loadedUser?.goals?.length}</span>
                    <span className="description">Goals</span>
                  </div>
                </div>
              </Col>
            </Row>

            <div className="text-center mt-5">
              <h3>
                {loadedUser?.firstName} {loadedUser?.lastName}
              </h3>

              <div className="h6 font-weight-300">{loadedUser?.email}</div>
            </div>

            <div className="mt-3 py-5 border-top text-center">
              <Row className="justify-content-center">
                <Col lg="12">
                  {/* The ProfileTab was here */}
                  <Card className="shadow">
                    <CardBody>
                      <TabContent id="myTabContent" activeTab={currentTab}>
                        <TabPane tabId="Goals" role="tabpanel">
                          {
                            loadedUser?.goals?.length === 0 ?
                              <div className="description">
                                <h2>No goals</h2>
                                {currentUser.username === loadedUser?.username && <Button>Post One</Button>}
                              </div> :
                              // Do the Goals HERE
                              <div className="description">
                                {loadedUser?.goals?.map(goal => (
                                  <div key={goal.id}>
                                    {goal.id}
                                  </div>
                                ))}
                              </div>
                          }
                        </TabPane>

                        <TabPane tabId="Posts" role="tabpanel">
                          {
                            loadedUser?.posts?.length === 0 ?
                              (<>
                                <h2>No posts</h2>
                                {currentUser.username === loadedUser?.username && <NewPostFormModal buttonText="Post one" />}
                              </>
                              )
                              : (
                                <>
                                  <NewPostFormModal buttonText="New post" />
                                  {loadedUser?.posts?.map(p => (
                                    <Post profileImage={loadedUser?.profileImage} type="Posts" post={p} key={p.id} />
                                  ))}
                                </>
                              )
                          }
                        </TabPane>

                        <TabPane tabId="Progress" role="tabpanel">
                          <Charts />
                        </TabPane>

                        <TabPane tabId="Feed" role="tabpanel">

                        </TabPane>
                      </TabContent>

                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
}

export default UserProfile;
