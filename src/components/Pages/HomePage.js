import Footer from "../Footer";
import Header from "../Header";
import TeamLeader from "../HomeComponents/TeamLeader";
import TeamMember from "../HomeComponents/TeamMember";
import { useUserContext } from "../misc/ValueContext";
import "./styles/Home.style.css";

const HomePage = () => {
  const { user } = useUserContext();
  return (
    <div>
      <Header />
      <div className="GreetingsClass">
        <div className="DisplayWelcome">
          {`Welcome....${user.userDetails.displayName}`}
        </div>
        <div className="DisplayWelcome">Email : {user.userDetails.email}</div>
      </div>
      <TeamLeader />
      <TeamMember />
      <div>HomePage</div>
      <Footer />
    </div>
  );
};

export default HomePage;
