import React, { useEffect, useState } from "react";
import { getDatabase, ref, child, get, onValue } from "firebase/database";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUser } from "../custom/CustomStates";
import { useUserContext } from "../misc/ValueContext";

const LeaderDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [teamDetails, setTeamDetails] = useState({});
  const [memberDetails, setMemberDetails] = useState([]);
  const { user } = useUserContext();
  const navigate = useNavigate();
  useEffect(() => {
    setMemberDetails([]);
    const db = getDatabase();
    const teamRef = ref(db, `teams/${searchParams.get("teamName")}`);
    onValue(teamRef, (snapshot) => {
      const data = snapshot.val();
      setTeamDetails(data);
      //   snapshot.forEach((childSnapshot) => {
      //     if (childSnapshot.key == "members") {
      //       setMemberDetails([...memberDetails,child]);
      //     }
      //   });
      // console.log("this is keys and values : ", Object.values(data.members));
      for (const key in data.members) {
        // console.log("key : ", key, " value : ", data.members[key]);
      }
      // console.log(members);
      for (const key in data.members) {
        const member = data.members[key];
        const memberDetailsRef = ref(db, `profiles/${member.uid}`);
        onValue(memberDetailsRef, (snapshot) => {
          setMemberDetails((prevState) => {
            return [
              ...prevState,
              { ...snapshot.val(), uid: member.uid, key: key },
            ];
          });
          // console.log(snapshot.val(), "\n", memberDetails);
        });
      }
      // Object.values(Object.values(data.members)).forEach((member) => {
      //   const memberDetailsRef = ref(db, `profiles/${member.uid}`);
      //   onValue(memberDetailsRef, (snapshot) => {
      //     setMemberDetails((prevState) => {
      //       return [...prevState, { ...snapshot.val(), uid: member.uid }];
      //     });
      // console.log(snapshot.val(), "\n", memberDetails);
      //   });
      // console.log("member : ", member);
      // });

      // console.log("data : ", data);
    });
  }, [user]);
  const date = new Date(teamDetails.createdAt);
  const goToMemberPageforLeader = (member) => {
    // console.log(member);
    navigate(
      `/leaderDashboard/memberView?member=${
        member.uid
      }&teamName=${searchParams.get("teamName")}&key=${member.key}`
    );
  };
  return (
    <div>
      LeaderDashboard
      <div>Date : {date.toLocaleDateString()}</div>
      <div>Leader : {user.userDetails.displayName}</div>
      <div>
        Members :
        {memberDetails.map((member, index) => {
          return (
            <div
              key={index}
              style={{ cursor: "pointer" }}
              onClick={() => {
                goToMemberPageforLeader(member);
              }}
            >
              <div className="memberIndex">{index + 1}</div>
              <div>
                <div className="memberName">Name : {member.name}</div>
                <div className="memberEmail">email : {member.email}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LeaderDashboard;
