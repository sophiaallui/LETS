import React, { useContext } from "react";
import Calendar from "MyComponents/Calendar";
import { Container } from "reactstrap";
import UserContext from "UserContext";
const Goal = () => {
  const { currentUser } = useContext(UserContext);
  return (
    <Container >
      <Calendar username={currentUser.username} />
    </Container>
  )
}

export default Goal;