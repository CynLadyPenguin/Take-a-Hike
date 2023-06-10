// Import Dependencies
import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

// Import Components
import BirdProfile from "./BirdProfile.jsx";
import BirdLearner from "./BirdLearner.jsx";
// Create Functional Component
const BirdingCheckList = () => {
  const [birdSearch, setBirdSearch] = useState("");
  const [birdList, setBirdList] = useState([]);
  const [userId, setUserId] = useState();
  const [userName, setUserName] = useState();
  const [birdSightings, setBirdSightings] = useState([]);
  const [learnedBirds, setLearnedBirds] = useState([]);

  // Call useEffect on Page Load
  useEffect(() => {
    axios
      .get("/api/birdList")
      .then((response) => setBirdList(response.data))
      .catch((err) => console.error("ERROR:", err));
    axios
      .get("/api/birdSightings")
      .then((response) => setBirdSightings(response.data))
      .catch((err) => console.error("ERROR:", err));
    axios
      .get("/profile")
      .then((profile) => {
        const user = profile.data;
        setUserId(user._id);
        setUserName(user.fullName);
      })
      .catch((err) => console.error("ERROR:", err));
  }, []);

  useEffect(() => {
    if (userId) {
      axios
        .get("/api/learnedBirds", {
          params: { userId },
        })
        .then((response) => {
          setLearnedBirds(response.data);
          console.log(response, 'Lorned Bords');
        })
        .catch((error) => {
          console.error("Error fetching learned birds:", error);
        });
    }
  }, [userId]);
  // Create Search Input Handler
  const handelBirdSearchInput = (event) => setBirdSearch(event.target.value);

  // Create Search Submit Handler
  const handelBirdSearchSubmit = (event) => {
    event.preventDefault();
    setBirdList(
      birdList.filter(
        (bird) =>
          bird.scientificName.toLowerCase().includes(birdSearch) ||
          bird.commonName.toLowerCase().includes(birdSearch) ||
          bird.commonFamilyName.toLowerCase().includes(birdSearch) ||
          bird.scientificFamilyName.toLowerCase().includes(birdSearch)
      )
    );
  };

  // Return Component Template

    return (
      <div className="section is-small">
        <div className="bird-learner-container">
          <BirdLearner
            userId={userId}
            birdList={birdList}
            listOfLearnedBirds={learnedBirds}
          />
        </div>
  
        <div className="section">
          <h1 className="title" alignment="center">
            {userName}'s Birding Checklist
          </h1>
          <h2 className="subtitle">
            Your one stop shop to keep track of all your Louisiana bird sightings.
            There is no better way to celebrate the great state of Louisiana than
            spotting all the wonderful birds that inhabit it. So get to hiking!
          </h2>
        </div>
      <form>
        <label>
          <input
            className="input is-info is-medium"
            type="text"
            placeholder="Enter Bird Name Here"
            value={birdSearch}
            onChange={handelBirdSearchInput}
          />
        </label>
        <input
          className="button is-info"
          type="submit"
          value="Search for Bird"
          onClick={handelBirdSearchSubmit}
        />
      </form>
      <div className="birds">
        <div className="profile-card">
          {birdList.map((bird) => {
            return (
              <BirdProfile
                bird={bird}
                key={bird._id}
                userId={userId}
                birdSightings={birdSightings}
                listOfLearnedBirds={learnedBirds}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Export Component
export default BirdingCheckList;
