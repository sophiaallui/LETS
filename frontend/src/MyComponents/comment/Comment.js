import React from "react";
import { Media } from "reactstrap";
import { Link } from "react-router-dom";
import { format } from "timeago.js"
const Comment = ({ comment }) => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  return (
    <Media className="media-comment">
      <Link to={`/profile/${comment.postedBy}`}>
        <img
          alt="..."
          className="avatar avatar-lg rounded-circle"
          src={
            comment.commentorProfileImage
              ? PF + comment.commentorProfileImage
              : require("assets/img/placeholder.jpg")
          }
        />
      </Link>
      <Media>
        <div className="media-comment-text">
          <h6 className="h5 mt-0">{comment.postedBy}</h6>
          <p className="text-sm lh-160">{comment.content}</p>
          <div className="icon-actions">
            <a
              className="like active"
              href="#"
              onClick={(e) => e.preventDefault()}
            >
              <i className="ni ni-like-2"></i>
              <span className="text-muted">10 likes</span>
            </a>
            <small className="d-block text-muted">
              {format(comment.createdAt)}
            </small>
          </div>
        </div>
      </Media>
    </Media>
  );
};

export default Comment;