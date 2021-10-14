import React, { useEffect, useContext, useState } from "react";
import "./sidebar.css";
import Api from "api/api";
import UserContext from "UserContext";
import { Link } from "react-router-dom";

const Sidebar = ({ currentPage, setCurrentTab }) => {
    const [ friends, setFriends ] = useState([]);
    const { currentUser } = useContext(UserContext);
    const friendsUsernames = currentUser.friends.map((f) =>
        f.user_from === currentUser.username ? f.user_to : f.user_from
    );
    const [currentTab, setCurrentTab] = useState(null);

    useEffect(() => {
        const fetchFriends = async () => {
            try {pp
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
    }, [ currentUser.username ]);

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
