import React, { useEffect, useContext, useState} from "react";
import { useParams } from "react-router-dom";

// reactstrap components
import { Container,Row,Col } from "reactstrap";
import Sidebar from "MyComponents/sidebar/Sidebar";
// Core Components
import ProfileCard from "MyComponents/ProfileCard";
import Api from "api/api";
import UserContext from "UserContext";

function UserProfile(props) {
  const { username } = useParams();
  const { currentUser } = 
  const [loadedUser, setLoadedUser] = useState(null)
 useEffect(() => {

  });
  console.debug("UserProfile:", "username=",username)
  return (
    <>
    <Row>
        <Col lg="3">
            <Sidebar />
        </Col>
        <Col lg="9">
           <ProfileCard username={username} />
      </Col>
      </Row>
    </>
  );
}

export default UserProfile;
