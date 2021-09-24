import React, { useState, useContext } from "react";

// reactstrap components
import { Button, Label, FormGroup, Form, Input, Modal } from "reactstrap";
import UserContext from "UserContext";
import Api from "api/api";

function MessageModal({ sendTo }) {
  const { currentUser } = useContext(UserContext);
  const [text, setText] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [errors, setErrors] = useState([])
  const handleChange = e => {
    setText(e.target.value)
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([])
    const data = { text };
    try {
      const res = await Api.sendMessage(currentUser.username, sendTo, data);
      console.log(res)
    } catch(e) {
      console.error(e);
      setErrors(e)
    } 
  }
  return (
    <>
      <Button
        className="float-right"
        color="success"
        onClick={() => setModalOpen(!modalOpen)}
        type="button"
      >
        Message
      </Button>
      <Modal
        isOpen={modalOpen}
        toggle={() => setModalOpen(!modalOpen)}
        className="modal-dialog-centered"
      >
        <div className="modal-header">
          <h5 className="modal-title" id="exampleModalLabel">
            New message to {sendTo}
          </h5>
          <button
            aria-label="Close"
            className="close"
            onClick={() => setModalOpen(!modalOpen)}
            type="button"
          >
            <span aria-hidden={true}>×</span>
          </button>
        </div>
        <div className="modal-body bg-secondary">
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="recipient-name" className="col-form-label">
                Recipient:
              </Label>
              <FormGroup>
                <Input
                  disabled
                  className="form-control-alternative"
                  defaultValue={sendTo}
                  id="recipient-name"
                  type="text"
                />
              </FormGroup>
            </FormGroup>
            <FormGroup>
              <Label htmlFor="message-text" className="col-form-label">
                Message:
              </Label>
              <Input
                className="form-control-alternative"
                name="text"
                value={text}
                onChange={handleChange}
                id="message-text"
                type="textarea"
              />
            </FormGroup>
          </Form>
        </div>
        <div className="modal-footer bg-secondary">
          <Button
            color="secondary"
            onClick={() => setModalOpen(!modalOpen)}
            type="button"
          >
            Close
          </Button>
          <Button color="primary" type="button" onClick={handleSubmit}>
            Send message
          </Button>
        </div>
      </Modal>
    </>
  );
}

export default MessageModal;
