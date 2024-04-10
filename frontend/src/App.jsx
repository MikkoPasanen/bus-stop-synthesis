import { useState } from "react";
import fetchJourneys from "./util/fetchJourneys.js";
import validBusLines from "./util/validBusLines.js";
import DisplayLocation from "./components/DisplayLocation.jsx";
import fetchAndPlayMP3 from "./util/fetchAndPlayMP3.js";

function App() {
  // Bus stop announcement ID, testing purposes for now
  const [id, setId] = useState("");

  // Default: Line 6, TAMK bus stop
  const [linenro, setLinenro] = useState(6);

  // Users location
  const [latitude, setLatitude] = useState(61.503178);
  const [longitude, setLongitude] = useState(23.812778);

  // Bus tracking
  const [tracking, setTracking] = useState("not tracking");

  // Valid bus line input
  const [validBusInput, setValidBusInput] = useState(true);

  /**
   * Checks if the bus line number is valid by
   * comparing it to the valid bus lines array
   *
   * @param {*} linenro
   * @returns true if the bus line number is valid, false otherwise
   */
  const checkValidBusLine = (linenro) => {
    const validBusLine = validBusLines.includes(linenro);
    setValidBusInput(validBusLine);
    return validBusLine;
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        marginTop: "10rem",
      }}
    >
      <div>
        <input
          type="text"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="Enter bus stop ID"
          style={{ marginBottom: "1rem" }}
        />
        <button onClick={() => fetchAndPlayMP3(id)}>Fetch and Play</button>
      </div>
      <div>Currently tracked bus: {tracking}</div>
      <div>
        <input
          type="text"
          value={linenro}
          onChange={(e) => setLinenro(e.target.value)}
          placeholder="Enter the bus line"
          style={{ marginBottom: "1rem" }}
        />
        <input
          type="text"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
          placeholder="Enter your latitude"
          style={{ marginBottom: "1rem" }}
        />
        <input
          type="text"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
          placeholder="Enter your longitude"
          style={{ marginBottom: "1rem" }}
        />
        <button
          onClick={() => {
            if (checkValidBusLine(linenro)) {
              if (tracking == "not tracking") {
                fetchJourneys
                  .fetchBus(linenro, latitude, longitude)
                  .then((data) => setTracking(data));
              } else {
                setTracking("not tracking");
              }
            }
          }}
        >
          Connect to bus
        </button>
      </div>
      {!validBusInput && (
        <div style={{ color: "red" }}>The bus line number is not valid!</div>
      )}
      <div>
        <DisplayLocation fetchAndPlayMP3={fetchAndPlayMP3}/>
      </div>
    </div>
  );
}

export default App;
