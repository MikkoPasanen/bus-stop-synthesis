import { useState } from "react";
import fetchJourneys from "./fetchJourneys";
import validBusLines from "./validBusLines";
import axios from "axios";
import DisplayLocation from "./DisplayLocation";

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
   * Fetches the prefix and the bus stop announcement mp3 files
   * and plays them in sequence
   */
  const fetchAndPlayMP3 = async () => {
    try {
      // Get the mp3 data from the localstorage
      let prefixData = localStorage.getItem("prefix");
      let announcementData = localStorage.getItem(id);

      // If the mp3 datas are not in the localstorage, fetch them from the backend
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
          `${import.meta.env.VITE_API_URL}/api/mp3/${id}`
        );
        announcementData = announcementResponse.data.mp3;
        localStorage.setItem(id, announcementData);
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
        <button onClick={() => fetchAndPlayMP3()}>Fetch and Play</button>
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
    </div>
  );
}

export default App;
