const getUserPosition = (setLatitude, setLongitude, setError) => {
  return new Promise((resolve, reject) => {
    const successHandler = (position) => {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
      resolve(); // Resolve the promise when position is successfully retrieved
    };

    const errorHandler = (err) => {
      setError(err.message);
      reject(err); // Reject the promise if there's an error
    };

    // Attempt to get user's position
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(successHandler, errorHandler);
    } else {
      const errorMessage = "Geolocation is not supported by this browser.";
      setError(errorMessage);
      reject(new Error(errorMessage)); // Reject the promise if geolocation is not supported
    }
  });
};

export default getUserPosition;
