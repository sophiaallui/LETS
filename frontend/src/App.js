import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, useHistory } from "react-router-dom";
import "./App.css";

// import Routes from "./routes/Routes";
import Api from "./api/api";
import jwt from "jsonwebtoken";
import UserContext from "./UserContext";

import NavBar from "MyComponents/Navbar";
import LandingPage from "pages/Landing";

import Index from "views/Index";



function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [infoLoaded, setInfoLoaded] = useState(false);
  const [token, setToken] = useState(null);
  const history = useHistory();
  console.debug(
    "App",
    "infoLoaded=",
    infoLoaded,
    "token=",
    token,
    "currentUser",
    currentUser
  );

  useEffect(() => {
    console.debug("App useEffect loadUserInfo", "token=", token);

    const getCurrentUser = async () => {
      if (token) {
        try {
          const { username } = jwt.decode(token);
          // put the token on the Api class so we can use it to call the Api.d
          Api.token = token;
          let currentUser = await Api.getCurrentUser(username);
          setCurrentUser(currentUser);
        } catch (e) {
          console.error("App loadUserInfo: problem loading", e);
          setCurrentUser(null);
        }
      }
      setInfoLoaded(true);
    };

    setInfoLoaded(false);
    getCurrentUser();
  }, [token]);

  const signup = async (signUpData) => {
    try {
      const token = await Api.register(signUpData);
      setToken(token);
      return { success: true };
    } catch (errors) {
      console.error("signup failed", errors);
      return { success: false, errors };
    }
  };

  const login = async (loginData) => {
    try {
      const token = await Api.login(loginData);
      setToken(token);
      return { success: true };
    } catch (errors) {
      console.error("login failed", errors);
      return { success: false, errors };
    }
  };

  const logout = () => {
    setToken(null);
    setCurrentUser(null);
    history.push("/");
  };

  return (
    <Router>
      <UserContext.Provider value={{ currentUser, setCurrentUser }}>
        <div>
          <NavBar />
          <LandingPage />
        </div>
      </UserContext.Provider>
    </Router>
  );
}

export default App;
