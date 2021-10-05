import React from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
} from "reactstrap";

const TypingMessage = props => {
  return (
    <Row className="justify-content-start">
    <Col className="col-auto">
      <Card>
        <CardBody className="p-2">
          <div className="spinner">
            <div className="bounce1"></div>
            <div className="bounce2"></div>
            <div className="bounce3"></div>
          </div>
          <p className="d-inline-block mr-2 mb-1 mt-1">Typing...</p>
        </CardBody>
      </Card>
    </Col>
  </Row>
  )
}

const Message = ({ mine }) => {
  
  return (
    <Row className={mine ? 'justify-content-end text-right' : 'justify-content-start'}>
    <Col className="col-auto">
      <Card className={mine ? 'bg-gradient-primary text-white' : ''}>
        <CardBody className="p-2">
          <p className="mb-1">
            It contains a lot of good lessons about effective
            practices
          </p>
          <div>
            <small className="opacity-60">
              <i className="far fa-clock"></i>
              3:14am
            </small>
          </div>
        </CardBody>
      </Card>
    </Col>
  </Row>
  )
}

export default Message;