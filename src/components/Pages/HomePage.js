import Footer from "../Footer";
import Header from "../Header";
import TeamLeader from "../HomeComponents/TeamLeader";
import TeamMember from "../HomeComponents/TeamMember";
import { useUserContext } from "../misc/ValueContext";

const HomePage = () => {
  const { user } = useUserContext();
  return (
    <div>
      <Header />
      <div className="DisplayWelcome">
        {`Welcome.... ${user.userDetails.displayName}`}
      </div>
      <TeamLeader />
      <TeamMember />
      <div>HomePage</div>
      <Footer />
    </div>
  );
};

export default HomePage;
