import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import Messenger from "pages/Messenger";
import Login from "pages/Login";
import Register from "pages/Register";
import Profile from "pages/UserProfile";
import LandingPage from "pages/Landing";
import PrivateRoute from "./PrivateRoute";
import EditProfile from "pages/EditProfile";
import Goal from "pages/Goal";
/** Site-wide routes.
 *
 * Parts of site should only be visitable when logged in. Those routes are
 * wrapped by <PrivateRoute>, which is an authorization component.
 *
 * Visiting a non-existant route redirects to the homepage.
 */
const Routes = ({ signup, events, login, addEvent }) => {
  console.debug(
    "Routes",
    `login=${typeof login}, signup=${typeof signup}`
  );
  return (
    <Switch>
      <Route path="/" exact>
        <LandingPage signup={signup} />
      </Route>
      
      <Route path="/progress" exact>
        
      </Route>
      
      <PrivateRoute path="/schedules">
        <Goal events={events} addEvent={addEvent} />
      </PrivateRoute>

      <PrivateRoute path="/edit-profile">
        <EditProfile />
      </PrivateRoute>

      <PrivateRoute path="/messenger" exact>
        <Messenger />
      </PrivateRoute>
      
      <PrivateRoute exact path="/profile/:username">
        <Profile />
      </PrivateRoute>
      
      <Route path="/login" exact>
        <Login login={login} />
      </Route>
      
      <Route path="/register" exact>
        <Register signup={signup} login={login} />
      </Route>

      <Redirect to="/" />
    </Switch>
  );
};

export default Routes;
