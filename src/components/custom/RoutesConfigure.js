import React, { useEffect } from "react";
import { Outlet, Navigate, useNavigate } from "react-router-dom";
import { useUserContext } from "../misc/ValueContext";
import SignInPage from "../Pages/SignInPage";
import { useUser } from "./CustomStates";

const PrivateRoute = () => {
  const { user, dispatchUser } = useUserContext();
  const navigate = useNavigate();
  useEffect(() => {});

  if (user.isLoggedIn) {
    // console.log("logged in");
    return <Outlet />;
  } else {
    // console.log("not logged in");
    // navigate("/signin");
    return <Navigate to="/signin" />;
  }
};

export const PublicRoute = () => {
  const { user, dispatchUser } = useUserContext();
  if (user.isLoggedIn) {
    // console.log("logged in");
    return <Navigate to="/" />;
  } else {
    // console.log("not logged in");
    return <Outlet />;
  }
};

export default PrivateRoute;
