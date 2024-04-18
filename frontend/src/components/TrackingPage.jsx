/* eslint-disable react/prop-types */
import { useEffect } from "react";

// Util
import callNextStop from "../util/callNextStop.js";
import fetchAndPlayMP3 from "../util/fetchAndPlayMP3.js";

// Material UI
import { Box, Typography, Button } from '@mui/material';

export default function TrackingPage({ tracking, setTracking }) {


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

                    // Check if the stop name should be called
                    if (callNextStop(parsedStopId, timeDifferenceInMinutes)) {
                        fetchAndPlayMP3(parseInt(parsedStopId));
                    }
                });
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
            }}
        >
            <Typography variant="h5" sx={{ fontWeight: "bold", mt: "7rem" }}>
                Tracking: {tracking}
            </Typography>
            <Button
                variant="contained"
                sx={{ mt: "2rem", borderRadius: "40px", fontSize: "1.2rem" }}
                onClick={() => stopTracking()}
            >
                Lopeta seuranta
            </Button>
        </Box>
    );
}