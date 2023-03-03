import React from "react";
import Footer from "../Footer";
import Header from "../Header";
import Signin from "./Signin";
import "./signinStyles/signinStyle.css";

const SignInPage = () => {
  return (
    <div>
      <Header />
      <Signin />
      <Footer />
    </div>
  );
};

export default SignInPage;
