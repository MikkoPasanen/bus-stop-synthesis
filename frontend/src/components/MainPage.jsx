/* eslint-disable react/prop-types */
import { useState } from "react";

// Util
import validBusLines from "../util/validBusLines.js";
import fetchJourneys from "../util/fetchJourneys.js";
import reverseWordOrder from "../util/reverseWordOrder.js";
import getUserPosition from "../util/getPosition.js";
import ChooseBusScreen from "./ChooseBusScreen.jsx";
import busIcon from "../assets/bus-icon.png";

// Material UI
import {
    Box,
    TextField,
    Typography,
    Button,
    Snackbar,
    Alert,
    CircularProgress,
} from "@mui/material";

export default function MainPage({
    linenro,
    setLinenro,
    setTracking,
    latitude,
    longitude,
    setLatitude,
    setLongitude,
    setError,
    tracking,
}) {
    // Errors
    const [linenroError, setLinenroError] = useState(false);

    // Loading state
    const [loading, setLoading] = useState(false);

    // Select bus screen
    const [openChooseBusScreen, setOpenChooseBusScreen] = useState(false);

    // To wait for user input
    const [userSelection, setUserSelection] = useState(null);

    // Line description holders
    const [firstBus, setFirstBus] = useState(null);
    const [secondBus, setSecondBus] = useState(null);

    // Store nearest bus data
    const [busData, setBusData] = useState(null);

    /**
     * Checks if the bus line number is valid by
     * comparing it to the valid bus lines array
     *
     * @param {*} linenro
     * @returns true if the bus line number is valid, false otherwise
     */
    const checkValidBusLine = (linenro) => {
        const validBusLine = validBusLines.includes(linenro);
        setLinenroError(!validBusLine);
        return validBusLine;
    };

    /**
     * Handles the closing of the snackbar
     * @param {Event} event - The event that triggered the function
     * @param {string} reason - The reason for the function call
     */
    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setLinenroError(false);
    };

    // Set the tracking ID with the selected ID
    const handleUserSelection = (selectedId) => {
        console.log(`handleUserSelection selectedId: ${selectedId}`);
        setTracking(selectedId);
    };

    /**
     * When called, change the tracking state to the given bus line number
     * and start tracking the bus stops (TrackingPage.jsx)
     *
     * @param {*} linenro - The bus line number
     */
    const trackStops = (linenro) => {
        setLoading(true);

        if (!checkValidBusLine(linenro)) {
            setLoading(false);
            return;
        }

        getUserPosition(setLatitude, setLongitude, setError)
            .then(() => {
                if (tracking === "not tracking") {
                    return fetchJourneys
                        .fetchBus(linenro, latitude, longitude)
                        .then((data) => {
                            setBusData(data);
                            console.log(`data length: ${data.length}`);
                            if (data.length > 1) {
                                return new Promise((resolve, reject) => {
                                    fetchJourneys
                                        .fetchLine(linenro)
                                        .then((lineDesc) => {
                                            if (lineDesc != null) {
                                                let reversed =
                                                    reverseWordOrder(lineDesc);

                                                const firstBus = {
                                                    id: data[0].id,
                                                    description: lineDesc,
                                                };

                                                const secondBus = {
                                                    id: data[1].id,
                                                    description: reversed,
                                                };
                                                setFirstBus(firstBus);
                                                setSecondBus(secondBus);
                                                setOpenChooseBusScreen(true);

                                                let multipleChoice = [];
                                                data.forEach((e) => {
                                                    if (e.direction === 1) {
                                                        multipleChoice.push({
                                                            id: e.id,
                                                            description:
                                                                lineDesc,
                                                        });
                                                    } else {
                                                        multipleChoice.push({
                                                            id: e.id,
                                                            description:
                                                                reversed,
                                                        });
                                                    }
                                                });
                                                console.log(multipleChoice);

                                                // Resolve the promise with the user's selection
                                                resolve(multipleChoice);
                                            } else {
                                                reject(
                                                    "Error fetching line description"
                                                );
                                            }
                                        });
                                });
                            } else {
                                // Set user selection to the first index
                                return [{ id: data[0].id }];
                            }
                        });
                } else {
                    setTracking("not tracking");
                    return Promise.resolve(); // Return a resolved promise
                }
            })
            .then((userSelection) => {
                //console.log("User selection:", userSelection);
                // Set user selection
                setUserSelection(userSelection[0].id);
                if (userSelection.length == 1) {
                    handleUserSelection(userSelection[0].id);
                }
            })
            .catch((error) => {
                // Handle any errors
                console.error("Error in trackStops:", error);
            })
            .finally(() => {
                setLoading(false); // Set loading to false after everything is done
            });
    };

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
            }}
        >
            <Box
                sx={{
                    position: "absolute",
                    width: 450,
                    height: 400,
                    borderRadius: "50%",
                    bgcolor: "#1d77e6",
                    zIndex: -1,
                    top: "10%",
                }}
            />

            <Box
                sx={{
                    position: "relative",
                    zIndex: 1,
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Typography
                    sx={{
                        pt: "5rem",
                        pb: "1rem",
                        fontSize: "1.5rem",
                        textAlign: "center",
                        color: "white",
                        fontWeight: "bold",
                    }}
                >
                    Syötä haluamasi Nyssen <br /> linjan numero
                </Typography>
                <TextField
                    required
                    label="Linjan numero"
                    value={linenro}
                    onChange={(e) => setLinenro(e.target.value)}
                    error={linenroError}
                    sx={{
                        bgcolor: "white",
                        borderRadius: "10px",
                        border: "1px solid black",
                    }}
                />
                <Button
                    variant="contained"
                    sx={{
                        mt: "3rem",
                        borderRadius: "40px",
                        fontSize: "1.2rem",
                        bgcolor: "white",
                        border: "1px solid black",
                        padding: "1.5rem",
                        "&:active": {
                            backgroundColor: "white",
                        },
                    }}
                    value={linenro}
                    onClick={() => trackStops(linenro)}
                >
                    {loading ? (
                        <>
                            <Typography
                                sx={{ color: "black", fontWeight: "bold" }}
                            >
                                Haetaan linjoja...
                            </Typography>
                            <CircularProgress
                                size={20}
                                sx={{ ml: 2 }}
                                color="secondary"
                            />
                        </>
                    ) : (
                        <Typography sx={{ color: "black", fontWeight: "bold" }}>
                            Seuraa linjaa
                        </Typography>
                    )}
                </Button>
            </Box>

            <img
                src={busIcon}
                alt="Bus icon"
                width="300"
                height="300"
                style={{ position: "absolute", bottom: 0 }}
            />

            <Snackbar
                open={linenroError}
                autoHideDuration={5000}
                onClose={handleClose}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert
                    severity="error"
                    onClose={handleClose}
                    variant="filled"
                    sx={{ fontSize: "1.2rem", mt: "13%" }}
                >
                    Linjan numero ei ole kelvollinen
                </Alert>
            </Snackbar>

            <ChooseBusScreen
                open={openChooseBusScreen}
                setOpen={setOpenChooseBusScreen}
                lineDesc={firstBus}
                lineDescReversed={secondBus}
                onSelect={handleUserSelection}
            />
        </Box>
    );
}
