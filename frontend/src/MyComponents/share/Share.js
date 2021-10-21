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

const Share = () => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { currentUser } = useContext(UserContext);
  const desc = useRef();
  const [file, setFile] = useState(null);

  const handleProfileImageSubmit = async (e) => {
    e.preventDefault();
    if (file) {
      const data = new FormData();
      const filename = Date.now() + file.name;
      data.append("name", filename);
      data.append("file", file);
      try {
        await Api.request(`api/images`, data, "POST");
        await Api.updateUser(
          currentUser?.username,
          { profileImage: filename },
          "PUT"
        );
      } catch (e) {
        console.error(e);
      }
    }
    window.location.reload();
  };

  const handleNewPostSubmit = async e => {
    const newPost = {
      postedBy : currentUser.username,
      content : desc.current.value
    }
    e.preventDefault();
    if(file) {
      const data = new FormData();
      const filename = Date.now() + file.name;
      data.append("name", filename);
      data.append("file", file)
      newPost.image = filename;
      console.log(newPost)
      try {
        await Api.request(`api/images`, data, "POST")
      } catch(e) {}
    }
    try { 
      await Api.createPost(currentUser.username, newPost, "POST");
      window.location.reload();
    } catch(e) {}
  }

  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <img
            className="shareProfileImg"
            src={
              currentUser.profileImage
                ? PF + currentUser.profileImage
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
        {file && (
          <div className="shareImgContainer">
            <img className="shareImg" src={URL.createObjectURL(file)} alt="" />
            <Cancel className="shareCancelImg" onClick={() => setFile(null)} />
          </div>
        )}
        <form className="shareBottom" onSubmit={(e) => e.preventDefault()}>
          <div className="shareOptions">
            <label htmlFor="file" className="shareOption">
              <PermMedia htmlColor="tomato" className="shareIcon" />
              <span className="shareOptionText">Profile Photo</span>
              <input
                style={{ display: "none" }}
                type="file"
                id="file"
                accept=".png,.jpeg,.jpg"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
            
            <label htmlFor="file" className="shareOption">
              <Label htmlColor="blue" className="shareIcon" />
              <span className="shareOptionText">Post</span>
              <input
                style={{ display: "none" }}
                type="file"
                id="file"
                accept=".png,.jpeg,.jpg"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
            
            <div className="shareOption">
              <Room htmlColor="green" className="shareIcon" />
              <span className="shareOptionText">Goals</span>
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
