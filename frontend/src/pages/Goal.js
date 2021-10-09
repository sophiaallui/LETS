import React from "react";
import Calendar from "MyComponents/Calendar";
import { Container } from "reactstrap";
const Goal = ({ events, addEvent }) => {
  return (
    <Container>
      <Calendar userEvents={events} addEvent={addEvent} />
    </Container>
  )
}

export default Goal;