import React, { useState, useRef, useContext } from "react";
import classnames from "classnames";
import { Modal, FormGroup, Input, ButtonGroup, Button } from "reactstrap"
import ReactDatetime from "react-datetime";
import NotificationAlert from "react-notification-alert";
import "react-notification-alert/dist/animate.css";
import UserContext from "UserContext";
import Api from "api/api";

function getCurrentDateTime() {
    const today = new Date();
    const y = today.getFullYear();
    const m = today.getMonth();
    const d = today.getDate();
    const hr = today.getHours();
    const mins = today.getMinutes();
    return new Date(y, m, d, hr, mins);
}

const NewGoalFormModal = ({ addGoal = () => {}, showModal, setShowModal, showNotifications }) => {
  
  const { currentUser } = useContext(UserContext); 
  const [goalText, setGoalText] = useState("");
  const [radios, setRadios] = useState("");

  const [startDate, setStartDate] = useState(getCurrentDateTime());
  const [endDate, setEndDate] = useState(null);


  const getClassNameReactDatetimeDays = (date) => {
    if (startDate && endDate) {
    }
    if (startDate && endDate && startDate._d + "" !== endDate._d + "") {
      if (
        new Date(endDate._d + "") > new Date(date._d + "") &&
        new Date(startDate._d + "") < new Date(date._d + "")
      ) {
        return " middle-date";
      }
      if (endDate._d + "" === date._d + "") {
        return " end-date";
      }
      if (startDate._d + "" === date._d + "") {
        return " start-date";
      }
    }
    return "";
  };
  const handleGoalSubmit = async e => {
    try {
      const newGoal = {
        content : goalText,
        dueDate : endDate,
        startDate : startDate,
        isComplete : false,
        color : radios
      }
       await Api.request(`goals/${currentUser.username}`, newGoal, "POST");
       return newGoal;
    } catch(e) {
      console.error(e);
    }
  }

  console.log("startDate=", startDate, "endDate=", endDate);
  return (
		  <Modal
              isOpen={showModal}
              toggle={() => setShowModal(false)}
              className="modal-dialog-centered modal-secondary"
            >
              <div className="modal-body">
                <form className="new-event--form">
                  <FormGroup>
                    <label className="form-control-label">Goal</label>
                    <Input
                      className="form-control-alternative new-event--title"
                      placeholder="Goal"
                      type="text"
                      onChange={(e) => setGoalText(e.target.value)}
                    />
                  </FormGroup>
                    <FormGroup>
                      <label className="form-control-label">Due Date</label>
                      <ReactDatetime 
                          inputProps={{ placeholder : "Complete By", className : "form-control-alternative new-event--title"}} 
                          timeFormat={true} 
                          value={endDate} 
                          className="form-control-alternative new-event--title"
                          onChange={e => setEndDate(e._d)} 
                          renderDay={( props, currentDate, selectedDate) => {
                            let classes = props.className;
                            classes += getClassNameReactDatetimeDays(currentDate)
                            return (
                              <td {...props} className={classes}>
                              {currentDate.date()}
                              </td>
                            )
                          }}
                      />
                  </FormGroup>
       
                  <FormGroup className="mb-0">
                    <label className="form-control-label d-block mb-3">
                      Status color
                    </label>
                    <ButtonGroup
                      className="btn-group-toggle btn-group-colors event-tag"
                      data-toggle="buttons"
                    >
                      <Button
                        className={classnames("bg-info", {
                          active: radios === "bg-info",
                        })}
                        color=""
                        type="button"
                        onClick={() => setRadios("bg-info")}
                      />
                      <Button
                        className={classnames("bg-warning", {
                          active: radios === "bg-warning",
                        })}
                        color=""
                        type="button"
                        onClick={() => setRadios("bg-warning")}
                      />
                      <Button
                        className={classnames("bg-danger", {
                          active: radios === "bg-danger",
                        })}
                        color=""
                        type="button"
                        onClick={() => setRadios("bg-danger")}
                      />
                      <Button
                        className={classnames("bg-success", {
                          active: radios === "bg-success",
                        })}
                        color=""
                        type="button"
                        onClick={() => setRadios("bg-success")}
                      />
                      <Button
                        className={classnames("bg-default", {
                          active: radios === "bg-default",
                        })}
                        color=""
                        type="button"
                        onClick={() => setRadios("bg-default")}
                      />
                      <Button
                        className={classnames("bg-primary", {
                          active: radios === "bg-primary",
                        })}
                        color=""
                        type="button"
                        onClick={() => setRadios("bg-primary")}
                      />
                    </ButtonGroup>
                  </FormGroup>
                </form>
              </div>
              <div className="modal-footer">
                <Button
                  className="new-event--add"
                  color="primary"
                  type="button"
                  onClick={() => handleGoalSubmit()
                  	.then((newGoal) => {	
                    	addGoal(newGoal)
                  	})
                    .then(() => {
                      showNotifications();
                    })
                  	.then(() => setShowModal(false))         
                  }
                >
                  Add goal
                </Button>
                <Button
                  className="ml-auto"
                  color="link"
                  type="button"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </Button>
              </div>
            </Modal>
	)
}
export default NewGoalFormModal;