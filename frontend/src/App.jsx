import { useState } from "react";
import axios from "axios";

function App() {
    const [id, setId] = useState("");

    const fetchMP3 = async () => {
        try {
            const response1 = await axios.get(
                `http://localhost:8080/api/mp3/${id}`
            );

            const response2 = await axios.get(
                `http://localhost:8080/api/prefix`
            );

            const prefix = new Audio(
                `data:audio/mpeg;base64,${response2.data.prefix}`
            );

            const announcement = new Audio(
                `data:audio/mpeg;base64,${response1.data.mp3}`
            );

            prefix.play();
            prefix.onended = () => {
                announcement.play();
            };

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column',
                  marginTop: '10rem'
                  }}>
            <input
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="Enter bus stop ID"
                style={{marginBottom: '1rem'}}
            />
            <button onClick={fetchMP3}>Fetch and Play</button>
        </div>
    );
}

export default App;
