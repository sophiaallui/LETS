import React from "react";
// react plugin for creating notifications over the dashboard
import NotificationAlert from "react-notification-alert";
// reactstrap components
import {
  Button,
} from "reactstrap";

class Notifications extends React.Component {
  props = {
    title : "",
    message : "",
    type : "default",
    dissMissIn : 7
  }
  notify = () => {
    let options = {
      place: "tc",
      message: (
        <div className="alert-text">
          <span className="alert-title" data-notify="title">
            {this.props.title}
          </span>
          <span data-notify="message">
            {this.props.message}
          </span>
        </div>
      ),
      type: this.props.type,
      icon: "ni ni-bell-55",
      autoDismiss: this.props.dissMissIn
    };
    this.refs.notificationAlert.notificationAlert(options);
  };
  render() {
    return (
      <>
        <div className="rna-wrapper">
          <NotificationAlert  ref="notificationAlert" />
        </div>
      </>
    );
  }
}

export default Notifications;