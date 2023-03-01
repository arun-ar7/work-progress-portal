import React, { useEffect, useState } from "react";
import { getDatabase, ref, child, get, onValue } from "firebase/database";
import { useUserContext } from "../misc/ValueContext";
import TeamLeaderModal from "./TeamLeaderModal";
import { useNavigate } from "react-router-dom";

const TeamLeader = () => {
  const { user } = useUserContext();
  const [teamsAsLeader, setTeamsAsLeader] = useState([]);
  const navigate = useNavigate();

  const dbRef = ref(getDatabase());
  useEffect(() => {
    const db = getDatabase();
    const teamRef = ref(db, `profiles/${user.userDetails.uid}/teamsAsLeader`);
    onValue(teamRef, (snapshot) => {
      // if (snapshot != null && snapshot != undefined) {
      const data = snapshot.val();
      if (data) {
        const dataArr = Object.values(Object.values(data));
        setTeamsAsLeader(dataArr);
      }
      // console.log(Object.values(Object.values(data)));
      // }
    });
  }, [user]);

  const onClickingTeam = (id) => {
    console.log("clicked : ", id);
    navigate(`/leaderDashboard?teamName=${id}`);
  };

  return (
    <div>
      <h3>Your Teams</h3>
      <div className="leaderTeamsContainer">
        {teamsAsLeader &&
          teamsAsLeader.map((team, key) => {
            return (
              <div
                style={{ cursor: "pointer" }}
                key={key}
                className="leaderTeams"
                onClick={() => {
                  onClickingTeam(team.teamName);
                }}
              >
                {team.teamName}
              </div>
            );
          })}
      </div>
      <TeamLeaderModal />
    </div>
  );
};

export default TeamLeader;
