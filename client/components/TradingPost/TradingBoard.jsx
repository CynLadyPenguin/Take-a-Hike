import React, { useState, useEffect } from 'react';
import axios from 'axios';


import TradingBoardEntry from '../TradingPost/TradingBoardEntry.jsx';

const TradingBoard = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPosts();
  }, []);

  const getPosts = async () => {
    try {
      const allPosts = await axios.get('/trading');
      setPosts(allPosts.data.reverse());
    } catch (error) {
      console.error('Could not get posts', error);
    }
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {posts.length > 0 ? (
        posts.map((post) => (
          <TradingBoardEntry key={post._id} post={post} />
        ))
      ) : (
        <div className='list-item-card'>
          <p>No trades! Post a new one!</p>
        </div>
      )}
    </div>
  );
};


export default TradingBoard;