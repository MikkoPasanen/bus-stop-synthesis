import { useState } from "react";
import axios from "axios";

function App() {
    const [id, setId] = useState("");

    const fetchMP3 = async () => {
        try {
            console.log("Fetching MP3 from fontend")
            const response = await axios.get(
                `http://localhost:8080/api/mp3/${id}`
            );
            const audioElement = new Audio(
                `data:audio/mpeg;base64,${response.data.mp3}`
            );
            audioElement.play();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <input
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="Enter MP3 ID"
            />
            <button onClick={fetchMP3}>Fetch and Play</button>
        </div>
    );
}

export default App;
