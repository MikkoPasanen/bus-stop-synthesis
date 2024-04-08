import React, { useState, useEffect } from "react";
import haversine from "haversine-distance";
import axios from "axios";

const DisplayLocation = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [error, setError] = useState(null);
  const [distanceFromStop, setDistanceFromStop] = useState(null);
  const [stopId, setStopId] = useState("");
  const [stopLocationData, setStopLocationData] = useState("");

  useEffect(() => {
    // On Success save the user's position
    const successHandler = (position) => {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
    };

    const errorHandler = (err) => {
      setError(err.message);
    };

    // Attempt to get user's position
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(successHandler, errorHandler);
    } else {
      setError("Geolocation is not supported by this browser.");
    }
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
        fetchAndPlayMP3();
      }
    }
  };

  // Call distance checker function when a new bus is inserted.
  useEffect(() => {
    CheckDistance();
  }, [latitude, longitude, stopLocationData]);

  const fetchAndPlayMP3 = async () => {
    try {
      // Get the mp3 files from browsers localstorage
      let prefixData = localStorage.getItem("prefix");
      let announcementData = localStorage.getItem(stopId);

      // If the mp3 files are not in the localstorage, fetch them from the backend
      // and save them to the localstorage
      if (!prefixData) {
        const prefixResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/prefix`
        );
        prefixData = prefixResponse.data.prefix;
        localStorage.setItem("prefix", prefixData);
      }

      if (!announcementData) {
        const announcementResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/mp3/${stopId}`
        );
        announcementData = announcementResponse.data.mp3;
        localStorage.setItem(stopId, announcementData);
      }

      // Make the audio files from the base64 strings
      const prefixAudio = new Audio(`data:audio/mpeg;base64,${prefixData}`);
      const announcementAudio = new Audio(
        `data:audio/mpeg;base64,${announcementData}`
      );

      // First play the prefix audio and then the announcement audio
      // after the prefix audio has ended
      prefixAudio.play();
      prefixAudio.onended = () => {
        announcementAudio.play();
      };
    } catch (err) {
      console.error(err);
    }
  };

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
