import React, { useEffect, useState } from "react";
import { getDatabase, ref, child, get, onValue } from "firebase/database";
import TeamMemberModal from "./TeamMemberModal";
import { useUserContext } from "../misc/ValueContext";
import { useNavigate } from "react-router-dom";

const TeamMember = () => {
  const { user } = useUserContext();
  const [teamsAsMember, setTeamsAsMember] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const db = getDatabase();
    const teamRef = ref(db, `profiles/${user.userDetails.uid}/teamsAsMember`);
    onValue(teamRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const dataArr = Object.values(Object.values(data));
        setTeamsAsMember(dataArr);
      }
    });
  }, [user]);

  const onClickingTeam = (id) => {
    navigate(`/memberDashboard?teamName=${id}`);
  };

  return (
    <div>
      TeamMember
      {teamsAsMember.map((team, index) => {
        return (
          <div
            key={index}
            style={{ cursor: "pointer" }}
            onClick={() => {
              onClickingTeam(team.teamName);
            }}
          >
            {team.teamName}
          </div>
        );
      })}
      <TeamMemberModal />
    </div>
  );
};

export default TeamMember;
