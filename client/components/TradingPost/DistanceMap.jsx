import React, { useEffect, useState } from 'react';
import axios from 'axios';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken = process.env.MAPBOX_API_KEY;

const DistanceMap = ({ post }) => {
  const [travelTime, setTravelTime] = useState(null);

  // the getDirectionsMap needs to know what the const map variable is to be able to set markers which is why I put it all in the useEffect and called
  // it within the same useEffect
  useEffect(() => {

    const getDirectionsMap = async () => {
      const map = new mapboxgl.Map({
        container: 'map-container',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [post.lng, post.lat],
        zoom: 12
      });

      // sets the destination marker as the location of the post's longitude and latitude
      const destinationMarker = new mapboxgl.Marker().setLngLat([post.lng, post.lat]).addTo(map);

      try {
        // calling the geolocator to get the user's position, waiting for a response before making an api call to get the directions time
        const userPosition = await getUserPosition();
        const origin = [userPosition.coords.longitude, userPosition.coords.latitude];

        // setting the origin marker as the location of the user if the origin exists (user allowed site to access location)
        // also calculating the distance if we have the origin location
        if (origin) {
          const originMarker = new mapboxgl.Marker().setLngLat(origin).addTo(map);
          const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${origin[0]},${origin[1]};${post.lng},${post.lat}?access_token=${mapboxgl.accessToken}`;

          const response = await axios.get(directionsUrl);
          const route = response.data.routes[0];
          const travelTime = route.duration / 60;
          setTravelTime(travelTime);
        }

      } catch (error) {
        console.error('Could not get the directions :(', error);
      }
    };

    // need to call this function now so it can do its thang
    getDirectionsMap();

    // return () => {
    //   map.remove();
    // };
  }, []);

  // have to use success and error because it returns a callback function not an object
  const getUserPosition = () => {
    return new Promise((successCB, errorCB) => {
      navigator.geolocation.getCurrentPosition(successCB, errorCB);
    });
  };

  // does not render the travel time if it does not exist
  return (
    <div>
      <div id="map-container" style={{ height: '400px' }}></div>
      {travelTime !== null ? (
        <p>It'll take you {Math.round(travelTime)} minutes to drive there</p>
      ) : (
        <p>Allow access to location to view driving travel time to trade location!</p>
      )}
    </div>
  );};

export default DistanceMap;
