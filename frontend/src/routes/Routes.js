import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import Messenger from "pages/Messenger";
import Login from "pages/Login";
import Register from "pages/Register";
import Profile from "pages/UserProfile";
import LandingPage from "pages/Landing";
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
    `login=${typeof props.login}, signup=${typeof props.signup}`
  );
  return (
    <Switch>
      <Route path="/" exact>
        <LandingPage signup={props.signup} />
      </Route>
      
      <Route path="/progress" exact>
        <strong style={{ color: "pink" }}>progresssss~ 💪🏼🥺</strong>
      </Route>
      
      <Route path="/messenger" exact>
        <Messenger />
      </Route>
      
      <PrivateRoute exact path="/profile/:username">
        <Profile />
      </PrivateRoute>
      
      <Route path="/login" exact>
        <Login login={props.login} />
      </Route>
      
      <Route path="/register" exact>
        <Register signup={props.signup} login={props.login} />
      </Route>

      <Redirect to="/" />
    </Switch>
  );
};

export default Routes;
