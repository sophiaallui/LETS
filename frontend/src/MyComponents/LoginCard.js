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
} from "reactstrap";

import NotificationAlerts from "MyComponents/common/NotificationAlert";

function LoginCard(props) {
  const [emailFocus, setEmailFocus] = React.useState("");
  const [passwordFocus, setPasswordFocus] = React.useState("");
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [errors, setErrors] = useState([1]);
  const history = useHistory();

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(form => ({ ...form, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await props.login(formData);
    if(res.success) {
      history.push("/profile")
    } else {
      setErrors(res.errors)
    }
  }

  console.debug(
    "LoginCard formData=", formData,
    "errors=", errors,
    "props are=", props
  )
  return (
    <> 
      {errors.length > 0 ?  <NotificationAlerts title="testing" message="something" type="danger" dissMissIn={2} /> : null}
     
      <Card className="bg-secondary shadow border-0">
        <CardHeader className="bg-white pb-5">
          <div className="text-muted text-center mb-3">
            <small>Login with</small>
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
                  src={require("assets/img/icons/common/github.svg")}
                ></img>
              </span>
              <span className="btn-inner--text">Github</span>
            </Button>
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
              </span>
              <span className="btn-inner--text">Google</span>
            </Button>
          </div>
        </CardHeader>
        <CardBody className="px-lg-5 py-lg-5">
          <div className="text-center text-muted mb-4">
            <small>Or login with credentials</small>
          </div>

          <Form onSubmit={handleSubmit}  role="form" >
            <FormGroup className={"mb-3 " + emailFocus}>
              <InputGroup className="input-group-alternative">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="ni ni-circle-08"></i>
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  placeholder="Username"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  onFocus={() => setEmailFocus("focused")}
                  onBlur={() => setEmailFocus("")}
                />
              </InputGroup>
            </FormGroup>
            <FormGroup className={passwordFocus}>
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
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setPasswordFocus("focused")}
                  onBlur={() => setPasswordFocus("")}
                />
              </InputGroup>
            </FormGroup>
            <div className="custom-control custom-control-alternative custom-checkbox">
              <input
                className="custom-control-input"
                id=" customCheckLogin2"
                type="checkbox"
              ></input>
              <label
                className="custom-control-label"
                htmlFor=" customCheckLogin2"
              >
                <span className="text-default opacity-5">Remember me</span>
              </label>
            </div>
            <div className="text-center">
              <Button className="my-4" color="primary" type="button" onSubmit={handleSubmit}>
                Login
              </Button>
            </div>
          </Form>
        </CardBody>
      </Card>
    </>
  );
}

export default LoginCard;
