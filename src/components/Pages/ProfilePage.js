import { child, get, getDatabase, ref } from "firebase/database";
import React, { useState } from "react";
import { useEffect } from "react";
import Footer from "../Footer";
import Header from "../Header";
import { useUserContext } from "../misc/ValueContext";
import "./styles/ProfilePage.css";

const ProfilePage = () => {
  //states
  const { user } = useUserContext();
  const [userProfile, setUserProfile] = useState({});
  useEffect(() => {
    const dbRef = ref(getDatabase());
    get(child(dbRef, `profiles/${user.userDetails.uid}`)).then((snapshot) => {
      setUserProfile(snapshot.val());
    });
  }, []);
  return (
    <>
      <Header />
      <div className="profileSection">
        <div className="profileContainer">
          <img
            src={`${user.userDetails.photoURL}`}
            className="imgClass"
            alt="Profile"
          />
          <div>Name : {`${user.userDetails.displayName}`}</div>
          <div>Email : {`${user.userDetails.email}`}</div>
          <div>
            Account created at :{" "}
            {`${new Date(
              parseInt(user.userDetails.metadata.createdAt)
            ).toDateString()}`}
          </div>
          <div>
            Last Login at :{" "}
            {`${new Date(
              parseInt(user.userDetails.metadata.lastLoginAt)
            ).toDateString()}`}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProfilePage;
