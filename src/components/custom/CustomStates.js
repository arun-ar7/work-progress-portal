import { useEffect, useReducer } from "react";
import { useCookies } from "react-cookie";
import { getDatabase, ref, child, get } from "firebase/database";
import { firebaseauth } from "../../firebase";

function userReducer(prevState, action) {
  switch (action.type) {
    case "newUser": {
      return { userDetails: action.userDetails, isLoggedIn: true };
    }
    case "deleteUser": {
      return { userDetails: null, isLoggedIn: false };
    }
    default:
      return prevState;
  }
}

export const useUser = () => {
  const [user, dispatchUser] = useReducer(userReducer, {
    userDetails: {},
    isLoggedIn: false,
  });

  const [cookies, setCookie, removeCookie] = useCookies(["uid"]);
  useEffect(() => {
    let userCookie = cookies.uid;
    firebaseauth.onAuthStateChanged((authObj) => {
      // console.log("authObj : ", authObj);
      if (authObj != null) {
        dispatchUser({ type: "newUser", userDetails: authObj });
      } else {
        dispatchUser({ type: "deleteUser" });
      }
    });
    // if (cookies.uid) {
    //   const dbRef = ref(getDatabase());
    //   get(child(dbRef, `profiles/${userCookie}`))
    //     .then((snapshot) => {
    //       if (snapshot.exists()) {
    //         console.log("From database : ", snapshot.val());
    //         dispatchUser({ type: "newUser", userDetails: snapshot.val() });
    //       } else {
    //         console.log("No data available");
    //       }
    //     })
    //     .catch((error) => {
    //       console.error(error);
    //     });
    // }
  }, []);
  return [user, dispatchUser];
};
