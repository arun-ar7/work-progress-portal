import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  getDatabase,
  ref,
  onValue,
  get,
  child,
  push,
  set,
} from "firebase/database";
import { useUserContext } from "../misc/ValueContext";
const MemberDetailsForLeader = () => {
  //variables
  const db = getDatabase();
  const [searchParams, setSearchParams] = useSearchParams();

  //states
  const { user } = useUserContext();
  const [currentUserTeamData, setCurrentUserTeamData] = useState({});
  const [currentUserData, setCurrentUserData] = useState({});
  const [tasks, setTasks] = useState([]);
  const [chats, setChats] = useState([]);
  //refs
  const taskSubjectRef = useRef(null);
  const taskDeadlineRef = useRef(null);
  const messageRef = useRef(null);

  useEffect(() => {
    console.log("team name : ", searchParams.get("teamName"));
    const db = getDatabase();
    const memberRef = ref(db);
    const teamRef = ref(
      db,
      `teams/${searchParams.get("teamName")}/members/${searchParams.get("key")}`
    );

    get(child(memberRef, `profiles/${searchParams.get("member")}`)).then(
      (snapshot) => {
        if (snapshot.exists()) {
          // console.log("user details : ", snapshot.val());
          setCurrentUserData(snapshot.val());
        }
      }
    );
    onValue(teamRef, (snapshot) => {
      const data = snapshot.val();
      setTasks([]);
      setChats([]);
      // console.log("this is the new method data : ", data);
      setCurrentUserTeamData(data);
      // const dataArr = Object.values(data.tasks);
      // setTasks(dataArr);
      for (const key in data.tasks) {
        setTasks((prevState) => {
          return [...prevState, { ...data.tasks[key], key: key }];
        });
      }
      for (const key in data.chats) {
        setChats((prevState) => {
          return [...prevState, { ...data.chats[key], key: key }];
        });
      }
    });
  }, []);
  const addNewTask = () => {
    const isSameDate = (date1, date2) => {
      if (
        +new Date(date1.toLocaleDateString()) ===
        +new Date(date2.toLocaleDateString())
      ) {
        return true;
      } else {
        return false;
      }
    };
    console.log(
      "check date : ",
      Date.now() > +new Date(taskDeadlineRef.current.value) ||
        !isSameDate(new Date(), new Date(taskDeadlineRef.current.value))
    );
    console.log(
      "Result : ",
      !isSameDate(new Date(), new Date(taskDeadlineRef.current.value))
    );
    // if (
    //   Date.now() > +new Date(taskDeadlineRef.current.value) ||
    //   !isSameDate(new Date(), new Date(taskDeadlineRef.current.value))
    // ) {
    //   return;
    // }
    if (Date.now() > +new Date(taskDeadlineRef.current.value)) {
      if (!isSameDate(new Date(), new Date(taskDeadlineRef.current.value))) {
        return;
      }
    }
    console.log("inside handler");

    //insertion
    const postListRef = ref(
      db,
      `teams/${searchParams.get("teamName")}/members/${searchParams.get(
        "key"
      )}/tasks`
    );
    const newPostRef = push(postListRef);
    console.log(+new Date(taskDeadlineRef.current.value).toLocaleDateString());
    set(newPostRef, {
      subject: taskSubjectRef.current.value,
      deadline: +new Date(taskDeadlineRef.current.value),
      createdAt: Date.now(),
      completed: false,
      completedAt: 0,
    });
  };
  //function to send new message
  const sendNewMessage = () => {
    //inserting into chat field in firebase
    const chatListRef = ref(
      db,
      `teams/${searchParams.get("teamName")}/members/${searchParams.get(
        "key"
      )}/chats`
    );
    const newPostRef = push(chatListRef);
    set(newPostRef, {
      subject: messageRef.current.value,
      sender: user.userDetails.displayName,
      from: "leader",
      senderUid: user.userDetails.uid,
      sentAt: Date.now(),
    });
  };
  return (
    <div>
      <div>Team ID : {searchParams.get("teamName")}</div>
      <div>Member Name : {currentUserData.name}</div>
      <div>Email ID : {currentUserData.email}</div>
      <div>Role : Member</div>
      <div>
        <input
          type="text"
          placeholder="Subject of the Work"
          ref={taskSubjectRef}
        />
        <input type="date" placeholder="Last Date" ref={taskDeadlineRef} />
        <button onClick={addNewTask}>Add new Task</button>
      </div>
      <div>
        {tasks.map((task, index) => {
          return (
            <div key={index}>
              <div>{index + 1}</div>
              <div>{task.subject}</div>
              <div>Assigned at : {new Date(task.createdAt).toString()}</div>
              <div>Deadline : {new Date(task.createdAt).toString()}</div>
              <div>Completed : {task.completed.toString()}</div>
              <br></br>
            </div>
          );
        })}
      </div>
      <div>
        Send messages :
        <input type="text" ref={messageRef} placeholder="Enter your message" />
        <button onClick={sendNewMessage}>Send Message</button>
      </div>
      <div>
        chats :
        {chats.map((chat, key) => {
          return (
            <div>
              {chat.subject}
              <div>sender : {chat.sender}</div>
              <div>from : {chat.from} </div>
              <div>{new Date(chat.sentAt).toLocaleString()}</div>
              <br />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MemberDetailsForLeader;
