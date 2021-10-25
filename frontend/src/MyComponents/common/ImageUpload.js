import React, { useState, useRef, useContext, useEffect } from "react";
// used for making the prop types of this component
import PropTypes from "prop-types";

import { Button } from "reactstrap";
import UserContext from "UserContext";

import defaultImage from "assets/img/image_placeholder.jpg";
import defaultAvatar from "assets/img/placeholder.jpg";
import Api from "api/api";


const ImageUpload = (props) => {
  const { currentUserProfileImage, setCurrentUserProfileImage, currentUser } = useContext(UserContext);
  const [file, setFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(props.avatar ? defaultAvatar : defaultImage);
  const fileInput = useRef();
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  useEffect(() => {
    console.log("imagePreviewUrl", imagePreviewUrl)
  }, [imagePreviewUrl])

  const handleImageChange = e => {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    reader.onloadend = () => {
      setFile(file);
      setImagePreviewUrl(reader.result)
    }
    reader.readAsDataURL(file);
  }

  const handleClick = () => {
    fileInput.current.click();
  }

  const handleSubmit = async e => {
    e.preventDefault();
    if(file) {
      const data = new FormData();
      const filename = Date.now() + file.name;
      data.append("name", filename);
      data.append("file", file);
      try {
        if(currentUserProfileImage) {
          await Api.request(`api/images/${currentUserProfileImage}/${currentUser.username}`, {}, "DELETE");
        }
        await Api.request(`api/images`, data, "POST");
        await Api.updateUser(currentUser.username, { profileImage : filename });
        setCurrentUserProfileImage(filename);
        setImagePreviewUrl(null);
        setFile(null);
      } catch(e) {}
    }
  }

  const handleRemove = () => {
    setFile(null);
    setImagePreviewUrl(props.avatar ? defaultAvatar : defaultImage);
    fileInput.current.value = null;
  }
  return (
    <form onSubmit={handleSubmit}>
    <div className="fileinput text-center">
      <input type="file" onChange={handleImageChange} ref={fileInput} />
      <div className={"thumbnail" + (props.avatar ? " img-circle" : "")}>
        <img src={currentUserProfileImage ? PF + currentUserProfileImage :  imagePreviewUrl} alt="..." />
      </div>
      <div>
        {file === null ? (
          <Button
            color={props.addBtnColor}
            className={props.addBtnClasses}
            onClick={() => handleClick()}
          >
            {props.avatar ? "Add Photo" : "Select image"}
          </Button>
        ) : (
          <span>
            <Button
              color={props.changeBtnColor}
              className={props.changeBtnClasses}
              onClick={() => handleClick()}
            >
              Change
            </Button>
            {props.avatar ? <br /> : null}
            <Button
              color={props.removeBtnColor}
              className={props.removeBtnClasses}
              onClick={() => handleRemove()}
            >
              <i className="fa fa-times" /> Remove
            </Button>
            <Button color={props.changeBtnColor} className={props.changeBtnClasses} onClick={handleSubmit}>
              Submit
            </Button>
          </span>
        )}
      </div>
    </div>
  </form>
  )
}


ImageUpload.defaultProps = {
  avatar: false,
  removeBtnClasses: "btn-round",
  removeBtnColor: "danger",
  addBtnClasses: "btn-round",
  addBtnColor: "file",
  changeBtnClasses: "btn-round",
  changeBtnColor: "file",
};

ImageUpload.propTypes = {
  avatar: PropTypes.bool,
  removeBtnClasses: PropTypes.string,
  removeBtnColor: PropTypes.oneOf([
    "default",
    "primary",
    "secondary",
    "success",
    "info",
    "warning",
    "danger",
    "link",
    "file",
  ]),
  addBtnClasses: PropTypes.string,
  addBtnColor: PropTypes.oneOf([
    "default",
    "primary",
    "secondary",
    "success",
    "info",
    "warning",
    "danger",
    "link",
    "file",
  ]),
  changeBtnClasses: PropTypes.string,
  changeBtnColor: PropTypes.oneOf([
    "default",
    "primary",
    "secondary",
    "success",
    "info",
    "warning",
    "danger",
    "link",
    "file",
  ]),
};


export default ImageUpload;
