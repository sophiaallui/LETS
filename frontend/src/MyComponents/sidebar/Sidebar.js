import React, { useEffect, useContext, useState } from "react";
import "./sidebar.css";
import Api from "api/api";
import UserContext from "UserContext";
import { Link } from "react-router-dom";

const Sidebar = (props) => {
  const [friends, setFriends] = useState([]);
  const { currentUser } = useContext(UserContext);
  const friendsUsernames = currentUser.friends.map((f) =>
    f.user_from === currentUser.username ? f.user_to : f.user_from
  );

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const allPromise = Promise.all(
          friendsUsernames.map((username) => Api.getCurrentUser(username))
        );
        const friendsData = await allPromise;
        setFriends(friendsData);
      } catch (e) {
        console.error(e);
      }
    };

    fetchFriends();
  }, [currentUser.username]);
  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <ul className="sidebarList">
          <li className="sidebarFriend">
            <img
              className="sidebarFriendImg"
              src={
                currentUser.profileImage
                  ? currentUser.profileImage
                  : require("assets/img/placeholder.jpg")
              }
              alt=""
            />
            <span className="sidebarFriendName">{currentUser.username}</span>
          </li>
          <li className="sidebarListItem">
            <span className="sidebarListItemText">Feed</span>
          </li>
          <li className="sidebarListItem">
            <span className="sidebarListItemText">Chats</span>
          </li>
          <li className="sidebarListItem">
            <span className="sidebarListItemText">Videos</span>
          </li>
          <li className="sidebarListItem">
            <span className="sidebarListItemText">Groups</span>
          </li>
          <li className="sidebarListItem">
            <span className="sidebarListItemText">Bookmarks</span>
          </li>
          <li className="sidebarListItem">
            <span className="sidebarListItemText">Questions</span>
          </li>

          <li className="sidebarListItem">
            <span className="sidebarListItemText">Events</span>
          </li>
        </ul>
        <button className="sidebarButton">Show More</button>
        <hr className="sidebarHr" />

        <ul className="sidebarFriendList">
          {friends?.map((user) => (
            <Link to={`profile/${user.username}`}>
              <li className="sidebarFriend" key={user.username}>
                <img
                  className="sidebarFriendImg"
                  src={
                    user.profileImage
                      ? user.profileImage
                      : require("assets/img/placeholder.jpg")
                  }
                  alt=""
                />
                <span className="sidebarFriendName">{user.username}</span>
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
