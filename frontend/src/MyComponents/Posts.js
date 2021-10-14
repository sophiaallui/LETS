import React, { useContext } from "react";

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

/**
 * post = { id, postedBy, createdAt, content, createdAt }
 */

import { format } from "timeago.js";

function Post({ type, post }) {
  const { currentUser } = useContext(UserContext);
  return (
    <>
      <Card>
        <CardHeader className="d-flex align-items-center">
          <div className="d-flex align-items-center">
            <a onClick={(e) => e.preventDefault()}>
              <img
                alt="..."
                className="avatar"
                src={require("assets/img/faces/team-1.jpg")}
              ></img>
            </a>
            <div className="mx-3">
              <a
                className="text-dark font-weight-600 text-sm"
                onClick={(e) => e.preventDefault()}
              >
                {post?.postedBy}
              </a>
              <small className="d-block text-muted">{format(post.createdAt)}</small>
            </div>
          </div>


          <div className="text-right ml-auto">
            {currentUser.username !== post?.postedBy ?
              <Button
                className="btn-icon"
                color="primary"
                size="sm"
                type="button"
              >
                <span className="btn-inner--icon icon-big">
                  <i className="ni ni-fat-add"></i>
                </span>
                <span className="btn-inner--text">Add Friend</span>
              </Button> :
              <Button className="btn-icon" color="danger" size="sm" type="button">
                <span className="btn-inner-icon icon-big">
                  <i className="fas fa-trash"></i>
                  <span className="btn-inner--text">Delete</span>
                </span>
              </Button>
            }
          </div>
        </CardHeader>

        <CardBody>
          <p className="mb-4">
            {post.content}
          </p>
          <img
            alt="..."
            className="img-fluid rounded"
            src={require("assets/img/sections/mohamed.jpg")}
          ></img>
          <Row className="align-items-center my-3 pb-3 border-bottom">
            <Col sm="6">
              <div className="icon-actions">
                <a
                  className="like active"
                  onClick={(e) => e.preventDefault()}
                >
                  <i className="ni ni-like-2"></i>
                  <span className="text-muted">150</span>
                </a>
                <a onClick={(e) => e.preventDefault()}>
                  <i className="ni ni-chat-round"></i>
                  <span className="text-muted">36</span>
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
            <Media className="media-comment">
              <img
                alt="..."
                className="media-comment-avatar rounded-circle"
                src={require("assets/img/faces/team-1.jpg")}
              ></img>

              <Media>
                <div className="media-comment-text">
                  <h6 className="h5 mt-0">Michael Lewis</h6>
                  <p className="text-sm lh-160">
                    You have the opportunity to play this game of life you need
                    to appreciate every moment. A lot of people don’t appreciate
                    the moment until it’s passed.
                  </p>
                  <div className="icon-actions">
                    <a
                      className="like active"
                      onClick={(e) => e.preventDefault()}
                    >
                      <i className="ni ni-like-2"></i>
                      <span className="text-muted">3 likes</span>
                    </a>
        
                  </div>
                </div>
              </Media>
            </Media>

            <Media className="media-comment">
              <img
                alt="..."
                className="media-comment-avatar rounded-circle"
                src={require("assets/img/faces/team-2.jpg")}
              ></img>
              <Media>
                <div className="media-comment-text">
                  <h6 className="h5 mt-0">Jessica Stones</h6>
                  <p className="text-sm lh-160">
                    I always felt like I could do anything. That’s the main
                    thing people are controlled by! Thoughts- their perception
                    of themselves! They're slowed down.
                  </p>
                  <div className="icon-actions">
                    <a
                      className="like active"

                      onClick={(e) => e.preventDefault()}
                    >
                      <i className="ni ni-like-2"></i>
                      <span className="text-muted">10 likes</span>
                    </a>
                    <a onClick={(e) => e.preventDefault()}>
                      <i className="ni ni-curved-next"></i>
                      <span className="text-muted">1 share</span>
                    </a>
                  </div>
                </div>
              </Media>
            </Media>
            <Media className="align-items-center mt-5">
              <img
                alt="..."
                className="avatar avatar-lg rounded-circle mb-4"
                src={require("assets/img/faces/team-3.jpg")}
              ></img>
              <Media body>
                <Form>
                  <Input
                    placeholder="Write your comment"
                    rows="1"
                    type="textarea"
                  ></Input>
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
