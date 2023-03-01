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

const TeamMemberModal = () => {
  //states
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { user } = useUserContext();

  //refs
  const teamId = useRef(null);
  const passwordRef = useRef(null);

  //function for adding a member to the team
  const addMemberOnClick = async () => {
    if (
      teamId.current.value === null ||
      teamId.current.value === undefined ||
      teamId.current.value === ""
    ) {
      console.log("Enter a value and try again");
      return;
    }
    const db = getDatabase();
    let teamFlag = false;
    let memberFlag = false;
    let passwordCorrect = false;

    //get function in firebase
    const dbRef = ref(getDatabase());
    get(child(dbRef, `teams/${teamId.current.value}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          //shows that the team is available when the above if condition is true
          get(child(dbRef, `teams/${teamId.current.value}`))
            .then((snapshot) => {
              //check if the user is already present in the group
              snapshot.forEach((childSnapshot) => {
                const childKey = childSnapshot.key;
                const childData = childSnapshot.val();
                if (childKey == "password") {
                  if (childData == passwordRef.current.value) {
                    passwordCorrect = true;
                  }
                }
                if (childKey == "leader") {
                  if (childData == user.userDetails.uid) {
                    memberFlag = true;
                  }
                } else if (childKey == "members") {
                  const userArray = Object.values(Object.values(childData));
                  userArray.forEach((member) => {
                    if (member.uid == user.userDetails.uid) {
                      memberFlag = true;
                    }
                  });
                }
              });
              if (!passwordCorrect) {
                console.log("incorrect password");
                return;
              }
              if (memberFlag) {
                console.log("You are already a member");
                return;
              } else {
                //adding the uid to the team's members field
                const postListRef = ref(
                  db,
                  `teams/${teamId.current.value}/members`
                );
                const newPostRef = push(postListRef);
                set(newPostRef, {
                  uid: user.userDetails.uid,
                });
                const addTeamToProfileRef = ref(
                  db,
                  `profiles/${user.userDetails.uid}/teamsAsMember`
                );
                const newTeamToProfileRef = push(addTeamToProfileRef);
                set(newTeamToProfileRef, {
                  teamName: teamId.current.value,
                });
                console.log("Added member successfully");
              }
            })
            .catch((error) => {
              console.error(error);
            });
        } else {
          console.log("No team available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <Button onClick={handleOpen}>Join a team</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Join team with ID
          </Typography>
          <input type="number" placeholder="team id in numbers" ref={teamId} />
          <input type="text" placeholder="Enter password" ref={passwordRef} />
          <p>You will be a member on clicking below</p>
          <button onClick={addMemberOnClick}>Join the team</button>
          {/* <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography> */}
        </Box>
      </Modal>
    </div>
  );
};

export default TeamMemberModal;
