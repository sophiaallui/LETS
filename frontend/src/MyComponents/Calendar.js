import React, { useState, useEffect, useContext, useRef } from "react";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction" // needed for dateClick
import { Button, ButtonGroup, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup } from "reactstrap";
// nodejs library that concatenates classes
import classnames from "classnames";
import ReactBSAlert from "react-bootstrap-sweetalert";
// core components

import UserContext from "UserContext";
import Api from "api/api";

export default function CalendarView({ userEvents }) {

    const [addEventModal, toggleAddEventModal] = useState(false);
    const [editEventModal, toggleEditEventModal] = useState(false);
    const [addButtonPressed, setAddButtonPressed] = useState(false);
    const [confirmEdit, setConfirmEdit] = useState(false);
    const [event, setEvent] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [events, setEvents] = useState(userEvents);
    const [eventTitle, setEventTitle] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [radios, setRadios] = useState(null);
    const [color, setColor] = useState(null);
    const [oldEvent, setOldEvent] = useState(null);

    const { currentUser } = useContext(UserContext);
    const { username } = currentUser;

    let calendarRef = useRef();

    let createNewEvent = async () => {
        let newEvent = await Api.createCalendarEvent(username, event);
        let calendar = calendarRef.current.getApi();
        calendar.addEvent(newEvent);
        setEvents([...events, newEvent]);
        console.debug("eventsAfter adding to state=", events)

        toggleAddEventModal(false);
        setAddButtonPressed(false);
        setStartDate(null);
        setEndDate(null);
        setColor(null);
        setRadios(null);
        setEvent(null);
    };

    let deleteEvent = async () => {
        // try {
        //     await Api.deleteEvent(username, 'id')
        // }
        // catch(e) {
        //     console.error(e);
        // }
        console.debug("oldEvent=", oldEvent)
        await oldEvent.remove()
        toggleEditEventModal(false)
        setOldEvent(null)
    }

    useEffect(() => {
        if (addButtonPressed) {
            setEvent({
                description: eventDescription,
                title: eventTitle,
                backgroundColor: color,
                start: startDate,
                end: endDate
            })
        }
    }, [addButtonPressed]);

    useEffect(() => {
        if (event) {
            createNewEvent()
        }
    }, [event]);

    return (
        <>

            <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                initialEvents={events}
                editable={true}
                selectable={true}
                select={(eventInfo) => {
                    setStartDate(eventInfo.startStr);
                    setEndDate(eventInfo.endStr)
                    toggleAddEventModal(true)
                }}
                eventClick={(eventInfo) => {
                    toggleEditEventModal(true)
                    let description = eventInfo.event.extendedProps.description;
                    let title = eventInfo.event.title;
                    let backgroundColor = eventInfo.event.backgroundColor;
                    let start = eventInfo.event.startStr;
                    let end = eventInfo.event.endStr;
                    console.log("eventInfo=",eventInfo)
                    setOldEvent(eventInfo.event)
                    //change events here
                }}
            />

            <Modal isOpen={addEventModal} toggle={() => toggleAddEventModal(!addEventModal)} className="modal-dialog-centered modal-secondary">
                <ModalHeader>Add Event</ModalHeader>
                <ModalBody>
                    <form className="new-event--form" onSubmit={e => e.preventDefault()}>
                        <FormGroup>
                            <label htmlFor='eventTitle' className="form-control-label">Event Title</label>
                            <input value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} className="form-control-alternative new-event--title" />
                        </FormGroup>
                        <FormGroup className="mb-0">
                            <label htmlFor='eventDescription' className="form-control-label">Event Description</label>
                            <textarea value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} className="form-control-alternative edit-event--description textarea-autosize" />
                        </FormGroup>

                        <FormGroup className="mb-0">
                            <label htmlFor='eventColor' className="form-control-label d-block mb-3">Event Color</label>
                            <ButtonGroup
                                className="btn-group-toggle btn-group-colors event-tag"
                                data-toggle="buttons"
                            >
                                <Button
                                    className={classnames("bg-info", {
                                        active: radios === "bg-info",
                                    })}
                                    type="button"
                                    onClick={() => {
                                        setColor('#11cdef')
                                        setRadios("bg-info")
                                    }}
                                />
                                <Button
                                    className={classnames("bg-warning", {
                                        active: radios === "bg-warning",
                                    })}
                                    color=""
                                    type="button"
                                    onClick={() => {
                                        setColor('#fa3a0e')
                                        setRadios("bg-warning")
                                    }}
                                />
                                <Button
                                    className={classnames("bg-danger", {
                                        active: radios === "bg-danger",
                                    })}
                                    color=""
                                    type="button"
                                    onClick={() => {
                                        setColor('#f5365c')
                                        setRadios("bg-danger")
                                    }}
                                />
                                <Button
                                    className={classnames("bg-success", {
                                        active: radios === "bg-success",
                                    })}
                                    color=""
                                    type="button"
                                    onClick={() => {
                                        setColor('#24a46d')
                                        setRadios("bg-success")
                                    }}
                                />
                                <Button
                                    className={classnames("bg-default", {
                                        active: radios === "bg-default",
                                    })}
                                    color=""
                                    type="button"
                                    onClick={() => {
                                        setColor('#0b1526')
                                        setRadios("bg-default")
                                    }}
                                />
                                <Button
                                    className={classnames("bg-primary", {
                                        active: radios === "bg-primary",
                                    })}
                                    color=""
                                    type="button"
                                    onClick={() => {
                                        setColor('#324cdd')
                                        setRadios("bg-primary")
                                    }}
                                />
                            </ButtonGroup>
                        </FormGroup>
                    </form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" className="new-event--add" onClick={() => setAddButtonPressed(true)}>Add event</Button>
                    <Button color="secondary" className="ml-auto" onClick={() => toggleAddEventModal(false)}>Cancel</Button>
                </ModalFooter>
            </Modal>
            <Modal isOpen={editEventModal} toggle={() => toggleEditEventModal(!editEventModal)}>
                <ModalHeader>Edit Event</ModalHeader>
                <ModalBody>
                    <label htmlFor='eventTitle'>Event Title</label>
                    <input value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} />

                    <div>
                        <label htmlFor='eventDescription'>Event Description</label>
                        <input value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} />
                    </div>
                    <label htmlFor='eventColor'>Event Color</label>
                    <ButtonGroup
                        className="btn-group-toggle btn-group-colors event-tag"
                        data-toggle="buttons"
                    >
                        <Button
                            className={classnames("bg-info", {
                                active: radios === "bg-info",
                            })}
                            type="button"
                            onClick={() => {
                                setColor('#11cdef')
                                setRadios("bg-info")
                            }}
                        />
                        <Button
                            className={classnames("bg-warning", {
                                active: radios === "bg-warning",
                            })}
                            color=""
                            type="button"
                            onClick={() => {
                                setColor('#fa3a0e')
                                setRadios("bg-warning")
                            }}
                        />
                        <Button
                            className={classnames("bg-danger", {
                                active: radios === "bg-danger",
                            })}
                            color=""
                            type="button"
                            onClick={() => {
                                setColor('#f5365c')
                                setRadios("bg-danger")
                            }}
                        />
                        <Button
                            className={classnames("bg-success", {
                                active: radios === "bg-success",
                            })}
                            color=""
                            type="button"
                            onClick={() => {
                                setColor('#24a46d')
                                setRadios("bg-success")
                            }}
                        />
                        <Button
                            className={classnames("bg-default", {
                                active: radios === "bg-default",
                            })}
                            color=""
                            type="button"
                            onClick={() => {
                                setColor('#0b1526')
                                setRadios("bg-default")
                            }}
                        />
                        <Button
                            className={classnames("bg-primary", {
                                active: radios === "bg-primary",
                            })}
                            color=""
                            type="button"
                            onClick={() => {
                                setColor('#324cdd')
                                setRadios("bg-primary")
                            }}
                        />
                    </ButtonGroup>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={() => setConfirmEdit(true)}>Edit event</Button>
                    <Button color="red" onClick={deleteEvent}>Delete event</Button>
                    <Button color="secondary" onClick={() => toggleEditEventModal(false)}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </>
    )
};