import React, { useRef } from "react";
// react plugin for creating notifications over the dashboard
import NotificationAlert from "react-notification-alert";
// reactstrap components
import { Button } from "reactstrap";

const Notifications = props => {
  const notificationAlert = useRef("notificationAlert");
  const notify = place => {
    let options = {
      place,
      message: (
        <div>
          <span className="alert-title" data-notify="title">
            {" "}
            Bootstrap Notify
          </span>
          <span data-notify="message">
            Turning standard Bootstrap alerts into awesome notifications
          </span>
        </div>
      ),
      type : "default",
      icon : "ni ni-bell-55",
      autoDismiss : 5
    };
    notificationAlert.current.notificationAlert(options)
  };
  return (
    <>
      <div className="rna-wrapper">
        <NotificationAlert ref={notificationAlert} />
      </div>
      <Button color="default" onClick={() => notify("tc")} />
    </>
  )
}


export default Notifications;