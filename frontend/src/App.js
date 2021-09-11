import React, { useState, useEffect } from "react";
import NavBar from './components/NavBar';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import './App.css';
import Progress from './pages/Progress';
import Messenger from './pages/Messenger';

import Api from "./api/api";
import jwt from "jsonwebtoken";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [infoLoaded, setInfoLoaded] = useState(false);
  const [token, setToken] = useState(null);
  console.debug(
    "App",
    "infoLoaded=", infoLoaded,
    "token=", token,
    "currentUser", currentUser
  );

  useEffect(() => {
    console.debug("App useEffect loadUserInfo", "token=", token);

    const getCurrentUser = async () => {
      if(token) {
        try {
          const { username } = jwt.decode(token);
          // put the token on the Api class so we can use it to call the Api.d
          Api.token = token;
          let currentUser = await Api.getCurrentUser(username);
          setCurrentUser(currentUser);
        } 
        catch(e) {
          console.error("App loadUserInfo: problem loading", e);
          setCurrentUser(null);
        }
      }
      setInfoLoaded(true);
    }
    
    setInfoLoaded(false);
    getCurrentUser();
  }, [token]);

  const signup = async (signUpData) => {
    try {
      const token = await Api.register(signUpData);
      setToken(token);
      return { success : true };
    } catch(errors) {
      console.error("signup failed", errors);
      return { success : false, errors }
    }
  }

  const login = async (loginData) => {
    try {

    } catch(errors) {
      console.error("")
    }
  } 
 
  return (
    <Router>
      <div >
        <nav>
          <NavBar />
        </nav>
        <Switch>
          <Route path="/" exact>
            <strong style={{color:"pink"}}>Welcome Homeeeee ^.^ </strong>
          </Route>
          <Route path="/progress" >
            <strong style={{color:"pink"}}>progresssss~ 💪🏼🥺</strong>
            <Progress/>
          </Route>
          <Route path="/messenger" >
            <strong style={{color:"#ADB4A2"}}>LETS GET THEM GAINZ BOOOIZ~ 💪🏼🥺💪🏼</strong>
            <Messenger/>
          </Route>

        </Switch>
      </div>
    </Router>

  );
}

export default App;
