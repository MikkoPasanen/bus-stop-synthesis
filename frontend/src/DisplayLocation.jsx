import React, { useState, useEffect } from "react";
import haversine from "haversine-distance";

const DisplayLocation = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const successHandler = (position) => {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
    };

    const errorHandler = (err) => {
      setError(err.message);
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(successHandler, errorHandler);
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  // Temprorary hardcoded location of stop Keskustori H
  const stopLat = 61.49754;
  const stopLong = 23.761522;

  const tempStop = [stopLat, stopLong];
  const userLocation = [latitude, longitude];

  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      const distance = haversine(
        { latitude: latitude, longitude: longitude },
        { latitude: stopLat, longitude: stopLong }
      );
      console.log("Distance:", distance); // For testing purposes, you can remove this line later
      // Check if distance is within X kilometers (adjust X as needed)
      if (distance <= 200000) {
        // Implement audio playback
        console.log("User is within distance from the specific point.");
      } else {
        console.log("Not in distance");
      }
    }
  }, [latitude, longitude]);

  return (
    <div>
      {error && <p>Error: {error}</p>}
      {latitude && longitude && (
        <p>
          Latitude: {latitude}, Longitude: {longitude}
        </p>
      )}
      <p>Distance: {haversine(tempStop, userLocation)}</p>
    </div>
  );
};

export default DisplayLocation;
