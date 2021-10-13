import React from "react";

// reactstrap components
import { Button, Card, CardHeader, CardBody, Row } from "reactstrap";
import { Link  } from "react-router-dom"; 

function FriendCard({ user }) {
  return (
    <>
      <Card className="card-profile">
        <CardHeader
          className="bg-info"
          style={{
            backgroundImage: "url(" + require("assets/img/ill/inn.svg") + ")",
          }}
        >
          <div className="card-avatar">
            <a onClick={(e) => e.preventDefault()} tag={Link} to={`profile/${user.username}`}>
              <img
                alt="..."
                className="img img-raised rounded-circle"
                src={
                  user.profileImage ?
                  require("assets/img/faces/team-4.jpg") :
                  require("assets/img/placeholder.jpg")
                }
              />
            </a>
          </div>
        </CardHeader>
        <CardBody className="pt-0">
          <div className="d-flex justify-content-between">
            <Button
              className="mr-4 mt-3"
              color="info"
              onClick={(e) => e.preventDefault()}
              size="sm"
            >
              Connect
            </Button>
            <Button
              className="float-right mt-3"
              color="default"
              onClick={(e) => e.preventDefault()}
              size="sm"
            >
              Message
            </Button>
          </div>
          <Row>
            <div className="col">
              <div className="card-profile-stats d-flex justify-content-center">
                <div>
                  <span className="heading">{user.friends.length}</span>
                  <span className="description">Friends</span>
                </div>
                <div>
                  <span className="heading">{user.posts.length}</span>
                  <span className="description">Posts</span>
                </div>
              </div>
            </div>
          </Row>
          <div className="text-center">
            <h5 className="h4">
              {user.firstName} {user.lastName}
              <span className="font-weight-light">, {user.email}</span>
            </h5>
          </div>
        </CardBody>
      </Card>
    </>
  );
}

export default FriendCard;
