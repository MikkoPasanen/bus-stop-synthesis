// Here's the URL for tracking the fetchBus's returned busId
// http://data.itsfactory.fi/journeys/api/1/vehicle-activity?vehicleRef=${vehicleId}

const fetchJourneys = {
    /**
     * Fetch a bus from the Journeys API based on the line number and the given
     * coordinates
     * @param {*} line
     * @param {*} latitude
     * @param {*} longitude
     * @returns The closest's bus's vehicleRef in the Journeys API
     */
    fetchBus: async (line, latitude, longitude) => {
        try {
            let trackingBus;
            let shortestDistance = 1500; // Will be overridden with any actual distance on Earth
            return await fetch(
                `http://data.itsfactory.fi/journeys/api/1/vehicle-activity?lineRef=${line}`
            )
                .then((res) => res.json())
                .then((data) => {
                    data.body.forEach((e) => {
                        const busLocation =
                            e.monitoredVehicleJourney.vehicleLocation;
                        const distanceTo = Math.abs(
                            parseFloat(busLocation.latitude) -
                                latitude +
                                parseFloat(busLocation.longitude) -
                                longitude
                        );
                        if (distanceTo < shortestDistance) {
                            shortestDistance = distanceTo;
                            trackingBus = e.monitoredVehicleJourney.vehicleRef;
                        }
                    });
                    return trackingBus;
                });
        } catch (err) {
            console.log(err);
            return "could not be found";
        }
    },
};

export default fetchJourneys;
