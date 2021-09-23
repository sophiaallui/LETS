import React, { useState } from "react";
import { useHistory } from "react-router-dom";
// reactstrap components
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

// Core Components
import ErrorModal from "MyComponents/common/ModalNotification";

function ModalSignup(props) {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [signupNameFocus, setSignupNameFocus] = React.useState("");
  const [signupEmailFocus, setSignupEmailFocus] = React.useState("");
  const [signupUsernameFocus, setSignupUsernameFocus] = React.useState("");
  const [signupPasswordFocus, setSignupPasswordFocus] = React.useState("");
  const [signupConfirmPasswordFocus, setSignupConfirmPasswordFocus] = React.useState("");
  const history = useHistory();
  const [signupData, setSignupData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState([]);

  const handleSignupChange = e => {
    const { name, value } = e.target;
    setSignupData(formData => ({ ...formData, [name]: value }))
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const { password, confirmPassword } = signupData;
    if(password !== confirmPassword) {
      setErrors(["Passwords do not match"])
      return
    }
    const copied = { ...signupData }
    delete copied[confirmPassword];
    const res = await props.signup(copied);
    if(res.sucess) {
      history.push("/profile/" + signupData.username)
    } else {
      setErrors(res.errors)
    }
  }
  return (
    <>
      <Button
        block
        color="info"
        onClick={() => setModalOpen(!modalOpen)}
        type="button"
      >
        {props.buttonText}
      </Button>
      <Modal
        isOpen={modalOpen}
        toggle={() => setModalOpen(!modalOpen)}
        className="modal-dialog-centered modal-sm"
      >
        <div className="modal-body p-0">
          <Card className="bg-secondary shadow border-0 mb-0">
            <CardHeader className="bg-white pb-5">
              <div className="text-muted text-center mb-3">
                <small>Sign Up with</small>
              </div>
              <div className="btn-wrapper text-center">
                <Button
                  className="btn-neutral btn-icon"
                  color="default"
                  href="#pablo"
                  onClick={(e) => e.preventDefault()}
                >
                  <span className="btn-inner--icon">
                    <img
                      alt="..."
                      src={require("assets/img/icons/common/google.svg")}
                    ></img>
                  </span>{" "}
                  <span className="btn-inner--text">Google</span>
                </Button>{" "}
                <Button
                  className="btn-neutral btn-icon"
                  color="default"
                  href="#pablo"
                  onClick={(e) => e.preventDefault()}
                >
                  <span className="btn-inner--icon">
                    <img
                      alt="..."
                      src={require("assets/img/icons/common/github.svg")}
                    ></img>
                  </span>{" "}
                  <span className="btn-inner--text">Github</span>
                </Button>
              </div>
            </CardHeader>
            <CardBody className="px-lg-5 py-lg-5">
              <div className="text-center text-muted mb-4">
                <small>Or sign up here:</small>
              </div>

              <Form role="form" onSubmit={handleSubmit}>
                <FormGroup className={"mb-3 " + signupNameFocus}>
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-circle-08"></i>
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Firstname"
                      type="text"
                      name="firstName"
                      onChange={handleSignupChange}
                      value={signupData.firstName}
                      onFocus={() => setSignupNameFocus("focused")}
                      onBlur={() => setSignupNameFocus("")}
                    ></Input>
                    <Input
                      placeholder="Lastname"
                      type="text"
                      name="lastName"
                      value={signupData.lastName}
                      onChange={handleSignupChange}
                      onFocus={() => setSignupNameFocus("focused")}
                      onBlur={() => setSignupNameFocus("")}
                    ></Input>
                  </InputGroup>
                </FormGroup>

                <FormGroup className={"mb-3 " + signupUsernameFocus}>
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-circle-08"></i>
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="username"
                      type="text"
                      name="username"
                      onChange={handleSignupChange}
                      value={signupData.username}
                      onFocus={() => setSignupUsernameFocus("focused")}
                      onBlur={() => setSignupUsernameFocus("")}
                    ></Input>
                  </InputGroup>
                </FormGroup>

                <FormGroup className={"mb-3 " + signupEmailFocus}>
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-email-83"></i>
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Email"
                      type="email"
                      name="email"
                      value={signupData.email}
                      onChange={handleSignupChange}
                      onFocus={() => setSignupEmailFocus("focused")}
                      onBlur={() => setSignupEmailFocus("")}
                    ></Input>
                  </InputGroup>
                </FormGroup>

                <FormGroup className={signupPasswordFocus}>
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-lock-circle-open"></i>
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Password"
                      type="password"
                      name="password"
                      value={signupData.password}
                      onChange={handleSignupChange}
                      onFocus={() => setSignupPasswordFocus("focused")}
                      onBlur={() => setSignupPasswordFocus("")}
                    ></Input>
                  </InputGroup>

                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-lock-circle-open"></i>
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Confirm Password"
                      type="password"
                      name="confirmPassword"
                      value={signupData.confirmPassword}
                      onChange={handleSignupChange}
                      onFocus={() => setSignupConfirmPasswordFocus("focused")}
                      onBlur={() => setSignupConfirmPasswordFocus("")}
                    ></Input>
                  </InputGroup>
                </FormGroup>

                <Button onSubmit={handleSubmit} color="primary">Sign Up</Button>
              </Form>
            </CardBody>
          </Card>
        </div>
        {errors.length > 0 ? <ErrorModal title="Error" message={errors[0]} /> : null}
      </Modal>
    </>
  );
}

export default ModalSignup;
