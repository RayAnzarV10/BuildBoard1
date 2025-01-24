import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const GoogleMapsPin = ({ latitude, longitude } : {latitude: number, longitude: number}) => {

  const center = {
    lat: latitude,
    lng: longitude,
  };  

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
      <GoogleMap
        mapContainerStyle={{
          width: '100%',
          height: '300px',
        }}
        center={center}
        zoom={18}
        mapTypeId="satellite"
      >
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapsPin;