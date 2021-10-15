import React, { useState, useRef, useContext } from "react";
// used for making the prop types of this component
import PropTypes from "prop-types";

import { Button } from "reactstrap";
import UserContext from "UserContext";

import defaultImage from "assets/img/image_placeholder.jpg";
import defaultAvatar from "assets/img/placeholder.jpg";
import Api from "api/api";

const ImageUpload = (props) => {
  const { currentUser } = useContext(UserContext);
  const [file, setFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(props.avatar ? defaultAvatar : defaultImage);
  const fileInput = useRef();

  const handleImageChange = e => {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    reader.onloadend = () => {
      setFile(file);
      setImagePreviewUrl(reader.result)
    }
    reader.readAsDataURL(file);
    props.setFile(file)
  }

  const handleClick = () => {
    fileInput.current.click();
  }

  const handleSubmit = e => {
    e.preventDefault();
    console.log(file, imagePreviewUrl)
  }

  const handleRemove = () => {
    setFile(null);
    setImagePreviewUrl(props.avatar ? defaultAvatar : defaultImage);
    props.setFile(null);
    fileInput.current.value = null;
  }
  return (
      <div className="fileinput text-center">
        <input type="file" onChange={handleImageChange} ref={fileInput} />
        <div className={"thumbnail" + (props.avatar ? " img-circle" : "")}>
          <img src={imagePreviewUrl} alt="..." className="rounded-circle" />
        </div>
        <div>
          {file === null ? (
            <Button
              color={props.addBtnColor}
              className={props.addBtnClasses}
              onClick={() => handleClick()}
              size="sm"
            >
              {props.avatar ? "Add Photo" : "Select image"}
            </Button>
          ) : (
            <span>
              <Button
                color={props.changeBtnColor}
                className={props.changeBtnClasses}
                onClick={() => handleClick()}
                size="sm"
              >
                Change
              </Button>
              {props.avatar ? <br /> : null}
              <Button
                color={props.removeBtnColor}
                className={props.removeBtnClasses}
                onClick={() => handleRemove()}
                size="sm"
              >
                <i className="fa fa-times" /> Remove
              </Button>
            </span>
          )}
        </div>
      </div>
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


export default ImageUpload;
