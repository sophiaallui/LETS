import React, { useState, useContext, useRef, useEffect } from "react";
import Api from "api/api";
import UserContext from "UserContext";
import {
  Card,
  CardHeader,
  ListGroup,
  ListGroupItem,
  CardBody,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Container,
  Row,
  Col,
  Button,
} from "reactstrap";
import NewGoalFormModal from "MyComponents/NewGoalFormModal";
import NotificationAlert from "react-notification-alert";
import "react-notification-alert/dist/animate.css";
import CardTitle from "reactstrap/lib/CardTitle";

const Goals = ({ isMine, userGoals }) => {
  const notify = useRef();
  const { currentUser } = useContext(UserContext);
  const [goals, setGoals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [checkedIds, setCheckedIds] = useState([]);
  const [numCompleted, setNumCompleted] = useState(0);
  const deleteOptions = {
    place: "tr",
    message: (
      <div>
        <span className="alert-title" data-notify="title">
          Notification{" "}
        </span>
        <span data-notify="message">Deleted goals</span>
      </div>
    ),
    type: "danger",
    icon: "ni ni-bell-55",
    autoDismiss: 5,
  };

  const updateOptions = {
    place: "tr",
    message: (
      <div>
        <span className="alert-title" data-notify="title">
          Notification{" "}
        </span>
        <span data-notify="message">Updated goals</span>
      </div>
    ),
    type: "primary",
    icon: "ni ni-bell-55",
    autoDismiss: 5,
  };

  useEffect(() => {
    setGoals(
      userGoals?.map((g) => {
        const color = g.color.split("-")[1];
        return { ...g, color };
      })
    );
    setCheckedIds(goals?.filter((goal) => goal.isComplete).map((g) => g.id));
    const completedArr = goals?.filter((goal) => goal.isComplete);
    setNumCompleted(completedArr?.length);
  }, [userGoals])



  const addGoal = (newGoal) => {
    console.log("Goals.js newGoal=", newGoal);
    setShowModal(false);
    setGoals((prev) => [...prev, newGoal]);
  };

  const deleteGoals = async () => {
    try {
      await Promise.all(
        checkedIds.map((id) =>
          Api.request(`goals/${currentUser.username}/${id}`, {}, "DELETE")
        )
      );
      setGoals(goals.filter((goal) => !checkedIds.includes(goal.id)));
      setCheckedIds([]);
      showNotifications(deleteOptions);
    } catch (e) {
      console.error(e);
    }
  };

  const addToCheckedIds = (goalId) => {
    checkedIds.includes(goalId)
      ? setCheckedIds(checkedIds.filter((id) => id !== goalId))
      : setCheckedIds([...checkedIds, goalId]);
  };

  const setCheckedAsComplete = async () => {
    try {
      await Promise.all(
        checkedIds.map((id) =>
          Api.request(
            `goals/${currentUser.username}/${id}`,
            { isComplete: true },
            "PUT"
          )
        )
      );
      setGoals(
        goals.map((goal) => {
          return checkedIds.includes(goal.id)
            ? { ...goal, isComplete: true }
            : goal;
        })
      );
      setNumCompleted((num) => num + checkedIds.length);
      showNotifications(updateOptions);
    } catch (e) {
      console.error(e);
    }
  };

  const showNotifications = (options) => {
    notify.current.notificationAlert(options);
  };

  console.log(checkedIds, "goals=", goals);
  return (
    <>
      {showModal && (
        <NewGoalFormModal
          showModal={showModal}
          setShowModal={setShowModal}
          addGoal={addGoal}
          showNotifications={showNotifications}
        />
      )}
      <div className="rna-wrapper">
        <NotificationAlert ref={notify} zIndex={1031} />
      </div>

      <div
        className="header pb-6 d-flex flex-column share"
        style={{ width: "60vw", position: "absolute", backgroundColor:'#6FB3B8'}}
      >
        <Container fluid className="mb-6">
          <div className="header-body">
            <Row className="align-items-center py-4">
              <Col lg="6" xs="7">
                <h6 className="h2 text-white d-inline-block mb-0">Goals</h6>
              </Col>
              {isMine && (
                <Col className="text-right" lg="6" xs="5">
                  <Button
                    className="btn-neutral"
                    color="default"
                    onClick={() => setShowModal(true)}
                    size="sm"
                  >
                    <i className="ni ni-fat-add mr-2" />
                    New
                  </Button>
                  <UncontrolledDropdown caret color="secondary">
                    <DropdownToggle size="sm">Actions</DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem onClick={() => setShowModal(true)}>
                        <i className="ni ni-fat-add mr-2" />
                        New
                      </DropdownItem>
                      <DropdownItem onClick={deleteGoals}>
                        <i className="ni ni-fat-remove" />
                        Delete selected goals
                      </DropdownItem>
                      <DropdownItem onClick={setCheckedAsComplete}>
                        <i className="ni ni-check-bold" />
                        Mark selected as complete
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </Col>
              )}
            </Row>
            <Row>
              <Col md="6">
                <Card className="card-status">
                  <CardBody>
                    <Row>
                      <div className="col" tag="h5">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Goals completed
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          {numCompleted}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-gradient-red text-white rounded-circle shadow">
                          <i className="ni ni-check-bold" />
                        </div>
                      </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-sm">
                      <span className="text-success mr-2">
                        <i className="fa fa-arrow-up" /> 3.48%
                      </span>
                      <span className="text-nowrap">Since last month</span>
                    </p>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </Container>
        <Container className="mt--6" fluid>
          <Row>
            <Col xl="12">
              <Card>
                <CardHeader className="d-flex align-items-center">
                  <h5 className="h3 mb-0">Goals</h5>
                </CardHeader>
                <CardBody>
                  <ListGroup data-toggle="checklist" flush>
                    {goals?.map(
                      ({
                        id,
                        createdBy,
                        content,
                        dueDate,
                        color,
                        startDate,
                        isComplete,
                      }) => (
                        <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                          <div
                            className={`checklist-item-${color} ${
                              isComplete
                                ? "checklist-item-success checklist-item-checked"
                                : ""
                            } checklist-item`}
                          >
                            <div className={`checklist-info`}>
                              <h5 className="checklist-title mb-0">
                                {content}
                              </h5>
                              <small>By : {dueDate}</small>
                            </div>
                            <div>
                              <div
                                className={`custom-control custom-checkbox custom-checkbox-${color}`}
                              >
                                <input
                                  className="custom-control-input"
                                  defaultChecked={isComplete}
                                  id={`chk-todo-task-${id}`}
                                  type="checkbox"
                                  onClick={() => addToCheckedIds(id)}
                                />
                                <label
                                  className="custom-control-label"
                                  htmlFor={`chk-todo-task-${id}`}
                                />
                              </div>
                            </div>
                          </div>
                        </ListGroupItem>
                      )
                    )}
                  </ListGroup>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Goals;
