import React, { useState } from "react";
import { useHistory } from "react-router-dom";

const RegisterForm = (props) => {
  const history = useHistory();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formErrors, setFormErrors] = useState([]);

  console.debug(
    "RegisterForm",
    "signup=",
    props.signup,
    "formData=",
    formData,
    "formErrors=",
    formErrors
  );
  console.log(confirmPassword)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(confirmPassword !== formData.password) {
      setFormErrors([{ error : "password do not match" }])
      return;
    }
    const res = await props.signup(formData);
    if (res.success) {
      history.push("/");
    } else {
      setFormErrors(res.errors);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        username
        <input
          name="username"
          value={formData.username}
          type="text"
          onChange={handleChange}
        />
        password
        <input
          name="password"
          value={formData.password}
          type="password"
          onChange={handleChange}
        />
        confirm password
        <input
          name="confirmPassword"
          value={confirmPassword}
          type="password"
          onChange={e => {
            setConfirmPassword(e.target.value)
          }}
        />
        email
        <input
          name="email"
          value={formData.email}
          type="email"
          onChange={handleChange}
        />
        first name
        <input
          name="firstName"
          value={formData.firstName}
          type="text"
          onChange={handleChange}
        />
        last name
        <input
          name="lastName"
          value={formData.lastName}
          type="text"
          onChange={handleChange}
        />
        <button onSubmit={handleSubmit}>Submit</button>
      </form>
    </div>
  );
};

export default RegisterForm;
