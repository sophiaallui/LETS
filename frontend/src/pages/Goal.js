import React, { useContext } from "react";
import Calendar from "MyComponents/Calendar";
import { Container } from "reactstrap";
import UserContext from "UserContext";
const Goal = () => {
  const { currenUser } = useContext(UserContext);
  return (
    <Container >
      <Calendar username={currenUser.username} />
    </Container>
  )
}

export default Goal;