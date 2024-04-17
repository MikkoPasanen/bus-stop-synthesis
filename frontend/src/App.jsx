import { useState, useEffect } from "react";
import fetchJourneys from "./util/fetchJourneys.js";
import validBusLines from "./util/validBusLines.js";
import DisplayLocation from "./components/DisplayLocation.jsx";
import fetchAndPlayMP3 from "./util/fetchAndPlayMP3.js";
import callNextStop from "./util/callNextStop.js";
import getUserPosition from "./util/getPosition.js";

// Material UI
import { CssBaseline } from '@mui/material';

// Components
import TopAppBar from "./components/TopAppBar.jsx";
import MainPage from "./components/MainPage.jsx";
import TrackingPage from "./components/TrackingPage.jsx";

function App() {
    // Bus line number
    const [id, setId] = useState("");

    // Bus tracking
    const [tracking, setTracking] = useState("not tracking");

    // Users location
    const [latitude, setLatitude] = useState(61.503178);
    const [longitude, setLongitude] = useState(23.812778);

    const [error, setError] = useState(null);

    // Get user position
    useEffect(() => {
        getUserPosition(setLatitude, setLongitude, setError);
    }, []);


    return (
      <>
        <CssBaseline />
        <TopAppBar />
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
          <TrackingPage tracking={tracking} />
        )
        }
      </>
    )

    // return (
    //     <div
    //         style={{
    //             display: "flex",
    //             justifyContent: "center",
    //             alignItems: "center",
    //             flexDirection: "column",
    //             marginTop: "10rem",
    //         }}
    //     >
    //         <div>
    //             <input
    //                 type="text"
    //                 value={id}
    //                 onChange={(e) => setId(e.target.value)}
    //                 placeholder="Enter bus stop ID"
    //                 style={{ marginBottom: "1rem" }}
    //             />
    //             <button onClick={() => fetchAndPlayMP3(id)}>
    //                 Fetch and Play
    //             </button>
    //         </div>
    //         <div>Currently tracked bus: {tracking}</div>
    //         <div>
    //             <input
    //                 type="text"
    //                 value={linenro}
    //                 onChange={(e) => setLinenro(e.target.value)}
    //                 placeholder="Enter the bus line"
    //                 style={{ marginBottom: "1rem" }}
    //             />
    //             <input
    //                 type="text"
    //                 value={latitude}
    //                 onChange={(e) => setLatitude(e.target.value)}
    //                 placeholder="Enter your latitude"
    //                 style={{ marginBottom: "1rem" }}
    //             />
    //             <input
    //                 type="text"
    //                 value={longitude}
    //                 onChange={(e) => setLongitude(e.target.value)}
    //                 placeholder="Enter your longitude"
    //                 style={{ marginBottom: "1rem" }}
    //             />
    //             <button
    //                 onClick={() => {
    //                     if (checkValidBusLine(linenro)) {
    //                         getUserPosition(setLatitude, setLongitude, setError)
    //                             .then(() => {
    //                                 if (tracking === "not tracking") {
    //                                     fetchJourneys
    //                                         .fetchBus(
    //                                             linenro,
    //                                             latitude,
    //                                             longitude
    //                                         )
    //                                         .then((data) => setTracking(data));
    //                                 } else {
    //                                     setTracking("not tracking");
    //                                 }
    //                             })
    //                             .catch((error) => {
    //                                 // Handle error if getUserPosition fails
    //                                 console.error(
    //                                     "Error getting user position:",
    //                                     error
    //                                 );
    //                             });
    //                     }
    //                 }}
    //             >
    //                 Connect to bus
    //             </button>
    //         </div>
    //         {!validBusInput && (
    //             <div style={{ color: "red" }}>
    //                 The bus line number is not valid!
    //             </div>
    //         )}
    //         <div>
    //             <DisplayLocation fetchAndPlayMP3={fetchAndPlayMP3} />
    //         </div>
    //     </div>
    // );
}

export default App;
