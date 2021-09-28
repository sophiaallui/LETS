import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Modal,
} from "reactstrap";
import UserContext from "UserContext";

// CREATE TABLE posts (
//   id SERIAL PRIMARY KEY,
//   posted_by VARCHAR(25) REFERENCES users(username) ON DELETE CASCADE,
//   content TEXT NOT NULL,
//   created_at TIMESTAMP NOT NULL DEFAULT NOW() 
// );

const NewPostFormModal = props => {

  function getCurrentDateTime() {
    const today = new Date();
    const y = today.getFullYear();
    const m = today.getMonth();
    const d = today.getDate();
    const hr = today.getHours();
    const mins = today.getMinutes();
    return new Date(y, m, d, hr, mins);
  }

  const { currentUser } = useContext(UserContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    postedBy: currentUser.username,
    content: "",
    createdAt: getCurrentDateTime()
  });

  const toggleModalState = () => {
    setModalOpen(open => !open);
  };

  return (
    <>
      <Button color="info" type="button" onClick={toggleModalState}>
        {props.buttonText}
      </Button>
      <Modal className="modal-dialog-centered modal-md" isOpen={modalOpen} toggle={toggleModalState}>
        <div className="modal-body p-0">
          <Card className="bg-secondary shadow border-0 mb-0">
            <h5>New Post</h5>
          </Card>
        </div>
      </Modal>
    </>
  );
}

export default NewPostFormModal