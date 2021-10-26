import React, { useEffect, useContext, useState } from "react";
import { useParams, Link } from "react-router-dom";

// reactstrap components
import { Button, TabContent, TabPane } from "reactstrap";
import Sidebar from "MyComponents/sidebar/Sidebar";
// Core Components
import Api from "api/api";
import UserContext from "UserContext";
import SendFriendRequestButton from "MyComponents/SendFriendRequestButton";
import Charts from "MyComponents/Charts";
import Post from "MyComponents/Post/Post";
import NewPostFormModal from "MyComponents/NewPostFormModal";
import UserFeed from "../../MyComponents/feed/Feed.js";
import RightBar from "MyComponents/rightbar/RightBar";
import Goals from "MyComponents/goals/Goals";

import "./userProfile.css";

function UserProfile(props) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { username } = useParams();
  const { currentUser, friendsUsernames, currentUserProfileImage, currentUserCoverPic, setCurrentUserCoverPic } = useContext(UserContext);
  const [loadedUser, setLoadedUser] = useState(null);
  const [currentTab, setCurrentTab] = useState("Feed");

  const [posts, setPosts] = useState(null);
  const [isMyProfile, setIsMyProfile] = useState(
    username === currentUser?.username
  );

  useEffect(() => {
    setIsMyProfile(username === currentUser?.username);

  }, [username]);

  useEffect(() => {
    const getLoadedUser = async () => {
      try {
        const user = await Api.getCurrentUser(username);
        setLoadedUser(user);
      } catch (e) {
        console.error(e);
      }
    };
    const getPostsFullDetails = async () => {
      try {
        const posts = await Api.getPostsDetailsByUsername(username);
        setPosts(posts);
      } catch (e) {
        console.error(e);
      }
    };
    getLoadedUser();
    getPostsFullDetails();
  }, [username, posts?.length]);

  const handleSideBarClick = (tab) => {
    setCurrentTab(tab);
  };

  const deletePost = async (postId) => {
    try {
      await Api.deletePost(currentUser.username, postId);
      setPosts((posts) => posts.filter((p) => p.id !== postId));
    } catch (e) {
      console.error(e);
    }
  };
  console.debug(
    "UserProfile:",
    "username=",
    username,
    "loadedUser=",
    loadedUser,
    "posts=",
    posts,
  );
  return (
    <>
      <div className="profile">
        <Sidebar
          currentPage="profile"
          posts={loadedUser?.posts}
          goals={loadedUser?.goals}
          setCurrentTab={handleSideBarClick}
          currentTab={currentTab}
        />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              {isMyProfile ? (
                <>
                  <img className="profileCoverImg" src={currentUserCoverPic ? PF + currentUserCoverPic : require("assets/img/ill/bg_contactus3.svg")} />
                  <img className="profileUserImg" src={currentUserProfileImage ? PF + currentUserProfileImage : require("assets/img/placeholder.jpg")} />
                </>
              ) : (
                <>
                  <img
                    className="profileCoverImg"
                    src={loadedUser?.profileCoverImage ? PF + loadedUser?.profileCoverImage : require("assets/img/ill/bg_contactus3.svg")} alt="" />
                  <img
                    className="profileUserImg"
                    src={loadedUser?.profileImage ? PF + loadedUser?.profileImage : require("assets/img/placeholder.jpg")} alt="" />
                </>
              )}

            </div>
            <div className="profileInfo">
              <h4 className="profileInfoName">{loadedUser?.username}</h4>
              <span className="profileInfoDesc">
                {loadedUser?.firstName} {loadedUser?.lastName}
              </span>
            </div>
          </div>
          <div className="profileRightBottom">
            <TabContent id="myTabContent" activeTab={currentTab}>
              <TabPane tabId="Goals" role="tabpanel">
                {loadedUser?.goals?.length === 0 && (
                    <h2>No goals</h2>                   
                )}
                <Goals isMine={isMyProfile} userGoals={loadedUser?.goals} />
              </TabPane>

              <TabPane tabId="Posts" role="tabpanel">
                {loadedUser?.posts?.length === 0 ? (
                  <>
                    <h2>No posts</h2>
                  </>
                ) : (
                  <>
                    {posts?.map((p) => (
                      <Post
                        profileImage={loadedUser?.profileImage}
                        loadedUser={loadedUser}
                        type="Posts"
                        post={p}
                        key={p.id}
                        friendsUsernames={friendsUsernames}
                        deletePost={() => deletePost(p.id)}
                      />
                    ))}
                  </>
                )}
              </TabPane>

              <TabPane tabId="Progress" role="tabpanel">
                <Charts />
              </TabPane>
              <TabPane tabId="Feed" role="tabpanel">
                <UserFeed username={username} />
              </TabPane>
            </TabContent>
          </div>
        </div>
        <RightBar user={loadedUser} />
      </div>
    </>
  );
}

export default UserProfile;
