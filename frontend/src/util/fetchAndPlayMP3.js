import axios from "axios";

/**
 * Fetches the prefix and the bus stop announcement mp3 files
 * and plays them in sequence
 */
const fetchAndPlayMP3 = async (id) => {
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

export default fetchAndPlayMP3;