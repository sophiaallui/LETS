import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
// JavaScript plugin that hides or shows a component based on your scroll
import Headroom from "headroom.js";
// reactstrap components
import {
  Collapse,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  NavItem,
  NavbarBrand,
  Navbar,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
} from "reactstrap";
// Core Components

function NavBar(props) {
  useEffect(() => {
    const headroom = new Headroom(document.getElementById("red-navbar-main"));
    headroom.init();
  });

  const [collapseOpen, toggleCollapseOpen] = React.useState(false);
  return (
    <>
      <Navbar className={`bg-warning navbar-main headroom navbar-dark`} expand="lg" id="red-navbar-main">
        <Container>
          <NavbarBrand href="#pablo" onClick={(e) => e.preventDefault()}>
            GAINS
          </NavbarBrand>
          <button
            className="navbar-toggler"
            onClick={() => toggleCollapseOpen(!collapseOpen)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <Collapse
            id="navbar_global"
            navbar
            toggler="#navbar_global"
            isOpen={collapseOpen}
          >
            <div className="navbar-collapse-header">
              <Row>
                <Col className="collapse-brand" xs="6">
                  <Link to="/index">
                    <img
                      alt="..."
                      src={require("assets/img/brand/blue.png")}
                    ></img>
                  </Link>
                </Col>
                <Col className="collapse-close" xs="6">
                  <button
                    className="navbar-toggler"
                    onClick={() => toggleCollapseOpen(!collapseOpen)}
                  >
                    <span></span>
                    <span></span>
                  </button>
                </Col>
              </Row>
            </div>
            <Nav
              className="navbar-nav-hover align-items-lg-center ml-lg-auto"
              navbar
            >
              <UncontrolledDropdown nav>
                <DropdownToggle
                  data-toggle="dropdown"
                  href="#pablo"
                  onClick={(e) => e.preventDefault()}
                  role="button"
                  tag={NavLink}
                >
                  <i className="ni ni-ui-04 d-lg-none"></i>
                  <span className="nav-link-inner--text">Login</span>
                </DropdownToggle>

              </UncontrolledDropdown>
              <UncontrolledDropdown nav>
                <DropdownToggle
                  tag={NavLink}
                  data-toggle="dropdown"
                  href="#pablo"
                  onClick={(e) => e.preventDefault()}
                  role="button"
                >
                  <i className="ni ni-app d-lg-none"></i>
                  <span className="nav-link-inner--text">Design Blocks</span>
                </DropdownToggle>
                <DropdownMenu aria-labelledby="navbarDropdownMenuLink">
                  <DropdownItem tag={Link} to="/sections#headers">
                    <i className="ni ni-album-2 text-info"></i>
                    Headers
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
              <UncontrolledDropdown nav>
                <DropdownToggle
                  tag={NavLink}
                  data-toggle="dropdown"
                  href="#pablo"
                  onClick={(e) => e.preventDefault()}
                  role="button"
                >
                  <i className="ni ni-single-copy-04 d-lg-none"></i>
                  <span className="nav-link-inner--text">Examples</span>
                </DropdownToggle>
                <DropdownMenu aria-labelledby="navbarDropdownMenuLink">
                  <DropdownItem to="/about-us" tag={Link}>
                    <i className="ni ni-tie-bow text-warning"></i>
                    About-us
                  </DropdownItem>
                  <DropdownItem to="/error" tag={Link}>
                    <i className="ni ni-button-power text-warning"></i>
                    404 Error Page
                  </DropdownItem>
                  <DropdownItem to="/error-500" tag={Link}>
                    <i className="ni ni-ungroup text-yellow"></i>
                    500 Error Page
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
              <UncontrolledDropdown nav>
                <DropdownToggle
                  tag={NavLink}
                  data-toggle="dropdown"
                  href="#pablo"
                  onClick={(e) => e.preventDefault()}
                  role="button"
                >
                  <i className="ni ni-tablet-button d-lg-none"></i>
                  <span className="nav-link-inner--text">App Pages</span>
                </DropdownToggle>
                <DropdownMenu aria-labelledby="navbarDropdownMenuLink">
                  <DropdownItem to="/account-settings" tag={Link}>
                    <i className="ni ni-lock-circle-open text-muted"></i>
                    Account Settings
                  </DropdownItem>
                  <DropdownItem to="/login-page" tag={Link}>
                    <i className="ni ni-tv-2 text-danger"></i>
                    Login Page
                  </DropdownItem>
                  <DropdownItem to="/register-page" tag={Link}>
                    <i className="ni ni-air-baloon text-pink"></i>
                    Register Page
                  </DropdownItem>
                  <DropdownItem to="/reset-page" tag={Link}>
                    <i className="ni ni-atom text-info"></i>
                    Reset Page
                  </DropdownItem>
                  <DropdownItem to="/invoice-page" tag={Link}>
                    <i className="ni ni-bullet-list-67 text-success"></i>
                    Invoice Page
                  </DropdownItem>
                  <DropdownItem to="/checkout-page" tag={Link}>
                    <i className="ni ni-basket text-orange"></i>
                    Checkout Page
                  </DropdownItem>
                  <DropdownItem to="/chat-page" tag={Link}>
                    <i className="ni ni-chat-round text-primary"></i>
                    Chat Page
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default NavBar;
