import {
  child,
  get,
  getDatabase,
  onValue,
  push,
  ref,
  set,
  update,
} from "firebase/database";
import React from "react";
import { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useUserContext } from "../misc/ValueContext";

const MemberDashboard = () => {
  //variables
  const [searchParams, setSearchParams] = useSearchParams();
  const db = getDatabase();

  //states
  const { user } = useUserContext();
  const [memberDetails, setMemberDetails] = useState({});
  const [memberTeamDetails, setMemberTeamDetails] = useState({});
  const [leader, setLeader] = useState({});
  const [tasks, setTasks] = useState([]);
  const [chats, setChats] = useState([]);
  //refs
  const messageInputRef = useRef(null);
  useEffect(() => {
    const db = getDatabase();
    const memberDetailsRef = ref(db, `profiles/${user.userDetails.uid}/`);
    const teamRef = ref(db, `teams/${searchParams.get("teamName")}/`);
    const dbRef = ref(getDatabase());
    //getting leader details
    // get(child(dbRef, `profiles/${}}`))
    //   .then((snapshot) => {});

    //getting member's profile details
    onValue(memberDetailsRef, (snapshot) => {
      setMemberDetails(snapshot.val());
    });
    //getting member details from the team
    onValue(teamRef, (snapshot) => {
      //getting leader details
      get(child(dbRef, `profiles/${snapshot.val().leader}`))
        .then((newSnapshot) => {
          setLeader(newSnapshot.val());
        })
        .catch((err) => {
          console.log("error : ", err);
        });
      setMemberTeamDetails(snapshot.val());
      for (const outerKey in snapshot.val()) {
        if (outerKey === "members") {
          for (const key in snapshot.val()["members"]) {
            if (snapshot.val()["members"][key].uid === user.userDetails.uid) {
              //resetting task and chats to get rid of redundancy
              setChats([]);
              setTasks([]);
              //resetting task and chats to empty values
              for (const taskKey in snapshot.val()["members"][key].tasks) {
                setTasks((prevState) => {
                  return [
                    ...prevState,
                    {
                      ...snapshot.val()["members"][key].tasks[taskKey],
                      key: taskKey,
                    },
                  ];
                });
              }
              for (const chatKey in snapshot.val()["members"][key].chats) {
                setChats((prevState) => {
                  return [
                    ...prevState,
                    {
                      ...snapshot.val()["members"][key].chats[chatKey],
                      key: chatKey,
                    },
                  ];
                });
              }
              setMemberTeamDetails((prevState) => {
                return {
                  ...prevState,
                  members: snapshot.val()["members"][key],
                  key: key,
                };
              });
              break;
            }
          }
        }
      }
      // setMemberTeamDetails(snapshot.val());
      // for (const key in snapshot.val()) {
      //   if (snapshot.val()[key].uid === user.userDetails.uid) {
      //     console.log("found the user", snapshot.val()[key]);
      //     setMemberTeamDetails(() => {
      //       return { ...snapshot.val()[key], key: key };
      //     });
      //     break;
      //   }
      // }
    });
  }, []);
  const sendNewMessage = () => {
    const chatListRef = ref(
      db,
      `teams/${searchParams.get("teamName")}/members/${
        memberTeamDetails.key
      }/chats`
    );
    const newPostRef = push(chatListRef);
    set(newPostRef, {
      subject: messageInputRef.current.value,
      sender: user.userDetails.displayName,
      from: "member",
      senderUid: user.userDetails.uid,
      sentAt: Date.now(),
    });
  };
  const toggleCompletion = (keyOfTask, istaskCompleted) => {
    const updates = {};
    updates[
      `teams/${searchParams.get("teamName")}/members/${
        memberTeamDetails.key
      }/tasks/${keyOfTask}/completed/`
    ] = !istaskCompleted;
    updates[
      `teams/${searchParams.get("teamName")}/members/${
        memberTeamDetails.key
      }/tasks/${keyOfTask}/completedAt/`
    ] = Date.now();

    update(ref(db), updates);
  };
  return (
    <div>
      <div>Welcome : {memberDetails.name}</div>
      <div>Your mail : {memberDetails.email}</div>
      <div>Team ID : {searchParams.get("teamName")}</div>
      <div>Leader : {leader.name}</div>
      <div>Leader : {leader.email}</div>
      {tasks.map((task, index) => {
        return (
          <div key={index}>
            <div>{task.subject}</div>
            <div>completed : {task.completed.toString()}</div>
            <div>deadLine : {new Date(task.deadline).toLocaleDateString()}</div>
            <button
              onClick={() => {
                toggleCompletion(task.key, task.completed);
              }}
            >
              Completed
            </button>
            <br />
          </div>
        );
      })}
      <br />
      <div>
        chats :
        {chats.map((chat, index) => {
          return (
            <div key={index}>
              <div>sender : {chat.sender}</div>
              <div>subject : {chat.subject}</div>
              <div>deadLine : {new Date(chat.sentAt).toLocaleDateString()}</div>
              <br />
            </div>
          );
        })}
        <input
          type="text"
          placeholder="enter your messages"
          ref={messageInputRef}
        />
        <button onClick={sendNewMessage}>Send message</button>
      </div>
    </div>
  );
};

export default MemberDashboard;
