import React, { useState, useContext, useRef, useEffect, Col, Row } from "react";
import Api from "api/api";
import UserContext from "UserContext";
import { Card, CardHeader, ListGroup, ListGroupItem, CardBody, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem} from "reactstrap";
import NewGoalFormModal from "MyComponents/NewGoalFormModal";
import NotificationAlert from "react-notification-alert";
import "react-notification-alert/dist/animate.css";
import "./goals.css";

const Goals = ({ isMine, goals }) => {
	const [filteredGoals, setFilteredGoals] = useState([])
	const [showModal, setShowModal] = useState(false);
	useEffect(() => {
		setFilteredGoals(goals?.map(g => {
			const color = g.color.split("-")[1];
			return { ...g, color }
		}))
	}, [goals, filteredGoals?.length]);
	const notify = useRef();
    const options = {
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

  const addGoal = (newGoal) => {
  	newGoal.startDate = String(newGoal.startDate);
  	newGoal.dueDate = String(newGoal.dueDate);
  	setFilteredGoals([...filteredGoals, newGoal])
  }

  const showNotifications = () => {
  	notify.current.notificationAlert(options)
  }
	return (
		<div className="goals">
		 	<NotificationAlert ref={notify} zIndex={1031} onClick={() => console.log("hey")} />
			<div className="goalsWrapper">
				<Card className="posts" style={{ width : "400%" }}>
					<CardHeader className="d-flex align-items-center">
						<h5 className="h3 mb-0">Goals</h5>
						<div className="text-right ml-auto">
							<UncontrolledDropdown caret color="secondary">
								<DropdownToggle>Actions</DropdownToggle>
								<DropdownMenu>
									<DropdownItem  onClick={() => setShowModal(true)}>
										Add new goal
										<NewGoalFormModal 
											showModal={showModal} 
											setShowModal={setShowModal} 
											showNotifications={showNotifications} 
											addGoal={addGoal} 
										/>
									</DropdownItem>
									<DropdownItem onClick={() => {}}>
										Delete selected goals
									</DropdownItem>
								</DropdownMenu>
							</UncontrolledDropdown>
						</div>
		
					</CardHeader>
					<CardBody>
						<ListGroup data-toggle="checklist" flush>
							{filteredGoals?.map(({
								id,
								createdBy,
								content,
								dueDate,
								color,
								startDate,
								isComplete
							}) => (
								
							 <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
			                    <div className={`checklist-item-${color} ${isComplete ? "checklist-item-success checklist-item-checked" : ""} checklist-item`} >
			                      <div className={`checklist-info`}>
			                        <h5 className="checklist-title mb-0">{content}</h5>
			                        <small>By : {dueDate}</small>
			                      </div>
			                      <div>
			                        <div className={`custom-control custom-checkbox custom-checkbox-${color}`}>
			                          <input
			                            className="custom-control-input"
			                            defaultChecked={isComplete}
			                            id={`chk-todo-task-${id}`}
			                            type="checkbox"
			                          />
			                          <label
			                            className="custom-control-label"
			                            htmlFor={`chk-todo-task-${id}`}
			                          />
			                        </div>
			                      </div>
			                    </div>
			                  </ListGroupItem>
							))}
						</ListGroup>
					</CardBody>
				</Card>
			</div>
		</div>
	)
}

export default Goals;