import { FcGoogle } from "react-icons/fc";
import React from "react";
import { serverTimestamp } from "firebase/firestore";
import {
  GoogleAuthProvider,
  signInWithPopup,
  getAdditionalUserInfo,
} from "firebase/auth";
import { firebaseauth, database } from "../../firebase";
import { getDatabase, ref, set } from "firebase/database";
// import { useUser } from "../custom/CustomStates";
import { Navigate, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useUserContext } from "../misc/ValueContext";

const Signin = () => {
  const { user, dispatchUser } = useUserContext();
  const [cookie, setCookie, removeCookie] = useCookies(["name"]);
  const navigate = useNavigate();
  const signInWithProvider = async (provider) => {
    try {
      const result = await signInWithPopup(firebaseauth, provider);
      const additionalUserInfo = getAdditionalUserInfo(result);
      dispatchUser({ type: "newUser", userDetails: result.user });
      setCookie("uid", result.user.uid, { path: "/", maxAge: 3600 });

      if (additionalUserInfo.isNewUser) {
        const db = getDatabase();
        await set(ref(db, "profiles/" + result.user.uid), {
          name: result.user.displayName,
          email: additionalUserInfo.profile.email,
          role: "member",
          createdAt: Date.now(),
        });
        //break
        // await database.ref(`/profiles/${user.uid}`).set({
        //   name: user.displayName,
        //   email: additionalUserInfo.profile.email,
        //   role: "member",
        //   createdAt: serverTimestamp,
        // });
      }
      // return <Navigate to="/" />;
      navigate("/");
    } catch (error) {
      console.log("inside error ", error);
    }
  };
  const onGoogleSignin = () => {
    signInWithProvider(new GoogleAuthProvider());
  };
  return (
    <div className="SigninComponent">
      <div className="SigninContainer">
        <button onClick={onGoogleSignin}>
          <div className="GoogleIcon">
            <FcGoogle />
          </div>
          <div className="SigninButtonContent">SignInWithGoogle</div>
        </button>
      </div>
    </div>
  );
};

export default Signin;
