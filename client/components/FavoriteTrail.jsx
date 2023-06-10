import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import axios from 'axios';


/*
This component is designed to set the favorite trail info so the user
can see any weather alerts for that trail/location. It will use a trail from the database
and set that trail to the user's favorite trail in the mysql database.
*/
const FavoriteTrail = ({ userId }) => {
  const [favorite, setFavorite] = useState('');
  const [trails, setTrails] = useState([]);
  const [weatherAlerts, setWeatherAlerts] = useState('');

  //handle the selection change
  const handleInputChange = async (event) => {
    setFavorite(event.target.value);
    //update user's favorite trail in database
    try {
      const response = await axios.put('/api/users/updateFavoriteTrail', { userId, favoriteTrail: event.target.value });
      console.log(response);
    } catch (error) {
      console.error('Failed to update favorite trail', error);
    }
  };


  useEffect(() => {
    //fetch trail names from database when component mounts
    //populate the drop down list with the trails
    const fetchTrails = async () => {
      try {
        const response = await axios.get('/api/trailnames');
        setTrails(response.data);
      } catch (error) {
        console.error('Client failed to fetch trails', error);
      }
    };

  //fetch user's favorite trail
  const fetchFavoriteTrail = async () => {
    try {
      const response = await axios.get(`/api/users/${userId}`);
      setFavorite(response.data.favoriteTrail);
    } catch (error) {
      console.error('Client failed to fetch favorite trail', error);
    }
  };
    fetchTrails();
    fetchFavoriteTrail();
  }, [userId]);

  return (
    <Box>
      <Typography>Favorite Trail:</Typography>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Select
          value={favorite}
          onChange={handleInputChange}
          sx={{
            backgroundColor: 'white',
            border: '3px solid grey',
            fontSize: '20px',
            marginRight: '10px',
          }}
        >
          {trails.map((trail, index) => (
            <MenuItem value={trail.name} key={index}>
              {trail.name || ''}
            </MenuItem>
          ))}
        </Select>
        <Typography>
          Weather Alerts for {favorite.name}:
        </Typography>
      </div>
    </Box>
  );
};

export default FavoriteTrail;