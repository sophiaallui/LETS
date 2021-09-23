import React,{ useContext } from "react";
import UserContext from "UserContext";

// reactstrap components
import { Button, Card, Row, Col } from "reactstrap";


function ProfileCard(props) {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  console.debug("ProfileCard", "props=", props, "currentUser=", currentUser);
  return (
    <>
      <Card className="card-profile shadow mt--300">
        <div className="px-4">
          <Row className="justify-content-center">
            <Col className="order-lg-2" lg="3">
              <div className="card-profile-image">
                <a href="#pablo" onClick={(e) => e.preventDefault()}>
                  <img
                    alt="..."
                    className="rounded-circle"
                    src={require("assets/img/faces/team-4.jpg")}
                  ></img>
                </a>
              </div>
            </Col>
            <Col
              className="order-lg-3 text-lg-right align-self-lg-center"
              lg="4"
            >
              <div className="card-profile-actions py-4 mt-lg-0">
                <Button
                  className="mr-4"
                  color="info"
                  onClick={(e) => e.preventDefault()}
                  size="sm"
                >
                  Connect
                </Button>
                <Button
                  className="float-right"
                  color="default"
                  onClick={(e) => e.preventDefault()}
                  size="sm"
                >
                  Message
                </Button>
              </div>
            </Col>
            
            <Col className="order-lg-1" lg="4">
              <div className="card-profile-stats d-flex justify-content-center">
                <div>
                  <span className="heading">{currentUser.posts.length}</span>
                  <span className="description">Posts</span>
                </div>

                <div>
                  <span className="heading">{currentUser.measurements.length}</span>
                  <span className="description">Measurements</span>
                </div>
                
                <div>
                  <span className="heading">89</span>
                  <span className="description">Comments</span>
                </div>
              </div>
            </Col>
          </Row>
          
          <div className="text-center mt-5">
            <h3>
              {currentUser.firstName} {currentUser.lastName}
              <span className="font-weight-light">, {currentUser.age || null }</span>
            </h3>
            
            <div className="h6 font-weight-300">
              <i className="ni location_pin mr-2"></i>
              Bucharest, Romania
            </div>

            <div>
              <i className="ni education_hat mr-2"></i>
              University of Computer Science
            </div>
          </div>

          <div className="mt-5 py-5 border-top text-center">
            <Row className="justify-content-center">
              <Col lg="9">

              </Col>
            </Row>
          </div>
        </div>
      </Card>
    </>
  );
}

export default ProfileCard;
