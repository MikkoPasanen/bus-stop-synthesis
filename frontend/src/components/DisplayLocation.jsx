/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import haversine from "haversine-distance";
import axios from "axios";
import getUserPosition from "../util/getPosition";

const DisplayLocation = ({ fetchAndPlayMP3 }) => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [error, setError] = useState(null);
  const [distanceFromStop, setDistanceFromStop] = useState(null);
  const [stopId, setStopId] = useState("");
  const [stopLocationData, setStopLocationData] = useState("");

  useEffect(() => {
    getUserPosition(setLatitude, setLongitude, setError);
  }, []);

  const fetchStopInfo = async () => {
    try {
      const response = await axios.get(
        `https://data.itsfactory.fi/journeys/api/1/stop-points/${stopId}`
      );
      setStopLocationData(response.data.body[0]);
    } catch (error) {
      console.error(error);
    }
  };

  // Check distance between user and a stop
  const CheckDistance = () => {
    if (latitude !== null && longitude !== null && stopLocationData) {
      // Extract latitude from stopLocationData
      const stopLat = parseFloat(stopLocationData.location.split(",")[0]);
      // Extract longitude from stopLocationData
      const stopLong = parseFloat(stopLocationData.location.split(",")[1]);
      // Calculate distance between 2 coordinate points using Haversine formula
      const distance = haversine(
        { latitude: latitude, longitude: longitude },
        { latitude: stopLat, longitude: stopLong }
      );
      setDistanceFromStop(distance.toFixed(0)); // toFixed(0) to remove decimals

      // If user is within a specific distance, call fetchAndPlayMP3()
      if (distance <= 160000) {
        fetchAndPlayMP3(stopId);
      }
    }
  };

  // Call distance checker function when a new bus is inserted.
  useEffect(() => {
    CheckDistance();
  }, [latitude, longitude, stopLocationData]);

  return (
    <div>
      {error && <p>Error: {error}</p>}
      {latitude && longitude && (
        <div>
          <p>
            Latitude: {latitude}, Longitude: {longitude}
          </p>
          <input
            type="text"
            value={stopId}
            onChange={(e) => setStopId(e.target.value)}
            placeholder="Enter bus stop ID"
            style={{ marginBottom: "1rem" }}
          />
          <button onClick={fetchStopInfo}>
            Calculate Distance from selected stop
          </button>
          {distanceFromStop !== null && stopLocationData && (
            <p>
              User distance from stop "{stopLocationData.name}":{" "}
              {distanceFromStop} meters
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default DisplayLocation;
