import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Modal,
} from "reactstrap";
import UserContext from "UserContext";
import ImageUpload from "MyComponents/common/ImageUpload";
import Api from "api/api";


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
  const [file, setFile] = useState(null);

  const toggleModalState = () => {
    setModalOpen(open => !open);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(formData => ({ ...formData, [name]: value }))
  }

  const handleSubmit = async e => {
    const newPost = { ...formData }
    e.preventDefault();
    if(file) {
      const data = new FormData();
      const filename = Date.now() + file.name;
      data.append("name", filename);
      data.append("file", file)
      newPost.image = filename;
      console.log(newPost)
      try {
        await Api.request(`api/images`, data, "POST")
      } catch(e) {}
    }
    try { 
      await Api.createPost(currentUser.username, newPost, "POST");
      window.location.reload();
    } catch(e) {}
    console.log("from newPostFormModal" ,file);
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
                  <ImageUpload setFile={setFile} />
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
                <Button onSubmit={handleSubmit}>Post</Button>
              </Form>
            </CardBody>
          </Card>
        </div>
      </Modal>
    </>
  );
}

export default NewPostFormModal