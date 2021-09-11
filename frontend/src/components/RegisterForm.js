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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await props.signuip(formData);
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
        
      </form>
    </div>
  )
};

export default RegisterForm;