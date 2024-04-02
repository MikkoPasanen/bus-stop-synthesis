import { useState } from "react";
import axios from "axios";

function App() {
    const [id, setId] = useState("");

    const fetchAndPlayMP3 = async () => {
    try {
        let prefixData = localStorage.getItem("prefix");
        let announcementData = localStorage.getItem(id);

        if (!prefixData) {
            const prefixResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/prefix`);
            prefixData = prefixResponse.data.prefix;
            localStorage.setItem("prefix", prefixData);
        }

        if (!announcementData) {
            const announcementResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/mp3/${id}`);
            announcementData = announcementResponse.data.mp3;
            localStorage.setItem(id, announcementData);
        }

        const prefixAudio = new Audio(`data:audio/mpeg;base64,${prefixData}`);
        const announcementAudio = new Audio(`data:audio/mpeg;base64,${announcementData}`);

        prefixAudio.play();
        prefixAudio.onended = () => {
            announcementAudio.play();
        };

    } catch (err) {
        console.error(err);
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
            <button onClick={() => fetchAndPlayMP3()}>Fetch and Play</button>
        </div>
    );
}

export default App;
