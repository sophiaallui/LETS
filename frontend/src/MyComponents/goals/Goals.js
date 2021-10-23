import React, { useState, useContext, useRef, useEffect } from "react";
import Api from "api/api";
import UserContext from "UserContext";
import { Card, CardHeader, ListGroup, ListGroupItem, CardBody, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem} from "reactstrap";
import NewGoalFormModal from "MyComponents/NewGoalFormModal";
import NotificationAlert from "react-notification-alert";
import "react-notification-alert/dist/animate.css";
import "./goals.css";


const Goals = ({ isMine, userGoals }) => {
	const { currentUser } = useContext(UserContext);
	const [goals, setGoals] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [checkedIds, setCheckedIds] = useState([]);
	const [isComplete, setIsComplete] = useState(false);
	useEffect(() => {
		setGoals(userGoals?.map(g => {
			const color = g.color.split("-")[1];
			return { ...g, color }
		}));

		setCheckedIds(goals?.filter(goal => goal.isComplete).map(g => g.id));
	}, [userGoals, goals?.length]);
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
  	setGoals([...goals, newGoal])
  }

  const deleteGoals = async () => {
  	try {
  		await Promise.all(checkedIds.map(id => Api.request(`goals/${currentUser.username}/${id}`, {}, "DELETE")));
  		setGoals(
  			goals.filter(goal => !checkedIds.includes(goal.id))
  		)
  		setCheckedIds([]);
  	} catch(e) {
  		console.error(e);
  	}
  }
  const showNotifications = () => {
  	notify.current.notificationAlert(options)
  }

  const addToCheckedIds = (id) => {
  	checkedIds.includes(id) 
  	? setCheckedIds(checkedIds.filter(id => id !== id))
  	: setCheckedIds(prev => [...prev, id])
  }
  console.log(checkedIds, goals)
	return (
		<div className="goals">
		 	<NotificationAlert ref={notify} zIndex={1031} onClick={() => console.log("hey")} />
			<div className="goalsWrapper">
				<Card style={{ width : "400%" }}>
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
									<DropdownItem onClick={deleteGoals}>
										Delete selected goals
									</DropdownItem>
									<DropdownItem onClick={() => {}}>
										Mark selected as complete
									</DropdownItem>
								</DropdownMenu>
							</UncontrolledDropdown>
						</div>
		
					</CardHeader>
					<CardBody>
						<ListGroup data-toggle="checklist" flush>
							{goals?.map(({
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
							))}
						</ListGroup>
					</CardBody>
				</Card>
			</div>
		</div>
	)
}

export default Goals;