import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";

const UserProfile = () => {
  const [profileName, setProfileName] = useState("");
  const [picture, setPicture] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    axios.get("/profile").then((profile) => {
      const user = profile.data;
      // console.log(user);
      setProfileName(user.fullName);
      setPicture(user.picture);
      setEmail(user.email);
    });
  });


  return (
    <div className="profile-card">
      <h1>Welcome {profileName}</h1>
      <a href={picture}></a>
      <p>{email}</p>
      <form action="/logout" method="POST">
        <button type="submit">Logout</button>
      </form>
    </div>
  );

};

export default UserProfile;
