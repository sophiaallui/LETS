import React, { useContext } from "react";
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
import AuthContext from "UserContext";

function NavbarOrange({ logout }) {
  const { currentUser } = useContext(AuthContext);
  const [collapseOpen, toggleCollapseOpen] = React.useState(false);
  const toggle = () => {
    toggleCollapseOpen((open) => !open);
  };
  const loggedInNav = () => {
    return (
      <Nav className="ml-lg-auto" navbar>
        <NavItem>
          <NavLink tag={Link} to={`/profile/${currentUser.username}`}>
            Profile
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink tag={Link} to="/messenger">
            Messages
          </NavLink>
        </NavItem>
        <NavItem  onClick={logout}>
          <NavLink>
            Logout
          </NavLink>
        </NavItem>
      </Nav>
    );
  };
  const loggedOutNav = () => (
    <Nav className="ml-auto" navbar>
      <NavItem>
        <NavLink tag={Link} exact to="/login">
          Login
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink tag={Link} exact to="/register">
          Register
        </NavLink>
      </NavItem>
    </Nav>
  );
  return (
    <>
      <Navbar className="navbar-dark bg-warning" expand="lg">
        <Container>
          <NavbarBrand tag={Link} to="/">
            GAINS
          </NavbarBrand>
          <button className="navbar-toggler" onClick={toggle}>
            <span className="navbar-toggler-icon"></span>
          </button>

          <Collapse navbar isOpen={collapseOpen}>
            {!currentUser ? loggedOutNav() : null}
          </Collapse>
          {currentUser ? loggedInNav() : null}
        </Container>
      </Navbar>
    </>
  );
}

export default NavbarOrange;
