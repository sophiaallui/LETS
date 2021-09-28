import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  TextArea,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Modal,
} from "reactstrap";
import UserContext from "UserContext";
import ImageUpload from "components/upload/Upload";
// CREATE TABLE posts (
//   id SERIAL PRIMARY KEY,
//   posted_by VARCHAR(25) REFERENCES users(username) ON DELETE CASCADE,
//   content TEXT NOT NULL,
//   created_at TIMESTAMP NOT NULL DEFAULT NOW() 
// );

const NewPostFormModal = ({ buttonText }) => {

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

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(formData => ({ ...formData, [name]: value }))
  }

  const handleSubmit = e => {
    e.preventDefault();

  }

  return (
    <>
      <Button color="info" type="button" onClick={toggleModalState}>
        {buttonText}
      </Button>
      <Modal className="modal-dialog-centered modal-md" isOpen={modalOpen} toggle={toggleModalState}>
        <div className="modal-body p-0">
          <Card className="bg-secondary shadow border-0 mb-0">
            <CardHeader className="bg-warning">
              <h2 className="text-white">New Post</h2>
            </CardHeader>
            <CardBody className="">
              <Form role="form" onSubmit={handleSubmit}>
                <FormGroup>
                  <ImageUpload />
                </FormGroup>
                <FormGroup>
                  <div>Content</div>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    rows={5}
                    cols={50}
                  />
                </FormGroup>
                <Button>Post</Button>
              </Form>
            </CardBody>
          </Card>
        </div>
      </Modal>
    </>
  );
}

export default NewPostFormModal