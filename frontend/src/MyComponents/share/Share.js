import React, { useState, useRef, useContext } from "react";
import {
  PermMedia,
  Label,
  Room,
  EmojiEmotions,
  Cancel,
} from "@material-ui/icons";
import UserContext from "UserContext";
import "./share.css";
import Api from "api/api";
import { Modal, Button, FormGroup, Input, ButtonGroup, Row, Col } from "reactstrap";
import NotificationAlert from "react-notification-alert";
import "react-notification-alert/dist/animate.css";

import NewGoalFormModal from "MyComponents/NewGoalFormModal";

const Share = () => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const {
    currentUser,
    currentUserProfileImage,
    setCurrentUserProfileImage,
    setCurrentUserCoverPic,
    currentUserCoverPic,
  } = useContext(UserContext);
  const desc = useRef();
  const notify = useRef();

  const [profilePic, setPofilePic] = useState(null);
  const [postImage, setPostImage] = useState(null);
  const [coverPic, setCoverPic] = useState(null);
  const [showModal, setShowModal] = useState(false);
    const options = {
    place : "tr",
    message : (
      <div>
        <span className="alert-title" data-notify="title">Notification </span>
        <span data-notify="message">
          Added new goal
        </span>
      </div>
    ),
    type : "success",
    icon : "ni ni-bell-55",
    autoDismiss : 5
  };
  
  const showNotifications = () => {
    notify.current.notificationAlert(options)
  };

  const handleProfileImageSubmit = async (e) => {
    if (profilePic) {
      const data = new FormData();
      const filename = Date.now() + profilePic.name;
      data.append("name", filename);
      data.append("file", profilePic);
      try {
        if (currentUserProfileImage)
          await Api.request(
            `api/images/${currentUserProfileImage}/${currentUser.username}`,
            {},
            "DELETE"
          ); // if they already have a profileImage delete it first
        await Api.request(`api/images`, data, "POST");
        await Api.updateUser(currentUser?.username, { profileImage: filename });
        setCurrentUserProfileImage(filename);
        setPofilePic(null);
      } catch (e) {}
    }
  };

  const handleCoverPictureSubmit = async () => {
    if (coverPic) {
      const data = new FormData();
      const filename = Date.now() + coverPic.name;
      data.append("name", filename);
      data.append("file", coverPic);
      try {
        if (currentUserCoverPic)
          await Api.request(
            `api/images/${currentUserCoverPic}/${currentUser.username}`,
            {},
            "DELETE"
          );
        await Api.request(`api/images`, data, "POST");
        await Api.updateUser(currentUser?.username, { coverPicture: filename });
        setCurrentUserCoverPic(filename);
        setCoverPic(null);
      } catch (e) {}
    }
  };
  const handleNewPostSubmit = async (e) => {
    const newPost = {
      postedBy: currentUser.username,
      content: desc.current.value,
    };
    if (postImage) {
      const data = new FormData();
      const filename = Date.now() + postImage.name;
      data.append("name", filename);
      data.append("file", postImage);
      newPost.image = filename;
      console.log(newPost);
      try {
        await Api.request(`api/images`, data, "POST");
      } catch (e) {}
    }
    try {
      await Api.createPost(currentUser.username, newPost, "POST");
      window.location.reload();
    } catch (e) {}
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (postImage) {
      try {
        await handleNewPostSubmit();
      } catch (e) {}
    } else if (profilePic) {
      try {
        await handleProfileImageSubmit();
      } catch (e) {}
    } else if (coverPic) {
      await handleCoverPictureSubmit();
    }
  };


  return (
    <div className="share">
    <NotificationAlert ref={notify} zIndex={1031} onClick={() => console.log("hey")} />

      <div className="shareWrapper">
        <div className="shareTop">
          <img
            className="shareProfileImg"
            src={
              currentUserProfileImage
                ? PF + currentUserProfileImage
                : require("assets/img/placeholder.jpg")
            }
            alt=""
          />
          <input
            placeholder={"What's in your mind " + currentUser.username + "?"}
            className="shareInput"
            ref={desc}
          />
        </div>
        <hr className="shareHr" />
        {profilePic && (
          <div className="shareImgContainer">
            <img
              className="shareImg"
              src={URL.createObjectURL(profilePic)}
              alt=""
            />
            <Cancel
              className="shareCancelImg"
              onClick={() => setPofilePic(null)}
            />
          </div>
        )}
        {postImage && (
          <div className="shareImgContainer">
            <img
              className="shareImg"
              src={URL.createObjectURL(postImage)}
              alt=""
            />
            <Cancel
              className="shareCancelImg"
              onClick={() => setPostImage(null)}
            />
          </div>
        )}
        {coverPic && (
          <div className="shareImgContainer">
            <img
              className="shareImg"
              src={URL.createObjectURL(coverPic)}
              alt=""
            />
            <Cancel
              className="shareCancelImg"
              onClick={() => setCoverPic(null)}
            />
          </div>
        )}
        <form className="shareBottom" onSubmit={handleSubmit}>
          <div className="shareOptions">
            <label htmlFor="profilePic" className="shareOption">
              <PermMedia htmlColor="tomato" className="shareIcon" />
              <span className="shareOptionText">Profile Photo</span>
              <input
                style={{ display: "none" }}
                type="file"
                id="profilePic"
                accept=".png,.jpeg,.jpg"
                onChange={(e) => setPofilePic(e.target.files[0])}
              />
            </label>

            <label htmlFor="coverPic" className="shareOption">
              <PermMedia htmlColor="tomato" className="shareIcon" />
              <span className="shareOptionText">Cover Photo</span>
              <input
                style={{ display: "none" }}
                type="file"
                id="coverPic"
                accept=".png,.jpeg,.jpg"
                onChange={(e) => setCoverPic(e.target.files[0])}
              />
            </label>

            <label htmlFor="postImage" className="shareOption">
              <Label htmlColor="blue" className="shareIcon" />
              <span className="shareOptionText">Post</span>
              <input
                style={{ display: "none" }}
                type="file"
                id="postImage"
                accept=".png,.jpeg,.jpg"
                onChange={(e) => setPostImage(e.target.files[0])}
              />
            </label>

            <div className="shareOption">
              <Room htmlColor="green" className="shareIcon" />
              <span className="shareOptionText" onClick={() => setShowModal(true)}>Goals</span>
              <NewGoalFormModal 
                showModal={showModal} 
                setShowModal={setShowModal} 
                options={options} 
                showNotifications={showNotifications} 
              />
      
            </div>
            <div className="shareOption">
              <EmojiEmotions htmlColor="goldenrod" className="shareIcon" />
              <span className="shareOptionText">Feelings</span>
            </div>
          </div>
          <button className="shareButton" type="submit">
            Share
          </button>
        </form>

      </div>
    </div>
  );
};

export default Share;
