import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const LocationMarker = () => {
  const [position, setPosition] = useState(null);
  const map = useMapEvents({
    click() {
      map.locate();
    },
    locationfound(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  console.log(position);
  return position === null ? null : (
    <Marker position={position}>
      <Popup>You are here</Popup>
    </Marker>
  );
};

const Maps = () => {
  // Define the fixed position for the additional marker
  const fixedPosition = [19.2183, 72.9781]; // Example: Some coordinates in Mumbai
  const startPosition = [19.0760, 72.8777]; // Coordinates for starting point

  return (
    <MapContainer
      center={startPosition} // Centered at the starting point
      zoom={10}
      scrollWheelZoom={false}
      style={{ height: "100vh", width: "100%" }}
      className='z-0'
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker />
      {/* Additional Marker at a fixed location */}
      <Marker position={fixedPosition}>
        <Popup>Fixed Location : [19.2183, 72.9781]</Popup>
      </Marker>
      {/* Polyline between two points */}
      {/* <Polyline positions={[startPosition, fixedPosition]} color="blue" /> */}


    </MapContainer>
  );
};

export default Maps;
