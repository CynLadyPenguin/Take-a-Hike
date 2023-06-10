// Import Dependencies
import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

// Create Functional Component
const BirdProfile = ({ bird, userId, birdSightings, listOfLearnedBirds }) => {
  const [checked, setChecked] = useState(false);
  const learnedBirdIds = listOfLearnedBirds.map(
    (learnedBird) => learnedBird.birdId
  );

  // Create Checkbox Click Handler
  const handleCheckboxClick = () => {
    if (!checked === true) {
      setChecked(true);
    } else {
      setChecked(false);
    }
  };

  // Return Component Template
  return (
    <div className="block">
      <input type="checkbox" checked={checked} onChange={handleCheckboxClick} />

      <div className="message-header">
        Common Name: {bird.commonName}
        {listOfLearnedBirds.some((item) => item.birdId === bird._id) && (
          <span className="badge">
            I learned this bird!
            {/* <img style={{ width: "50px", height: "auto", background: "none" }} src="client/mockingJay.png" alt="" className="badge-image" /> */}
          </span>
        )}
      </div>
      <ul>
        <li>Scientific Name: {bird.scientificName}</li>
        <li>Common Family Name: {bird.commonFamilyName}</li>
        <li>Scientific Family Name: {bird.scientificFamilyName}</li>
        <li>Order: {bird.order}</li>
      </ul>
    </div>
  );
};

// Export Component
export default BirdProfile;

