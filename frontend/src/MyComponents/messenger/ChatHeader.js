import React from "react";
import {
  Row,
  Media,
  Col,
  Button,
  UncontrolledTooltip,
  UncontrolledDropdown,
} from "reactstrap";
import { Link } from "react-router-dom";

const ChatHeader = ({ members }) => {
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
                  href="/#"
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
        <Button
          className="btn-text"
          color="link"
          data-placement="top"
          id="tooltip558026681"
          type="button"
        >
          <i className="ni ni-book-bookmark"></i>
        </Button>
        <UncontrolledTooltip
          delay={0}
          placement="top"
          target="tooltip558026681"
        >
          Video call
        </UncontrolledTooltip>
      </Col>
      <Col md="1" xs="3">
        <UncontrolledDropdown>
          <Button
            className="text-primary"
            color="link"
            data-toggle="dropdown"
            type="button"
          >
            <i className="ni ni-settings-gear-65"></i>
          </Button>
        </UncontrolledDropdown>
      </Col>
    </Row>
  );
};
export default ChatHeader;
