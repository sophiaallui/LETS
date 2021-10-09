import React, { useState, useEffect, useContext } from "react";
import Api from "api/api";
import UserContext from "UserContext";
import { Row, Col, Card, CardHeader, CardBody, ListGroupItem, ListGroup, Button, Container } from "reactstrap";
import { Link } from "react-router-dom";

const Friends = props => {
  const [currentFriends, setCurrentFriends] = useState(null);
  const [usersAwaitingMyConfirmation, setUsersAwaitingMyConfirmation] = useState(null);
  const [mySentRequests, setMySentRequests] = useState(null);

  return (
    <>
      <Container fluid>
        <Row className="flex-row">
          <Col lg="4">
            <Card className="bg-secondary">
              <CardHeader>
                <h5 className="h2 mb-0">Friends Requests</h5>
              </CardHeader>
              <ListGroup className="list my--3" flush>
                {usersAwaitingMyConfirmation?.map(user => (
                  <ListGroupItem className="px-0">
                    <Row className="align-items-center">
                      <Col className="col-auto">
                        <Link className="avatar rounded-circle" to={`/profile/${user.username}`}>
                          <img
                            alt="..."
                            src={require("assets/img/placeholder.jpg")}
                          />
                        </Link>
                        <div className="col ml--2">
                          <h4 className="mb-0">
                            <a onClick={(e) => e.preventDefault()}>
                              {user.firstName} {user.lastName}
                            </a>
                          </h4>
                        </div>
                      </Col>
                      <Col className="col-auto">
                        <Button color="primary" size="sm" type="button">Confirm</Button>
                        <Button color="danger" size="sm" type="button">Delete</Button>
                      </Col>
                    </Row>
                  </ListGroupItem>
                ))}
              </ListGroup>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  )
};

export default Friends;