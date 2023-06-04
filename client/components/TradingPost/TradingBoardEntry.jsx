import React, { useState, useEffect } from 'react';
import { useLocation, Link, Outlet, useNavigate } from 'react-router-dom';

const TradingBoardEntry = ({ post }) => {
  const [thisPost, setThisPost] = useState(post);
  const navigate = useNavigate();
  const link = `/tradingpost/trade/${thisPost._id}`;

  const handleImageClick = () => {
    navigate(link, { state: { thisPost: thisPost } });
  };

  return (
    <div className='list-item-card' style={{ margin: '10px' }}>
      <img
        src={thisPost.pictures}
        onClick={handleImageClick}
        style={{ cursor: 'pointer', width: '100%', height: 'auto' }}
      />
      <Link to={link} state={{ thisPost: thisPost }} style={{ color: '#4a4a4a' }} className="link">
        {post.title}
      </Link>
      <h2>${thisPost.price}</h2>
      <Outlet />
    </div>
  );};

export default TradingBoardEntry;
