const getUserPosition = (setLatitude, setLongitude, setError) => {
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
};

export default getUserPosition;
