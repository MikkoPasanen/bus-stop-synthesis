import { useState } from "react";
import fetchJourneys from "./fetchJourneys";
import axios from "axios";

function App() {
    const [id, setId] = useState("");
    // Default: Line 6, TAMK bus stop
    const [linenro, setLinenro] = useState(6);
    const [latitude, setLatitude] = useState(61.503178);
    const [longitude, setLongitude] = useState(23.812778);
    const [tracking, setTracking] = useState("not tracking");

    const fetchAndPlayMP3 = async () => {
        try {
            let prefixData = localStorage.getItem("prefix");
            let announcementData = localStorage.getItem(id);

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

            const prefixAudio = new Audio(
                `data:audio/mpeg;base64,${prefixData}`
            );
            const announcementAudio = new Audio(
                `data:audio/mpeg;base64,${announcementData}`
            );

            prefixAudio.play();
            prefixAudio.onended = () => {
                announcementAudio.play();
            };
        } catch (err) {
            console.error(err);
        }
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
                <button onClick={() => fetchAndPlayMP3()}>
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
                        if (tracking == "not tracking") {
                            fetchJourneys
                                .fetchBus(linenro, latitude, longitude)
                                .then((data) => setTracking(data));
                        } else {
                            setTracking("not tracking");
                        }
                    }}
                >
                    Connect to bus
                </button>
            </div>
        </div>
    );
}

export default App;
