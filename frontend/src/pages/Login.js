import React, { useState } from "react";
import { useHistory } from "react-router";

const LoginForm = (props) => {
  const history = useHistory();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState([]);
  console.debug(
    "LoginForm",
    "login=",typeof props.login,
    "formData=",formData,
    "formErrors=",formErrors
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name] : value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await props.login(formData);
    if(res.success) {
      history.push("/")
    } else {
      setFormErrors(res.errors)
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input 
          name="username"
          type="text"
          value={formData.username}
          onChange={handleChange}
          autoComplete="username"
          required 
        />
        <input 
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          autoComplete="current-password"
          required 
        />
        <button onSubmit={handleSubmit}>Submit</button>
      </form>
    </div>
  )
};

export default LoginForm;