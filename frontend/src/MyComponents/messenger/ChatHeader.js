import React from "react";
import {
  Row, Media, Col, Button, UncontrolledTooltip, DropdownMenu, DropdownItem, UncontrolledDropdown
} from "reactstrap";

const ChatHeader = (props) => {
  return (
    <Row>
      <Col md="10">
        <Media className="align-items-center">
          <img
            alt="..."
            className="avatar shadow"
            src={require("assets/img/faces/christian.jpg")}
          ></img>
          <Media body>
            <h6 className="mb-0 d-block">Charlie Watson</h6>
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
          <DropdownMenu right>
            <DropdownItem href="#pablo" onClick={(e) => e.preventDefault()}>
              <i className="ni ni-single-02"></i>
              Profile
            </DropdownItem>
            <DropdownItem href="#pablo" onClick={(e) => e.preventDefault()}>
              <i className="ni ni-notification-70"></i>
              Mute conversation
            </DropdownItem>
            <DropdownItem href="#pablo" onClick={(e) => e.preventDefault()}>
              <i className="ni ni-key-25"></i>
              Block
            </DropdownItem>
            <DropdownItem href="#pablo" onClick={(e) => e.preventDefault()}>
              <i className="ni ni-button-power"></i>
              Clear chat
            </DropdownItem>
            <DropdownItem divider></DropdownItem>
            <DropdownItem href="#pablo" onClick={(e) => e.preventDefault()}>
              <i className="ni ni-fat-remove"></i>
              Delete chat
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </Col>
    </Row>
  );
};
export default ChatHeader;