import React from "react";
import Calendar from "MyComponents/Calendar";
import { Container } from "reactstrap";
const Goal = ({ events }) => {
  return (
    <Container>
      <Calendar userEvents={events} />
    </Container>
  )
}

export default Goal;