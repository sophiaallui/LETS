import React from "react";
import { Link } from "react-router-dom";
// reactstrap components
import {
  Collapse,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
} from "reactstrap";

// Core Components

function NavbarOrange(props) {
  const [collapseOpen, toggleCollapseOpen] = React.useState(false);
  const toggle = () => {
    toggleCollapseOpen(open => !open)
  }
  return (
    <>
      <Navbar className="navbar-dark bg-warning" expand="lg">
        <Container>
          <NavbarBrand tag={Link} to="/">GAINS</NavbarBrand>
          <button
            className="navbar-toggler"
            onClick={toggle}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <Collapse navbar isOpen={collapseOpen}>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink tag={Link} exact to="/login">Login</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} exact to="/register">Register</NavLink>
              </NavItem>
            </Nav>
          </Collapse>


          <Nav className="ml-lg-auto" navbar>
            <NavItem>
              <NavLink tag={Link} exact to={`/profile/cjp0116`}>
                Profile
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={Link} exact to="/messenger">
                Messages
              </NavLink>
            </NavItem>
            <UncontrolledDropdown nav>
              <DropdownToggle
                aria-expanded={false}
                aria-haspopup={true}
                caret
                color="default"
                data-toggle="dropdown"
                href="#pablo"
                onClick={(e) => e.preventDefault()}
                id="navbar-primary_dropdown_1"
                nav
                role="button"
              >
                Settings
              </DropdownToggle>
              <DropdownMenu aria-labelledby="navbar-primary_dropdown_1" right>
                <DropdownItem
                  href="#pablo"
                  onClick={(e) => e.preventDefault()}
                >
                  Action
                </DropdownItem>
                <DropdownItem
                  href="#pablo"
                  onClick={(e) => e.preventDefault()}
                >
                  Another action
                </DropdownItem>
                <DropdownItem divider></DropdownItem>
                <DropdownItem
                  href="#pablo"
                  onClick={(e) => e.preventDefault()}
                >
                  Something else here
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Container>

      </Navbar>
    </>
  );
}

export default NavbarOrange;
