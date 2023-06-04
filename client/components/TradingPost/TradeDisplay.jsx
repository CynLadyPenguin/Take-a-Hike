import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import DistanceMap from './DistanceMap.jsx';

const TradeDisplay = () => {
  const location = useLocation();

  const [post, setPost] = useState(location.state?.thisPost);

  //THE LOCATION MAP WILL NEED TO BE PLACED NEXT TO THIS SO THE CARD IS ON THE LEFT AND THE MAP IS ON THE RIGHT
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', margin: '10px -5px' }}>
    <div className='list-item-card' style={{ flex: '50%', maxWidth: '50%' }}>
      <div>
        <h1>{post.title}</h1>
        <img src={post.pictures} style={{ width: '100%', height: 'auto' }} />
        <h2>Price: ${post.price}</h2>
        <br></br>
        <h2>Description:</h2>
        <p>{post.description}</p>
      </div>
    </div>
    <div className='list-item-card' style={{ flex: '50%', maxWidth: '50%' }}>
      <DistanceMap post={ post }/>
      </div>
    </div>
  );
}

export default TradeDisplay;