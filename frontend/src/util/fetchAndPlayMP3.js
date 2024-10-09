import axios from "axios";

/**
 * Fetches the prefix and the bus stop announcement mp3 files
 * and plays them in sequence
 */
const fetchAndPlayMP3 = async (stopName) => {
    try {
        // Get the mp3 data from the localstorage
        let announcementData = localStorage.getItem(stopName);

        // If the mp3 datas are not in the localstorage, fetch them from the backend
        // and save them to the localstorage

        if (!announcementData) {
            const announcementResponse = await axios.get(
                `${import.meta.env.VITE_API_URL}/mp3/${stopName}`
            );
            announcementData = announcementResponse.data.mp3;
            localStorage.setItem(stopName, announcementData);
        }

        // Make the audio files from the base64 strings
        const announcementAudio = new Audio(
            `data:audio/mpeg;base64,${announcementData}`
        );

        // First play the prefix audio and then the announcement audio
        // after the prefix audio has ended
        announcementAudio.play();
    } catch (err) {
        console.error(err);
    }
};

export default fetchAndPlayMP3;