import React from "react";
import {
  Button
} from "reactstrap";
import Api from "api/api";
import UserContext from "UserContext";

const SendFriendRequestButton = ({ targetUsername, setFriendRequest, buttonText }) => {
  const { currentUser } = React.useContext(UserContext);
  const handleClick = async e => {
    e.preventDefault();
    try {
      const { username } = currentUser
      const friendRequest = await Api.sendFriendRequest(username, targetUsername);
      setFriendRequest(friendRequest)
    } 
    catch(e) {
      console.error("SendFriendRequestButton Error:", e);
    }
  }
  return (
    <Button onClick={handleClick}>{buttonText || "Send Friend Request"}</Button>
  )
}

export default SendFriendRequestButton;