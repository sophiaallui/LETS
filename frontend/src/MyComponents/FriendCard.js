import React from "react";

// reactstrap components
import { Button, Card, CardHeader, CardBody, Row } from "reactstrap";
import { Link } from "react-router-dom";

function FriendCard({ user, type, handleConfirm, handleCancelFriendRequest }) {
  const PF = process.env.REACT_APP_PF;
  let button;
  if (type === "pending") {
    button = (
      <div className="d-flex justify-content-between">
        <Button className="mr-4 mt-3 btn-round" block color="danger" size="sm">Delete</Button>
        <Button
          className="float-right mt-3 btn-round"
          color="info"
          size="sm"
          block
          onClick={handleConfirm}
        >
          Confirm
        </Button> 
      </div>
    )
  } else {
    button = (
      <>
        <Button onClick={handleCancelFriendRequest} className="mr-4 mt-3 btn-rounded" block color="danger" size="md">Delete</Button>
      </>
    )
  }
  return (
    <>
      <Card className="card-profile card-frame">
        <CardHeader
          className="bg-info"
          style={{
            backgroundImage: "url(" + require("assets/img/ill/inn.svg") + ")",
          }}
        >
          <div className="card-avatar">
            <Link to={`profile/${user.username}`}>
              <img
                alt="..."
                className="img img-raised rounded-circle"
                src={
                  user.profileImage ?
                    PF + user.profileImage :
                    require("assets/img/placeholder.jpg")
                }
              />
            </Link>
          </div>
        </CardHeader>
        <CardBody className="pt-0">
          <div className="d-flex justify-content-between">
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
            {button}
          </div>
        </CardBody>
      </Card>
    </>
  );
}

export default FriendCard;
