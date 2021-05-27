import React, { useEffect } from "react";
import { Redirect, Route, useHistory } from "react-router-dom";

function PrivateRoute({ component, path, exact }) {
  const performValidationHere = () => {
    const userId = localStorage.getItem("userId");

    console.log(userId);
    if (!userId) {
      return false;
    }
    return true;
  };

  const condition = performValidationHere();
  return condition ? (
    <Route path={path} exact={exact} component={component} />
  ) : (
    <Redirect to="/login" />
  );
}
export default PrivateRoute;
