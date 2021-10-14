import React, { useEffect, useContext, useState } from "react";
import "./sidebar.css";
import Api from "api/api";
import UserContext from "UserContext";
import { Link } from "react-router-dom";

const Sidebar = ({ currentPage = "profile", setCurrentTab, currentTab }) => {
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

    let listItems;
    if (currentPage === "profile") {
        listItems = (
            <>
                <li className={`sidebarListItem ${currentTab === "Goals" ? "active" : ""}`} onClick={() => setCurrentTab("Goals")}>
                    <span className="sidebarListItemText">Goals</span>
                </li>
                <li className={`sidebarListItem ${currentTab === "Posts" ? "active" : ""}`} onClick={() => setCurrentTab("Posts")}>
                    <span className="sidebarListItemText">Posts</span>
                </li>
                <li className={`sidebarListItem ${currentTab === "Progress" ? "active" : ""}`} onClick={() => setCurrentTab("Progress")}>
                    <span className="sidebarListItemText">Progress</span>
                </li>
                <li className={`sidebarListItem ${currentTab === "Feed" ? "active" : ""}`} onClick={() => setCurrentTab("Feed")}>
                    <span className="sidebarListItemText">Feed</span>
                </li>
            </>

        )
    }
    else if (currentPage === "friends") {
        listItems = (
            <>
                <li className={`sidebarListItem ${currentTab === "Friends" ? "active" : ""}`} onClick={() => setCurrentTab("Friends")}>
                    <span className="sidebarListItemText">Friends</span>
                </li>
                <li className={`sidebarListItem ${currentTab === "Friend Requests" ? "active" : ""}`} onClick={() => setCurrentTab("Friend Requests")}>
                    <span className="sidebarListItemText">Friend Requests</span>
                </li>
                <li className={`sidebarListItem ${currentTab === "Stiill Waiting On" ? "active" : ""}`} onClick={() => setCurrentTab("Still Waiting On")}>
                    <span className="sidebarListItemText">Still Waiting On</span>
                </li>
            </>
        )
    }
    return (
        <div className="sidebar">
            <div className="sidebarWrapper" roles="tablist">
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
                    {listItems}
                </ul>
                <button className="sidebarButton">Show More</button>
                <hr className="sidebarHr" />

                <ul className="sidebarFriendList">
                    {friends?.map((user) => (
                        <Link to={`/profile/${user.username}`}>
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
