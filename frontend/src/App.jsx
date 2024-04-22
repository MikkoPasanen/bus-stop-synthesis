import { useState, useEffect } from "react";

// Util
import getUserPosition from "./util/getPosition.js";

// Material UI
import { CssBaseline } from '@mui/material';

// Components
import TopAppBar from "./components/TopAppBar.jsx";
import MainPage from "./components/MainPage.jsx";
import TrackingPage from "./components/TrackingPage.jsx";
import InfoScreen from "./components/InfoScreen.jsx";

function App() {
    // Bus line number
    const [id, setId] = useState("");

    const [open, setOpen] = useState(false);

    // Bus tracking
    const [tracking, setTracking] = useState("not tracking");

    // Users location
    const [latitude, setLatitude] = useState(61.503178);
    const [longitude, setLongitude] = useState(23.812778);

    const [error, setError] = useState(null);

    // Get user position on launch
    useEffect(() => {
        getUserPosition(setLatitude, setLongitude, setError);
    }, []);

    return (
      <>
        <CssBaseline />
        <TopAppBar setOpen={setOpen}/>
        {tracking === "not tracking" ? (
          <MainPage
            linenro={id}
            setLinenro={setId}
            setTracking={setTracking}
            latitude={latitude}
            longitude={longitude}
            setLatitude={setLatitude}
            setLongitude={setLongitude}
            setError={setError}
            tracking={tracking}
          />
        ) : (
          <TrackingPage
            tracking={tracking}
            setTracking={setTracking}
          />
        )
        }
        <InfoScreen open={open} setOpen={setOpen} />
      </>
    )
}

export default App;
