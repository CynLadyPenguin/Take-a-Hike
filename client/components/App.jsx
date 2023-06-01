// Import Dependencies
import React, { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import axios from 'axios';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// import './styles/main.css';
import TrailsList from './TrailsList.jsx';
import Quartermaster from './Quartermaster.jsx';
import TrailProfile from './TrailProfile.jsx';
import UserProfile from './UserProfile.jsx';
import BirdingCheckList from './BirdingCheckList.jsx';
import PackingList from './PackingList.jsx';
import Login from './Login.jsx';

import TradingMain from '../components/TradingPost/TradingMain.jsx';
import TradingBoard from './TradingPost/TradingBoard.jsx';
import TradingNewPost from './TradingPost/TradingNewPost.jsx';

const App = () => {
  const [trailList, setTrailList] = useState([]);

  useEffect(() => {
    if (localStorage.getItem('TrailList')) {
      const trails = JSON.parse(localStorage.getItem('TrailList'));
      setTrailList(trails);
    }
  }, []);

  // were in trail list
  const handleGetTrails = (location) => {
    axios
      .get('/api/trailslist', {
        params: { lat: location.lat, lon: location.lon },
      })
      .then((response) => {
        setTrailList(response.data.data);
        // add data to local storage
        localStorage.setItem('TrailList', JSON.stringify(response.data.data));
      })
      .catch((err) => {
        console.error('ERROR: ', err);
      });
  };

  return (
    <div className='app'>
      <div className='app__header'>
        <img
          className='app__logo'
          src='https://res.cloudinary.com/dbwbxubwi/image/upload/v1649015216/Parc%20des%20Familles%20Trail%20by%20NOMAMBO/qoej8fkfe2og2gkdkpmn.png'
        />
        <h1 className='Header app__header' alignment='center'>
          Trail Feathers
        </h1>
      </div>
      <nav
        style={{
          borderBottom: 'solid 1px',
          paddingBottom: '1rem',
        }}
      >
        <Link to='/login'>Login</Link> |{' '}
        <Link to='/profile'>User Profile</Link> |{' '}
        <Link to='/quartermaster'>Quartermaster</Link> |{' '}
        <Link to='/trailslist'>Trails List</Link> |{' '}
        <Link to='/birdingchecklist'>Birding Checklist</Link> |{' '}
        <Link to='/tradingpost'>Trading Post</Link> {' '}
      </nav>
      <Routes>
        <Route
          path='trailslist'
          element={
            <TrailsList
              handleGetTrails={handleGetTrails}
              trailList={trailList}
            />
          }
        />
        <Route path='login' element={<Login />} />
        <Route
          path='trailprofile/:id'
          element={<TrailProfile trailList={trailList} />}
        />
        <Route path='quartermaster' element={<Quartermaster />} />
        <Route path='birdingchecklist' element={<BirdingCheckList />} />
        <Route path='profile' element={<UserProfile />} />
        <Route path='tradingpost' element={<TradingMain />} >
          <Route path='tradingboard' element={<TradingBoard />}/>
          <Route path='createtrade' element={<TradingNewPost />}/>
        </Route>
      </Routes>
      <Outlet />
    </div>
  );
};

// Export Component
export default App;
