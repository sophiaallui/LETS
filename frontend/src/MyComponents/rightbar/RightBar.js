import React, { useContext, useState, useEffect } from "react";
import Api from "api/api";
import { Link } from "react-router-dom";
import UserContext from "UserContext";
import SendFriendRequestButton from "MyComponents/SendFriendRequestButton";
import "./rightbar.css";

const Online = (user) => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  return (
    <li className="rightbarFriend">
      <div className="rightbarProfileImgContainer">
        <img
          className="rightbarProfileImg"
          src={PF + user.profileImage || require("assets/img/placeholder.jpg")}
          alt=""
        />
        <span className="rightbarOnline"></span>
      </div>
      <span className="rightbarUsername">{user.username}</span>
    </li>
  );
};

const RightBar = ({ user }) => {
  const { currentUser, friendsUsernames} = useContext(UserContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const getFriends = async () => {
      try {
        const friendsData = await Api.request(`friends/${user?.username}`);
        const fUsernames = friendsData?.friends?.map((f) =>
          f.user_to === user?.username ? f.user_from : f.user_to
        );
        const fPromise = Promise.all(
          fUsernames.map((username) => Api.getCurrentUser(username))
        );
        const friendsList = await fPromise;
        setFriends(friendsList);
      } catch (e) {
        console.error(e);
      }
    };
    getFriends();
  }, [user]);

  const HomeRightBar = () => {
    return (
      <>
        <div className="birthdayContainer">
          <img className="birthdayImg" src="assets/gift.png" alt="" />
          <span className="birthdayText">
            <b>Pola Foster</b> and <b>3 other friends</b> have a birhday today.
          </span>
        </div>
        <img className="rightbarAd" src="assets/ad.png" alt="" />
        <h4 className="rightbarTitle">Online Friends</h4>
        <ul className="rightbarFriendList">
          {friends.map((u) => (
            <Online key={u.id} user={u} />
          ))}
        </ul>
      </>
    );
  };

  const ProfileRightBar = () => {
    return (
      <>
        {user?.username !== currentUser?.username && !friendsUsernames.includes(user?.username) && (
          <SendFriendRequestButton targetUsername={user.username} />
        )}
        <h4 className="rightbarTitle">User information</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Name:</span>
            <span className="rightbarInfoValue">{user?.firstName + " " + user?.lastName}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Email:</span>
            <span className="rightbarInfoValue">{user?.email}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Posts:</span>
            <span className="rightbarInfoValue">{user?.posts.length}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Goals:</span>
            <span className="rightbarInfoValue">{user?.goals.length}</span>
          </div>
        </div>

        <h4 className="rightbarTitle">User friends</h4>
        <div className="rightbarFollowings">
          {friends.map((friend) => (
            <Link
              to={"/profile/" + friend.username}
              style={{ textDecoration: "none" }}
            >
              <div className="rightbarFollowing">
                <img
                  src={
                    friend.profileImage
                      ? PF + friend.profileImage
                      : require("assets/img/placeholder.jpg")
                  }
                  alt=""
                  className="rightbarFollowingImg"
                />
                <span className="rightbarFollowingName">{friend.username}</span>
              </div>
            </Link>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {/* {HomeRightBar()} */}
        {user ? ProfileRightBar() : HomeRightBar()}
      </div>
    </div>
  );
};

export default RightBar;
