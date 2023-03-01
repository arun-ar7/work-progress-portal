import { useEffect, useReducer } from "react";
// import { Router, Routes, Route } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import PrivateRoute, { PublicRoute } from "./components/custom/RoutesConfigure";
import LeaderDashboard from "./components/dashboardComponents/LeaderDashboard";
import MemberDashboard from "./components/dashboardComponents/MemberDashboard";
import MemberDetailsForLeader from "./components/dashboardComponents/MemberDetailsForLeader";
import { UserValueProvider } from "./components/misc/ValueContext";
import HomePage from "./components/Pages/HomePage";
import PageNotFound from "./components/Pages/PageNotFound";
import ProfilePage from "./components/Pages/ProfilePage";
import SignInPage from "./components/Pages/SignInPage";
import { firebaseauth } from "./firebase";

function App() {
  useEffect(() => {
    console.log("Hello");
    // console.log(firebaseauth.currentUser.email);
  });

  return (
    <>
      <UserValueProvider>
        <Router>
          <Routes>
            <Route>
              <Route element={<PublicRoute />}>
                <Route path="/signin" exact element={<SignInPage />} />
              </Route>
              <Route element={<PrivateRoute />}>
                <Route path="/profile" exact element={<ProfilePage />} />
              </Route>
              <Route element={<PrivateRoute />}>
                <Route
                  path="/leaderDashboard"
                  exact
                  element={<LeaderDashboard />}
                />
              </Route>
              <Route element={<PrivateRoute />}>
                <Route
                  path="/memberDashboard"
                  exact
                  element={<MemberDashboard />}
                />
              </Route>
              <Route element={<PrivateRoute />}>
                <Route
                  path="/leaderDashboard/memberView"
                  element={<MemberDetailsForLeader />}
                />
              </Route>
              <Route element={<PrivateRoute />}>
                <Route path="/" element={<HomePage />} />
              </Route>

              <Route path="*" element={<PageNotFound />} />
            </Route>
          </Routes>
        </Router>
      </UserValueProvider>
    </>
  );
}

export default App;
