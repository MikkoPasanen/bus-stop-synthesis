import { useState, useEffect } from "react";
import fetchJourneys from "./util/fetchJourneys.js";
import validBusLines from "./util/validBusLines.js";
import DisplayLocation from "./components/DisplayLocation.jsx";
import fetchAndPlayMP3 from "./util/fetchAndPlayMP3.js";

function App() {
    // Bus stop announcement ID, testing purposes for now
    const [id, setId] = useState("");

    // Default: Line 6, TAMK, Teiskontie bus stop
    const [linenro, setLinenro] = useState(6);

    // Users location
    const [latitude, setLatitude] = useState(61.503178);
    const [longitude, setLongitude] = useState(23.812778);

    // Bus tracking
    const [tracking, setTracking] = useState("not tracking");

    // Valid bus line input
    const [validBusInput, setValidBusInput] = useState(true);

    // The next stop
    const [nextStop, setNextStop] = useState("hello");

    // Has the next stop been called?
    const [hasBeenCalled, setHasBeenCalled] = useState(false);

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

        // When the component unmounts, clear the timeout so it stops fetching
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [tracking]);

    /**
     * Fetches the bus info from the given vehicleId
     * and plays the mp3 file if the bus is arriving
     * in less than 30 seconds
     *
     * @param {*} vehicleId
     */
    const fetchBusInfo = (vehicleId) => {
        // Fetch the bus info from the given vehicleId
        fetch(
            `http://data.itsfactory.fi/journeys/api/1/vehicle-activity?vehicleRef=${vehicleId}`
        )
            .then((res) => res.json())
            .then((data) => {
                // Get the next arrival time and the stop ID
                let nextArrivalTime =
                    data.body[0].monitoredVehicleJourney.onwardCalls[0]
                        .expectedArrivalTime;
                let stopId =
                    data.body[0].monitoredVehicleJourney.onwardCalls[0]
                        .stopPointRef;

                // Parse the time and calculate the time difference
                let parsedTime = new Date(nextArrivalTime);
                let currentTime = new Date();
                let timeDifference = parsedTime - currentTime;

                // Calculate the time difference,
                // dividing difference (milliseconds) by 30000 (milliseconds)
                // to get the difference in minutes
                // So if the result is less than 1, the bus is arriving in less than 30 seconds
                let timeDifferenceInMinutes = Math.floor(
                    timeDifference / 30000
                );

                // Parse the stop ID to get the last part of the URL
                let parsedStopId = stopId.split("/").pop();

                console.log(timeDifferenceInMinutes);
                console.log(parsedStopId);

                // If the next stop is different from the fetched stop, update the information
                if (nextStop != parsedStopId) {
                    console.log(`Passed pysäkki: ${nextStop}`);
                    setNextStop(parsedStopId);
                    setHasBeenCalled(false);
                }

                if (timeDifferenceInMinutes <= 1 && !hasBeenCalled) {
                    console.log(`Calling: ${nextStop}`);
                    setHasBeenCalled(true);
                    fetchAndPlayMP3(parsedStopId);
                }
            });
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
                <button onClick={() => fetchAndPlayMP3(id)}>
                    Fetch and Play
                </button>
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
                <div style={{ color: "red" }}>
                    The bus line number is not valid!
                </div>
            )}
            <div>
                <DisplayLocation fetchAndPlayMP3={fetchAndPlayMP3} />
            </div>
        </div>
    );
}

export default App;
