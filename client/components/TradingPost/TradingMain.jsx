import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const TradingMain = () => {

  return (
    <div>
      <h3
        className="content has-text-centered"
        padding="20px 40px"
        margin-left="40px"
      >
        Trading Post
      </h3>
      <div className="content has-text-centered">
      <Link to='/tradingpost/tradingboard'>Trading Board</Link> |{' '}
      <Link to='/tradingpost/createtrade'>Post New Trade</Link>
      </div>
        <Outlet />
    </div>

  );
}

export default TradingMain;