import React, { useEffect, useContext, useState } from "react";
import { useParams, Link } from "react-router-dom";

// reactstrap components
import { Button, Row, Col, } from "reactstrap";
import Sidebar from "MyComponents/sidebar/Sidebar";
// Core Components
import ProfileCard from "MyComponents/ProfileCard";
import Api from "api/api";
import UserContext from "UserContext";
import SendFriendRequestButton from "MyComponents/SendFriendRequestButton";
import ImageUpload from "MyComponents/common/ImageUpload";

function UserProfile(props) {
  const { username } = useParams();
  const { currentUser } = useContext(UserContext);
  const [loadedUser, setLoadedUser] = useState(null);
  const [currentTab, setCurrentTab] = useState(null);

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
          <Sidebar currentPage="profile" posts={loadedUser?.posts} goals={loadedUser?.goals} setCurrentTab={handleSideBarClick} />
        </Col>
        <Col lg="9">
          <div className="px-4">

            <Row className="justify-content-center">
              <Col className="order-lg-2" lg="1">
                <div className="card-profile-image">
                  <ImageUpload avatar addBtnClasses="mt-8" />
                </div>
              </Col>
              <Col className="order-lg-3 text-lg-right " lg="5">
                <div className="card-profile-actions py-4 mt-lg-0">
                  {currentUser.username === loadedUser?.username && (
                    <Button
                      className="float-right"
                      color="info"
                      tag={Link}
                      to="/edit-profile"
                    >
                      Edit Profile
                    </Button>
                  )}
                  {currentUser.username !== loadedUser?.username && !friendsUsernames.includes(loadedUser?.username) && (
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
                <span className="font-weight-light">
                  , {loadedUser?.age || 27}
                </span>
              </h3>

              <div className="h6 font-weight-300">{loadedUser?.email}</div>
            </div>

            <div className="mt-5 py-5 border-top text-center">
              <Row className="justify-content-center">
                <Col lg="12">
                    {/* The ProfileTab was here */}
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
