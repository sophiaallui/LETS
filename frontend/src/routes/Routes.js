import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import Progress from "../pages/Progress";
import Messenger from "../pages/Messenger";
import Login from "../pages/Login";
import RegisterForm from "../components/RegisterForm";
import Profile from "../pages/Profile";
import PrivateRoute from "./PrivateRoute";

/** Site-wide routes.
 *
 * Parts of site should only be visitable when logged in. Those routes are
 * wrapped by <PrivateRoute>, which is an authorization component.
 *
 * Visiting a non-existant route redirects to the homepage.
 */
const Routes = (props) => {
  console.debug(
    "Routes",
    `login=${typeof props.login}, register=${typeof props.register}`
  );
  return (
    <Switch>
      <Route path="/" exact>
        <strong style={{ color: "pink" }}>Welcome Homeeeee ^.^ </strong>
      </Route>
      
      <PrivateRoute path="/progress">
        <strong style={{ color: "pink" }}>progresssss~ 💪🏼🥺</strong>
        <Progress />
      </PrivateRoute>
      
      <PrivateRoute path="/messenger">
        <strong style={{ color: "#ADB4A2" }}>
          LETS GET THEM GAINZ BOOOIZ~ 💪🏼🥺💪🏼
        </strong>
        <Messenger />
      </PrivateRoute>
      
      <PrivateRoute exact path="/profile/:username">
        <Profile />
      </PrivateRoute>
      
      <Route path="/login">
        <Login login={props.login} />
      </Route>
      
      <Route path="/register">
        <RegisterForm signup={props.signup} />
      </Route>

      <Redirect to="/" />
    </Switch>
  );
};

export default Routes;
