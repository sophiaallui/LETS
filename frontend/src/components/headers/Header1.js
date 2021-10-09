import React from "react";
import { Link } from "react-router-dom";
// reactstrap components
import {
  Button,
  Container,
  Row,
  Col,
} from "reactstrap";

// Core Components

function Header1() {
  return (
    <>
      <header className="header-1">
        <div className="page-header">
          <div
            className="page-header-image"
            style={{
              backgroundImage: "url(" + require("assets/img/ill/p2.svg") + ")",
            }}
          ></div>
          <Container>
            <Row>
              <Col
                className="mr-auto text-left d-flex justify-content-center flex-column"
                lg="5"
                md="7"
              >
                <h3 className="display-3">Make Gains</h3>
                <p className="lead mt-0">
                  Keep your buddy in check, outlift them, encourage each other.
                </p>
                <br></br>
                <div className="buttons">
                  <Button
                    color="danger"
                    href="#pablo"
                    onClick={(e) => e.preventDefault()}
                  >
                    Got it
                  </Button>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </header>
    </>
  );
}

export default Header1;
