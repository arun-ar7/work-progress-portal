import React from "react";
import "./compStyles/headerStyle.css";
import { useUserContext } from "./misc/ValueContext";
import { getAuth, signOut } from "firebase/auth";

const Header = () => {
  const { user, dispatchUser } = useUserContext();
  const LogoutFunction = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        dispatchUser({ type: "deleteUser" });
        console.log("Signed out successfully");
      })
      .catch((error) => {
        console.log("error in signing out : ", error);
      });
  };

  return (
    <div className="HeaderContainer">
      <div></div>
      <div className="HeaderText">work-progress-portal</div>
      <div className="LogoutButton" onClick={LogoutFunction}>
        Logout
      </div>
    </div>
  );
};

export default Header;
