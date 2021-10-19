import React, { useState, useRef } from "react";

import ReactBSAlert from "react-bootstrap-sweetalert";
import { Button } from "reactstrap";

const Alert = ({ deletePost, children }) => {
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
        onConfirm={() => {
          deletePost();
          confirmedAlert();
        }}
        onCancel={hideAlert}
        showCancel
        confirmBtnBsStyle="danger"
        confirmBtnText="Yes, delete it!"
        cancelBtnBsStyle="secondary"
        cancelBtnText="Cancel"
        btnSize=""
      >
        You won't be able to revert this!
      </ReactBSAlert>
    );
  };
  const confirmedAlert = () => {
    setState(
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
    );
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
        {children}
      </Button>
    </>
  );
};

export default Alert;
