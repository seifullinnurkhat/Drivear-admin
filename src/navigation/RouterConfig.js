import React from "react";
import { Redirect, Route, Router, Switch } from "react-router-dom";
import { history } from "../history";
import Profile from "../pages/MyCabinet/Profile";
import Reviews from "../pages/MyCabinet/Reviews";
import OrdersAccepted from "../pages/Orders/OrdersAccepted";
import OrdersDeclined from "../pages/Orders/OrdersDeclined";
import OrdersInbox from "../pages/Orders/OrdersInbox";
import OrdersSchedule from "../pages/Orders/OrdersSchedule";
import Services from "../pages/Services/Services";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import PrivateRoute from "./PrivateRoute";

function RouterConfig() {
  return (
    <Router history={history}>
      <div style={{ height: "100vh" }}>
        <Switch>
          <Route exact path="/">
            <Redirect to="/login" />
          </Route>
          <Route path="/register">
            <SignUp />
          </Route>
          <Route path="/login">
            <SignIn />
          </Route>
          <Route exact path="/orders">
            <Redirect to="/orders/schedule" />
          </Route>
          <PrivateRoute path="/orders/schedule" component={OrdersSchedule} />
          <PrivateRoute path="/orders/inbox" component={OrdersInbox} />
          <PrivateRoute path="/orders/accepted" component={OrdersAccepted} />
          <PrivateRoute path="/orders/declined" component={OrdersDeclined} />
          <PrivateRoute path="/services" component={Services} />
          <PrivateRoute path="/cabinet/profile" component={Profile} />
          <PrivateRoute path="/cabinet/reviews" component={Reviews} />
        </Switch>
      </div>
    </Router>
  );
}

export default RouterConfig;
