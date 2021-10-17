import React from "react";
import {  Media } from "reactstrap";
import { Link } from "react-router-dom";
import { format} from "timeago.js"
const Comment = ({ comment }) => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  return (
    <Media className="media-comment">
      <Link to={`/profile/${comment.postedBy}`}>
        <img
          alt="..."
          className="media-comment-avatar rounded-circle"
          src={
            comment.commentorProfileImage
              ? PF + comment.commentorProfileImage
              : require("assets/img/faces/team-1.jpg")
          }
        />
      </Link>

      <Media>
        <div className="media-comment-text">
          <h6 className="h5 mt-0">{comment.postedBy}</h6>
          <p className="text-sm lh-160">{comment.content}</p>
          <div className="icon-actions">
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