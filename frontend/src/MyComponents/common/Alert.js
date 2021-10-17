import React, { useState, useRef } from "react";

import ReactBSAlert from "react-bootstrap-sweetalert";
import { Button } from "reactstrap";

const Alert = () => {
  const [state, setState] = useState(null);
  const hideAlert = () => {
    setState(null);
  };
  const confirmAlert = () => {
    setState(
      <ReactBSAlert
        warning
        style={{ display: "block", marginTop: "-100px" }}
        title="Are you sure?"
        onConfirm={() => hideAlert()}
        onCancel={confirmedAlert}
        showCancel
        confirmBtnBsStyle="secondary"
        confirmBtnText="Cancel"
        cancelBtnBsStyle="danger"
        cancelBtnText="Yes, delete it!"
        btnSize=""
      >
        You won't be able to revert this!
      </ReactBSAlert>
    );
  };
  const confirmedAlert = () => {
    this.setState({
      alert: (
        <ReactBSAlert
          success
          style={{ display: "block", marginTop: "-100px" }}
          title="Deleted!"
          onConfirm={() => hideAlert()}
          onCancel={() => hideAlert()}
          confirmBtnBsStyle="primary"
          confirmBtnText="Ok"
          btnSize=""
        >
          Your file has been deleted.
        </ReactBSAlert>
      ),
    });
  };
  return (
    <>
      {state}
      <Button
        className="btn-icon"
        color="danger"
        size="sm"
        type="button"
        onClick={confirmAlert}
      >

      </Button>
    </>
  );
};

export default Alert;
