import React, { useState } from "react";
import {
  Button
} from "reactstrap";
import Api from "api/api";
import UserContext from "UserContext";

const SendFriendRequestButton = ({ targetUsername, setFriendRequest, buttonText, alreadySent }) => {
  const { currentUser } = React.useContext(UserContext);
  const [errors, setErrors] = useState(null);
  const handleClick = async e => {
    e.preventDefault();
    try {
      const { username } = currentUser
      const friendRequest = await Api.sendFriendRequest(username, targetUsername);
      setFriendRequest(friendRequest)
    }
    catch (e) {
      console.error("SendFriendRequestButton Error:", e);
      setErrors(e);
    }
  }
  if(alreadySent) return <Button className="btn-round" disabled>Sent Friend Request</Button>
  return (
    <>
      {errors ? <Button className="btn-round" disabled>Sent Friend Request</Button> : <Button className="btn-round" onClick={handleClick}>{buttonText || "Send Friend Request"}</Button>}
    </>
  )
}

export default SendFriendRequestButton;