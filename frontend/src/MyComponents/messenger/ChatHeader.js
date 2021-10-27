import React from "react";
import {
  Row,
  Media,
  Col,
  Button,
  UncontrolledTooltip,
} from "reactstrap";
import { Link } from "react-router-dom";

const ChatHeader = ({ members }) => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  return (
    <Row>
      <Col md="10">
        <Media className="align-items-center">
          <div className="avatar-group">
            {members?.map((m) => (
              <>
                <a
                  className="avatar rounded-circle"
                  tag={Link}
                  id={m}
                  to={`/profile/${m}`}
                  onClick={(e) => e.preventDefault()}
                >
                  <img alt="..." src={require("assets/img/placeholder.jpg")} />
                </a>
                <UncontrolledTooltip delay={0} target={m}>
                  {m}
                </UncontrolledTooltip>
              </>
            ))}
          </div>
          <Media body>
            {members?.map((m) => (
              <h6 key={m} className="mb-0 d-block">
                {m}
              </h6>
            ))}
          </Media>
        </Media>
      </Col>
      <Col md="1" xs="3">

      </Col>
      <Col md="1" xs="3">

      </Col>
    </Row>
  );
};
export default ChatHeader;
