import React, { useEffect, useState } from "react";
import Api from "api/api";
import {
  Card,
  CardHeader,
  CardBody,
  ListGroup,
  ListGroupItem,
  Col,
  Row,
  Button
} from "reactstrap";
import { Link } from "react-router-dom";

const OnlineFriends = ({ friendsUsernames }) => {
  const [friends, setFriends] = useState(null)
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const allPromise = Promise.all(friendsUsernames.map(uName => Api.getCurrentUser(uName)));
        const usersArray = await allPromise;
        setFriends(usersArray)
      } catch(e) {
        console.error(e)
      }
    }
    if(friendsUsernames.length > 0) {
      fetchFriends()  
    }
  }, [friendsUsernames])
  return (
    <Card>
      <CardHeader>
        <h5 className="h3 mb-0">Friends</h5>
      </CardHeader>

      <CardBody>
        <ListGroup className="list my--3" flush>
          {friends?.map(f => (
              <ListGroupItem className="px-0">  
              <Row className="align-items-center">
                <Col className="col-auto">
                  <a
                    className="avatar rounded-circle"
                    href="#pablo"
                    onClick={(e) => e.preventDefault()}
                    tag={Link}
                    to={`profile/${f.username}`}
                  >
                    <img
                      alt="..."
                      src={require("assets/img/placeholder.jpg")}
                    />
                  </a>
                </Col>
                <div className="col ml--2">
                  <h4 className="mb-0">
                    <a href="#pablo" onClick={(e) => e.preventDefault()}>
                      John Michael
                    </a>
                  </h4>
                  <span className="text-success">●</span>{" "}
                  <small>Online</small>
                </div>
                <Col className="col-auto">
                  <Button color="primary" size="sm" type="button">
                    Add
                  </Button>
                </Col>
              </Row>
            </ListGroupItem>
          ))}
          <ListGroupItem className="px-0">  
            <Row className="align-items-center">
              <Col className="col-auto">
                <a
                  className="avatar rounded-circle"
                  href="#pablo"
                  onClick={(e) => e.preventDefault()}
                >
                  <img
                    alt="..."
                    src={require("assets/img/placeholder.jpg")}
                  />
                </a>
              </Col>
              <div className="col ml--2">
                <h4 className="mb-0">
                  <a href="#pablo" onClick={(e) => e.preventDefault()}>
                    John Michael
                  </a>
                </h4>
                <span className="text-success">●</span>{" "}
                <small>Online</small>
              </div>
              <Col className="col-auto">
                <Button color="primary" size="sm" type="button">
                  Add
                </Button>
              </Col>
            </Row>
          </ListGroupItem>
          
          <ListGroupItem className="px-0">
            <Row className="align-items-center">
              <Col className="col-auto">
                <a
                  className="avatar rounded-circle"
                  href="#pablo"
                  onClick={(e) => e.preventDefault()}
                >
                  <img
                    alt="..."
                    src={require("assets/img/placeholder.jpg")}
                  />
                </a>
              </Col>
              <div className="col ml--2">
                <h4 className="mb-0">
                  <a href="#pablo" onClick={(e) => e.preventDefault()}>
                    Alex Smith
                  </a>
                </h4>
                <span className="text-warning">●</span>{" "}
                <small>In a meeting</small>
              </div>
              <Col className="col-auto">
                <Button color="primary" size="sm" type="button">
                  Add
                </Button>
              </Col>
            </Row>
          </ListGroupItem>
          <ListGroupItem className="px-0">
            <Row className="align-items-center">
              <Col className="col-auto">
                <a
                  className="avatar rounded-circle"
                  href="#pablo"
                  onClick={(e) => e.preventDefault()}
                >
                  <img
                    alt="..."
                    src={require("assets/img/placeholder.jpg")}
                  />
                </a>
              </Col>
              <div className="col ml--2">
                <h4 className="mb-0">
                  <a href="#pablo" onClick={(e) => e.preventDefault()}>
                    Samantha Ivy
                  </a>
                </h4>
                <span className="text-danger">●</span>{" "}
                <small>Offline</small>
              </div>
              <Col className="col-auto">
                <Button color="primary" size="sm" type="button">
                  Add
                </Button>
              </Col>
            </Row>
          </ListGroupItem>
          <ListGroupItem className="px-0">
            <Row className="align-items-center">
              <Col className="col-auto">
                <a
                  className="avatar rounded-circle"
                  href="#pablo"
                  onClick={(e) => e.preventDefault()}
                >
                  <img
                    alt="..."
                    src={require("assets/img/placeholder.jpg")}
                  />
                </a>
              </Col>
              <div className="col ml--2">
                <h4 className="mb-0">
                  <a href="#pablo" onClick={(e) => e.preventDefault()}>
                    John Michael
                  </a>
                </h4>
                <span className="text-success">●</span>{" "}
                <small>Online</small>
              </div>
              <Col className="col-auto">
                <Button color="primary" size="sm" type="button">
                  Add
                </Button>
              </Col>
            </Row>
          </ListGroupItem>
        </ListGroup>
      </CardBody>
    </Card>
  )
}

export default OnlineFriends