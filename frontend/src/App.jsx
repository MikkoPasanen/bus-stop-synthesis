import { useState, useEffect } from "react";
import fetchJourneys from "./util/fetchJourneys.js";
import validBusLines from "./util/validBusLines.js";
import DisplayLocation from "./components/DisplayLocation.jsx";
import fetchAndPlayMP3 from "./util/fetchAndPlayMP3.js";
import callNextStop from "./util/callNextStop.js";
<<<<<<< HEAD
import { CssBaseline } from "@mui/material";

import TopAppBar from "./components/TopAppBar.jsx";
=======
import getUserPosition from "./util/getPosition.js";
>>>>>>> 467ce1a71cb2e3422b1bf8ec61bf0214ac85f062

function App() {
  // Bus stop announcement ID, testing purposes for now
  const [id, setId] = useState("");

  // Default: Line 6, TAMK, Teiskontie bus stop
  const [linenro, setLinenro] = useState(6);

  // Users location
  const [latitude, setLatitude] = useState(61.503178);
  const [longitude, setLongitude] = useState(23.812778);

  const [error, setError] = useState(null);

  // Get user position
  useEffect(() => {
    getUserPosition(setLatitude, setLongitude, setError);
  }, []);

  // Bus tracking
  const [tracking, setTracking] = useState("not tracking");

  // Valid bus line input
  const [validBusInput, setValidBusInput] = useState(true);

  // Everytime the tracking state changes, fetch the bus info
  useEffect(() => {
    let timeoutId;

    // Fetch bus info every 5 seconds recursively
    const fetchAndSchedule = async () => {
      if (tracking !== "not tracking") {
        await fetchBusInfo(tracking);
        timeoutId = setTimeout(fetchAndSchedule, 5000);
      }
    };

    fetchAndSchedule();

    return (
        <>
            <CssBaseline />
            <TopAppBar></TopAppBar>
        </>
    );

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
    //                         if (tracking == "not tracking") {
    //                             fetchJourneys
    //                                 .fetchBus(linenro, latitude, longitude)
    //                                 .then((data) => setTracking(data));
    //                         } else {
    //                             setTracking("not tracking");
    //                         }
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
