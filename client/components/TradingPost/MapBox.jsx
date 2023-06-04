import React, { useRef, useEffect, useState, useCallback } from 'react';

import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import { AddressAutofill, AddressMinimap, config } from '@mapbox/search-js-react';

// Again, not safe, but having trouble setting up server side and I'm running out of time sorry!! This is not secure!!!!!
mapboxgl.accessToken = process.env.MAPBOX_API_KEY;

const MapBox = ({ setLng, setLat }) => {


  const [showMinimap, setShowMinimap] = useState(false);
  const [feature, setFeature] = useState();
  const [token, setToken] = useState('');
  const [markerLocation, setMarkerLocation] = useState(null);

  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);

  // when the page loads, render a new map with the options listed below
  useEffect(() => {

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      center: [-90.052140, 29.963260],
      zoom: 11
    });

    // add the marker if a location is already set
    map.current.on('load', () => {
      if (markerLocation) {
        addMarker(markerLocation);
      }
    });

    // add a marker when you click it
    map.current.on('click', (e) => {
      const { lng, lat } = e.lngLat;
      setMarkerLocation({ lng, lat });
      addMarker({ lng, lat });
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // retrieving the coordinates and setting the marker on the correct coordinates
  const handleRetrieve = useCallback((res) => {
    const feature = res.features[0];
    setFeature(feature);
    setShowMinimap(true);
    let [lng, lat] = res.features[0].geometry.coordinates;
    // console.log(lng, lat);

    setMarkerLocation({ lng, lat });
    addMarker({ lng, lat });
  }, []);

  // adding a marker and removing the old one when the coordinates change
  const addMarker = useCallback((location) => {
    if (marker.current) {
      marker.current.remove();
    }

    // set the new marker
    marker.current = new mapboxgl.Marker().setLngLat([location.lng, location.lat]).addTo(map.current);

    // change the map view to center on the marker with a different zoom than the initial render
    map.current.setCenter([location.lng, location.lat]);
    map.current.setZoom(18);

    // update the parent state with the lng and lat values so it can be submitted to the db when the user submits the info form
    setLng(location.lng);
    setLat(location.lat);
  }, []);


  // render the address autofill form at the top and the corresponding map below it
  return (
    <>
      <form className="flex flex--column">
        <div className="grid grid--gut24 mb60">
          <div className="col col--auto-mm w-full">
            {/* <label className="txt-s txt-bold color-gray mb3">Address</label> */}
            <AddressAutofill accessToken={token} onRetrieve={handleRetrieve}>
              <input
                className="input mb12"
                placeholder="Start typing your address, e.g. 123 Main..."
                autoComplete="address-line1"
                id="mapbox-autofill"
              />
            </AddressAutofill>
          </div>
          <div className="col col--auto-mm">
            <div id="minimap-container" className="h240 w360 relative mt18">
              <AddressMinimap
                canAdjustMarker={true}
                satelliteToggle={true}
                feature={feature}
                show={showMinimap}
                onSaveMarkerLocation={setMarkerLocation}
              />
            </div>
          </div>
        </div>
      </form>

      <div ref={mapContainer} className="map-container" />
    </>
  );
}

export default MapBox;