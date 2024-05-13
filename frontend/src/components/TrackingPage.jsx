/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";

// Util
import callNextStop from "../util/callNextStop.js";
import fetchAndPlayMP3 from "../util/fetchAndPlayMP3.js";

import axios from "axios";

// Material UI
import { Box, Typography, Button } from "@mui/material";

export default function TrackingPage({ tracking, setTracking, linenro }) {
    const [stopLocationName, setStopLocationName] = useState("");

    // Everytime the tracking state changes, fetch the bus info
    useEffect(() => {
        let timeoutId;
        let isMounted = true;

        // Fetch bus info every 5 seconds recursively
        const fetchAndSchedule = async () => {
            if (tracking !== "not tracking") {
                await fetchBusInfo(tracking);
                timeoutId = setTimeout(fetchAndSchedule, 5000);
            }
        };

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
                `https://data.itsfactory.fi/journeys/api/1/vehicle-activity?vehicleRef=${vehicleId}`
            )
                .then((res) => res.json())
                .then((data) => {
                    if (!isMounted) return;
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

                    fetchStopName(parsedStopId);
                    // Check if the stop name should be called
                    if (callNextStop(parsedStopId, timeDifferenceInMinutes)) {
                        fetchAndPlayMP3(parseInt(parsedStopId));
                    }
                });
        };

        /**
         * Fetches the stop name from the given stopId
         *
         * @param {*} stopId
         */
        const fetchStopName = async (stopId) => {
            try {
                const response = await axios.get(
                    `https://data.itsfactory.fi/journeys/api/1/stop-points/${stopId}`
                );
                setStopLocationName(response.data.body[0].name);
            } catch (error) {
                console.error(error);
            }
        };

        fetchAndSchedule();

        // When the component unmounts, clear the timeout so it stops fetching
        return () => {
            isMounted = false;
            if (timeoutId) {
                clearTimeout(timeoutId);
                // Reset function's memory
            }
            callNextStop(undefined);
        };
    }, [tracking]);

    const stopTracking = () => {
        setTracking("not tracking");
    };

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                maxWidth: "90vw",
                marginLeft: "auto",
                marginRight: "auto",
            }}
        >
            <Typography
                variant="h5"
                sx={{
                    fontWeight: "bold",
                    mt: "1.5rem",
                    textAlign: "center",
                }}
            >
                Seurataan linjaa numero:
            </Typography>
            <Typography
                variant="h5"
                sx={{
                    fontWeight: "bold",
                    textAlign: "center",
                    fontSize: "3rem",
                }}
            >
                {linenro}
            </Typography>

            <Box
                sx={{
                    position: "relative",
                    width: "96vw",
                    maxWidth: 450,
                    height: "96vw",
                    maxHeight: 400,
                    borderRadius: "50%",
                    bgcolor: "#1d77e6",
                    zIndex: -1,
                    top: "10%",
                }}
            >
                <Typography
                    sx={{
                        mt: "4.5rem",
                        fontSize: "1.5rem",
                        color: "white",
                        fontWeight: "bold",
                        textAlign: "center",
                    }}
                >
                    Seuraava pysäkki:
                </Typography>

                <Typography
                    sx={{
                        mt: "5rem",
                        fontSize: "2.5rem",
                        color: "white",
                        fontWeight: "bold",
                        textAlign: "center",
                    }}
                >
                    {stopLocationName}
                </Typography>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        marginTop: "20vh",
                        maxWidth: "74%",
                        alignItems: "center",
                        marginLeft: "auto",
                        marginRight: "auto",
                        "@media (max-height: 990px)": {
                            marginTop: "240px",
                            marginBottom: "20px",
                        },
                        "@media (max-height: 770px)": {
                            marginTop: "180px",
                            marginBottom: "20px",
                        },
                        "@media (max-width: 400px)": {
                            maxWidth: "90%",
                        },
                    }}
                >
                    <Button
                        variant="contained"
                        sx={{
                            borderRadius: "40px",
                            fontSize: "1.5rem",
                            fontWeight: "bold",
                            padding: "1.5rem",
                        }}
                        onClick={() => stopTracking()}
                    >
                        Lopeta seuranta
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}
