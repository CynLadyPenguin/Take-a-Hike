import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
/*
The weather component has 3 parts: The location, live weather details
and weather warnings. It is designed as a box/container that is interactive for the user.
They should be able to input their location (using drop down from trails list)
and have the other parts render the data about that location
*/
const Weather = () => {
  const [locations, setLocations] = useState([]);
  const [currentLocation, setCurrentLocation] = useState('');
  const [weather, setWeather] = useState({});
  const [view, setView] = useState('Daily');
  let holderObjTemp = {};
  let holderObjWC = {};

  const weatherCodeNumbers = {
    0: 'clear skies',
    1: 'clear partly cloudy',
    2: 'clear partly cloudy',
    3: 'clear partly cloudy',
    45: 'fog',
    48: 'fog',
    51: 'drizzle light',
    53: 'drizzle moderate',
    55: 'drizzle heavy',
    61: 'rain slight',
    63: 'rain moderate',
    65: 'rain heavy',
    66: 'rain freezing light',
    67: 'rain freezing heavy',
    71: 'snow fall slight',
    73: 'snow fall moderate',
    75: 'snow fall heavy',
    77: 'snow grains',
    80: 'rain showers slight',
    81: 'rain showers moderate',
    82: 'rain showers heavy',
    85: 'snow showers slight',
    86: 'snow showers heavy',
    95: 'thunderstorm slight/moderate',
    96: 'thunderstorm with slight hail',
    99: 'thunderstorm with heavy hail'
  };
  const windDirection = {
    N: '0 - 11.25',
    NNE: '11.25 - 33.75',
    NE: '33.75 - 56.25',
    ENE: '56.25 - 78.75',
    E: '78.75 - 101.25',
    ESE: '101.25 - 123.75',
    SE: '123.75 - 146.25',
    SSE: '146.25 - 168.75',
    S: '168.75 - 191.25',
    SSW: '191.25 - 213.75',
    SW: '213.75 - 236.25',
    WSW: '236.25 - 258.75',
    W: '258.75 - 281.25',
    WNW: '281.25 - 303.75',
    NW: '303.75 - 326.25',
    NNW: '326.25 - 348.75'
};
//use a function to return the correct key value associated with obj
//for wind direction
const windDirectionFunction = (directionNumber) => {
  let direction = null;
  Object.entries(windDirection).forEach(([key, value]) => {
      const [min, max] = value.split(' - ').map(Number);
      if (directionNumber >= min && directionNumber <= max) {
          direction = key;
      }
  });
  return direction;
};

  //the list of trails they have saved to the database (based on name of trail)
    useEffect(() => {
      //fetch trail names from database when component mounts
      const fetchLocations = async () => {
        try {
          const response = await axios.get('/api/trailnames');
          setLocations(response.data);
        } catch (error) {
          console.error('Client failed to fetch locations', error);
        }
      };
      fetchLocations();
    }, []);
   //handle when a user selects a different location
   const handleLocationChange = (event) => {
      setCurrentLocation(event.target.value);
   };
   //this function is designed to change the view on the WeatherBox
   const handleViewChange = () => {
    setView((prevView) => prevView === 'Daily' ? 'Extended' : 'Daily');
  };
  //separating the useEffect and the api call means only one call
  //pull the data from the external api
  //set current_weather to true to return current_weather object
    const fetchWeather = async (location) => {
      if (location.name) {
        try {
          const response = await axios
          .get(`https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&hourly=temperature_2m&current_weather=true`);
          setWeather(response.data.current_weather);
          // console.log('axios get weather', response.data.current_weather);
          //returns an object with current weather object inside
          // { current_weather: { temperature, time, weathercode, winddirection, windspeed } }
        } catch (error) {
          console.error('Failed to fetch weather data', error);
        }
      }
    };
  useEffect(() => {
    fetchWeather(currentLocation);
  }, [currentLocation]);
  //fetch 14 day weather data
  const fetch14Weather = async (location) => {
    if (location.name) {
      try {
        const response = await axios
        .get(`https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&hourly=temperature_2m,weathercode&forecast_days=14&timezone=auto`);
        // console.log(response.data);
        //we need to sort the data that is returned
        const temp = response.data.hourly.temperature_2m;
        const time = response.data.hourly.time;
        const weatherCode = response.data.hourly.weathercode;
        let date_temp = [];
        let date_wc = [];
        //loop over the time array and tie the temp index to the time index
        for (let i = 0; i < time.length; i++) {
          //put the indexes together
          date_temp.push([time[i], temp[i]]);
        }
        //same thing but for weathercodes
        for (let i = 0; i < time.length; i++) {
          //put the indexes together
          date_wc.push([time[i], weatherCode[i]]);
        }
        // console.log('date_temp', date_temp)
        //now we'll iterate over date_temp and sort the date/time values into one value
        //that will represent the daily temperature

        for (let j = 0; j < date_temp.length; j++) {
          //each iteration slice the last 6 values from the index 0 string
          let stringDate = date_temp[j][0].slice(0, -6);
          if (holderObjTemp[stringDate]) {
            holderObjTemp[stringDate] += date_temp[j][1];
          } else {
            holderObjTemp[stringDate] = date_temp[j][1];
          }
        }
        //we did it! We now have an obj sorted by date and with the values of the
        //total temperatures for that day. The value at each property needs to be
        //divided by 24 to obtain an average temperature for the day.
        // console.log('holderObj', holderObj);
        //now let's do it again for weathercodes
        //still needs to be divided by 24
        for (let p = 0; p < date_wc.length; p++) {
          //each iteration slice the last 6 values from the index 0 string
          let stringDate = date_wc[p][0].slice(0, -6);
          if (holderObjWC[stringDate]) {
            holderObjWC[stringDate] += date_wc[p][1];
          } else {
            holderObjWC[stringDate] = date_wc[p][1];
          }
        }
        // console.log('holderObjWC', holderObjWC);
      } catch (error) {
        console.error('Failed to fetch 14 day weather data', error);
      }
    }
  };
  useEffect(() => {
    fetch14Weather(currentLocation);
  }, [currentLocation]);

  return(
    <Container
    sx={{
      border: '20px solid',
      borderImageSource: 'linear-gradient(to right, green, blue, purple)',
      borderImageSlice: '1',
      height: '650px',
      width: '500px',
      backgroundImage: 'url(https://thumbs.gfycat.com/AgedSingleBasil-size_restricted.gif)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <Select
        value={ currentLocation }
        onChange={ handleLocationChange }
        sx={{
          backgroundColor: 'white',
          border: '3px solid grey',
          fontSize: '20px',
          fontWeight: '700',
          color: 'green'
          }}>
        {locations.map((location, index) => (
          <MenuItem value={location} key={index} sx={{ fontWeight: '900' }}>
            {location.name || ''}
          </MenuItem>
        ))}
      </Select>
      <Button variant="outlined" onClick={handleViewChange}>
        {view === 'Daily' ? 'View Extended Data' : 'View Daily Data'}
      </Button>
      </div>
      <Box
      sx={{
        border: '3px solid',
        borderColor: 'grey',
        borderRadius: '10px',
        padding: '20px',
        marginTop: '20px',
        marginBottom: '20px',
        height: '350px',
        width: '400px',
        backgroundColor: 'rgba(255, 255, 255, 0.75)',
        overflow: 'auto'
      }}
    >
      {view === 'Daily' ? (
        <>
          <Typography paragraph style={{ fontWeight: 900, color: 'blue' }}>
            Temperature: {weather.temperature} C
          </Typography>
          <div style={{ height: '50px' }}></div>
          <Typography paragraph style={{ fontWeight: 900, color: 'blue' }}>
            Wind Direction: {windDirectionFunction(weather.winddirection)}
          </Typography>
          <div style={{ height: '50px' }}></div>
          <Typography paragraph style={{ fontWeight: 900, color: 'blue' }}>
            Wind Speed: {weather.windspeed}
          </Typography>
          <div style={{ height: '50px' }}></div>
          <Typography paragraph style={{ fontWeight: 900, color: 'blue' }}>
            Weather Code: {weather.weathercode}
          </Typography>
        </>
      ) : (
        <>
          {Object.entries(holderObjTemp).length > 0 ? (
            <>
            <Typography paragraph style={{ fontWeight: 900, color: 'blue' }}>
            14 Day Forecast Information:
          </Typography>
          {Object.entries(holderObjTemp).map(([property, value]) => (
            <Typography key={property}>
              {`${property}: ${value / 24}`}
            </Typography>
          ))}
        </>
        ) : (
          <Typography>
            Loading forecast data...
          </Typography>
        )}
      </>
    )}
  </Box>
        <Box
        sx={{
          border: '3px solid grey',
          height: '100px',
          width: '400px',
          backgroundColor: 'rgba(255, 255, 255, 0.75)'
        }}>
          <div style={{ height: '30px'}}></div>
          <Typography paragraph style={{ fontWeight: 900, color: 'purple' }}>
            Weather Code Description: { weatherCodeNumbers[weather.weathercode] }
          </Typography>
        </Box>
      </Container>
    );
  };

  export default Weather;