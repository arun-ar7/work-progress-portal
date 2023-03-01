import React, { useState } from "react";
import "./compStyles/headerStyle.css";
import { useUserContext } from "./misc/ValueContext";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./compStyles/dropDownStyle.css";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoPersonCircle } from "react-icons/io5";
const Header = () => {
  const { user, dispatchUser } = useUserContext();
  //hamberger state
  const [menuToggle, setMenuToggle] = useState(true);
  const navigate = useNavigate();
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
  const goBackFunction = () => {
    navigate(-1);
  };

  // for dropdown functions
  function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
  }

  // Close the dropdown menu if the user clicks outside of it
  window.onclick = function (event) {
    if (!event.target.matches(".dropbtn")) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains("show")) {
          openDropdown.classList.remove("show");
        }
      }
    }
  };
  //function to navigate to profile route
  const navigateToProfilePage = () => {
    navigate("/profile");
  };
  //toggle hamburger
  const toggleMenu = () => {
    setMenuToggle((prevState) => {
      return !prevState;
    });
  };
  // end for dropdown functions

  return (
    <div className="HeaderContainer">
      {user.isLoggedIn ? (
        <div
          className="goBackButton"
          style={{ cursor: "pointer" }}
          onClick={goBackFunction}
        >
          {"<-"}
        </div>
      ) : (
        <div></div>
      )}
      <div className="HeaderText">
        <div>work-progress-portal</div>
      </div>
      {user.isLoggedIn ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          className="menuBar"
        >
          <div className="menuContainer">
            <div
              className={`menuDropDown ${menuToggle ? "showClass" : ""}`}
              // style={{ display: menuToggle ? "block" : "none" }}
            >
              <div
                className="menuItems"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  cursor: "pointer",
                  alignItems: "center",
                }}
                onClick={navigateToProfilePage}
              >
                <IoPersonCircle />
                Profile
              </div>
              <div className="LogoutButton menuItems" onClick={LogoutFunction}>
                Logout
              </div>
            </div>
            <div className="menuItems" onClick={toggleMenu} id="menuIcon">
              <GiHamburgerMenu />
            </div>
          </div>

          {/* hamburger end */}
        </div>
      ) : (
        <div></div>
      )}
      {/* <div></div> */}
    </div>
  );
};

export default Header;
