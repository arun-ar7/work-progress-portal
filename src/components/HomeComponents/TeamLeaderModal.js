import React, { useRef, useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import {
  getDatabase,
  ref,
  push,
  set,
  onValue,
  get,
  child,
} from "firebase/database";
import { useUserContext } from "../misc/ValueContext";
import Header from "../Header";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const TeamLeaderModal = () => {
  //states
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { user } = useUserContext();

  //refs
  const teamId = useRef(null);
  const passwordRef = useRef(null);

  //function for creating team
  const createTeamOnClick = async () => {
    console.log(teamId.current.value);
    const db = getDatabase();
    let flag = false;
    const teamRef = ref(db, "teams/" + teamId.current.value);
    get(child(ref(db), `teams/${teamId.current.value}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          console.log("Team already exists");
          return;
        } else {
          console.log("team will be added");
          //code to add data to the database
          set(ref(db, "teams/" + teamId.current.value), {
            leader: user.userDetails.uid,
            password: passwordRef.current.value,
            createdAt: Date.now(),
          });

          // Create a new post reference with an auto-generated id
          const postListRef = ref(
            db,
            `profiles/${user.userDetails.uid}/teamsAsLeader`
          );
          const newPostRef = push(postListRef);
          set(newPostRef, {
            teamName: teamId.current.value,
            createdAt: Date.now(),
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
    // onValue(teamRef, (snapshot) => {
    //   const data = snapshot.val();
    //   if (data) {
    //     flag = true;
    //     console.log("Team already exists");
    //     return;
    //   }
    // });
    // if (flag) {
    //   console.log("Team already exists.....");
    //   return;
    // }
  };

  return (
    <div>
      <Button onClick={handleOpen}>Create your team</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {/* <Typography id="modal-modal-title" variant="h6" component="h2"> */}
          <div className="leaderModalHeading">Create your Team</div>

          <div className="leaderModalText">
            <p>Team Leader : {user.userDetails.displayName}</p>
          </div>
          {/* </Typography> */}
          <div>
            <input
              type="number"
              placeholder="team id in numbers"
              ref={teamId}
              className="leaderModalInputClass"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="enter your password"
              ref={passwordRef}
              className="leaderModalInputClass"
            />
          </div>
          <button
            onClick={createTeamOnClick}
            className="leaderModalInputClass leaderModalInputButton"
          >
            Create Team
          </button>
          {/* <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography> */}
        </Box>
      </Modal>
    </div>
  );
};

export default TeamLeaderModal;
