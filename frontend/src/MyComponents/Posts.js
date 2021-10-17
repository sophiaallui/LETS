import React, { useContext, useState, useEffect } from "react";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Form,
  Input,
  Media,
  Row,
  Col,
  UncontrolledTooltip,
} from "reactstrap";
import { Link } from "react-router-dom";
import UserContext from "UserContext";
import Api from "api/api";
/**
 * post = { id, postedBy, createdAt, content, createdAt }
 */

import { format } from "timeago.js";

function Post({ post, profileImage, friendsUsernames }) {
  const { currentUser } = useContext(UserContext);
  const [comments, setComments] = useState(post?.comments);
  const [comment, setComment] = useState("");
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const newComm = { content: comment };
    try {
      const newComment = await Api.createComment(
        post.id,
        currentUser.username,
        newComm
      );
      setComments((prev) => [...prev, newComment]);
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <>
      <Card>
        <CardHeader className="d-flex align-items-center">
          <div className="d-flex align-items-center">
            <a onClick={(e) => e.preventDefault()}>
              <img
                alt="..."
                className="avatar"
                src={
                  profileImage
                    ? PF + profileImage
                    : require("assets/img/placeholder.jpg")
                }
              />
            </a>
            <div className="mx-3">
              <a
                className="text-dark font-weight-600 text-sm"
                onClick={(e) => e.preventDefault()}
              >
                {post?.postedBy}
              </a>
              <small className="d-block text-muted">
                {format(post.createdAt)}
              </small>
            </div>
          </div>

          <div className="text-right ml-auto">
            {currentUser.username !== post?.postedBy &&
              !friendsUsernames.includes(post?.postedBy) && (
                <Button
                  className="btn-icon"
                  color="primary"
                  size="sm"
                  type="button"
                >
                  <span className="btn-inner--icon icon-big">
                    <i className="ni ni-fat-add">Add Friend</i>
                  </span>
                </Button>
              )}
            {currentUser.username === post?.postedBy && (
              <Button
                className="btn-icon"
                color="danger"
                size="sm"
                type="button"
              >
                <span className="btn-inner-icon icon-big">
                  <i className="fas fa-trash"></i>
                  <span className="btn-inner--text">Delete</span>
                </span>
              </Button>
            )}
          </div>
        </CardHeader>

        <CardBody>
          <p className="mb-4">{post.content}</p>
          <img
            alt="..."
            className="img-fluid rounded"
            src={
              post.image
                ? PF + post.image
                : require("assets/img/sections/mohamed.jpg")
            }
          />

          <Row className="align-items-center my-3 pb-3 border-bottom">
            <Col sm="6">
              <div className="icon-actions">
                <a className="like active" onClick={(e) => e.preventDefault()}>
                  <i className="ni ni-like-2"></i>
                  <span className="text-muted">150</span>
                </a>
                <a onClick={(e) => e.preventDefault()}>
                  <i className="ni ni-chat-round"></i>
                  <span className="text-muted">{comments.length}</span>
                </a>
                <a onClick={(e) => e.preventDefault()}>
                  <i className="ni ni-curved-next"></i>
                  <span className="text-muted">12</span>
                </a>
              </div>
            </Col>

            <Col className="d-none d-sm-block" sm="6">
              <div className="d-flex align-items-center justify-content-sm-end">
                <div className="avatar-group">
                  <a
                    className="avatar avatar-xs rounded-circle"
                    onClick={(e) => e.preventDefault()}
                    id="tooltip777026221"
                  >
                    <img
                      alt="..."
                      src={require("assets/img/faces/team-1.jpg")}
                    ></img>
                  </a>
                  <UncontrolledTooltip delay={0} target="tooltip777026221">
                    Jessica Rowland
                  </UncontrolledTooltip>
                  <a
                    className="avatar avatar-xs rounded-circle"
                    onClick={(e) => e.preventDefault()}
                    id="tooltip386481262"
                  >
                    <img
                      alt="..."
                      className="rounded-circle"
                      src={require("assets/img/faces/team-2.jpg")}
                    ></img>
                  </a>
                  <UncontrolledTooltip delay={0} target="tooltip386481262">
                    Audrey Love
                  </UncontrolledTooltip>
                  <a
                    className="avatar avatar-xs rounded-circle"
                    onClick={(e) => e.preventDefault()}
                    id="tooltip508888926"
                  >
                    <img
                      alt="..."
                      className="rounded-circle"
                      src={require("assets/img/faces/team-3.jpg")}
                    ></img>
                  </a>
                  <UncontrolledTooltip delay={0} target="tooltip508888926">
                    Michael Lewis
                  </UncontrolledTooltip>
                </div>
                <small className="pl-2 font-weight-bold">and 30+ more</small>
              </div>
            </Col>
          </Row>

          {/* Comments SECTION */}
          <div className="mb-1">
            {comments.map((c) => (
              <Media className="media-comment">
                <Link to={`/profile/${c.postedBy}`}>
                  <img
                    alt="..."
                    className="media-comment-avatar rounded-circle"
                    src={
                      c.commentorProfileImage
                        ? PF + c.commentorProfileImage
                        : require("assets/img/faces/team-1.jpg")
                    }
                  />
                </Link>

                <Media>
                  <div className="media-comment-text">
                    <h6 className="h5 mt-0">{c.postedBy}</h6>
                    <p className="text-sm lh-160">{c.content}</p>
                    <div className="icon-actions">
                      <small className="d-block text-muted">
                        {format(c.createdAt)}
                      </small>
                    </div>
                  </div>
                </Media>
              </Media>
            ))}

            <Media className="align-items-center mt-5">
              <img
                alt="..."
                className="avatar avatar-lg rounded-circle mb-4"
                src={
                  currentUser.profileImage
                    ? PF + currentUser.profileImage
                    : require("assets/img/faces/team-3.jpg")
                }
              />
              <Media body>
                <Form onSubmit={handleCommentSubmit}>
                  <Input
                    placeholder="Write your comment"
                    rows="1"
                    type="textarea"
                    onChange={(e) => setComment(e.target.value)}
                    value={comment}
                  />
                  <Button>comment</Button>
                </Form>
              </Media>
            </Media>
          </div>
        </CardBody>
      </Card>
    </>
  );
}

export default Post;
