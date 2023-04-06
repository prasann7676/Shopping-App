// This is protected route component which will ensure user is not undefined or not logged in
// Before accessing these components passed int he parameters of this component.
import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { redirect, Route } from "react-router-dom";

const ProtectedRoute = ({ isAdmin, component: Component, ...rest }) => {
  const { loading, isAuthenticated, user } = useSelector((state) => state.user);

  return (
    <>
      {loading === false && (
        <Route
          {...rest}
          render={(props) => {
            if (isAuthenticated === false) {
              return <redirect to="/login" />;
            }

            if (isAdmin === true && user.role !== "admin") {
              return <redirect to="/login" />;
            }

            return <Component {...props} />;
          }}
        />
      )}
    </>
  );
};

export default ProtectedRoute;