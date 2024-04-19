import { useState } from "react";

const BusStopValidation = () => {
    const [stopId, setStopId] = useState("");

    return (
        <div>
            <input
                type="text"
                value={stopId}
                onChange={(e) => setStopId(e.target.value)}
                placeholder="Bussipysäkin numero"
                style={{ marginBottom: "1rem" }}
            />
        </div>
    );
};

export default BusStopValidation;
