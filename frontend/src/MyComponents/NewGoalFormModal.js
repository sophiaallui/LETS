import React, { useState,  useContext } from "react";
import classnames from "classnames";
import { Modal, FormGroup, Input, ButtonGroup, Button } from "reactstrap";
import ReactDatetime from "react-datetime";
import "react-notification-alert/dist/animate.css";
import UserContext from "UserContext";
import Api from "api/api";


const NewGoalFormModal = ({
  addGoal,
  showModal,
  setShowModal,
  showNotifications,
}) => {
  const { currentUser } = useContext(UserContext);
  const [goalText, setGoalText] = useState("");
  const [radios, setRadios] = useState("");
  const [startDate, setStartDate] = useState(new Date(Date.now()));
  const [endDate, setEndDate] = useState(null);
  const [errors, setErrors] = useState(null);
  const successOptions = {
    place : "tr",
    message : (
      <div>
        <span className="alert-title" data-notify="title">Notification </span>
        <span data-notify="message">
          Added new goal
        </span>
      </div>
    ),
    type : "success",
    icon : "ni ni-bell-55",
    autoDismiss : 5
  };
  const errorOptions = {
    place: "tr",
    message: (
      <div>
        <span className="alert-title" data-notify="title">
          Error{" "}
        </span>
        {errors && <span>{errors[0]}</span>} 
      </div>
    ),
    type: "danger",
    icon: "ni ni-bell-55",
    autoDismiss: 5,
  };

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
  const handleGoalSubmit = async (e) => {
    try {
      const newGoal = {
        content: goalText,
        startDate : startDate,
        dueDate: new Date(endDate.toString()),
        isComplete: false,
        color: radios,
      };
      const res = await Api.request(
        `goals/${currentUser.username}`,
        newGoal,
        "POST"
      );
      addGoal && addGoal(res.goal);
      showNotifications(successOptions)
    } catch (e) {
      console.error(e);
      setErrors(e);
      showNotifications(errorOptions);
    }
  };

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
              inputProps={{
                placeholder: "Complete By",
                className: "form-control-alternative new-event--title",
              }}
              timeFormat={true}
              value={endDate}
              className="form-control-alternative new-event--title"
              onChange={(e) => setEndDate(e._d)}
              renderDay={(props, currentDate, selectedDate) => {
                let classes = props.className;
                classes += getClassNameReactDatetimeDays(currentDate);
                return (
                  <td {...props} className={classes}>
                    {currentDate.date()}
                  </td>
                );
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
          onClick={() =>
            handleGoalSubmit()
              // .then((newGoal) => {
              //   addGoal && addGoal(newGoal);
              //   showNotifications && showNotifications();
              // })
              // .catch((e) => {
              //   showNotifications && showNotifications(errorOptions)
              // })
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
  );
};
export default NewGoalFormModal;
