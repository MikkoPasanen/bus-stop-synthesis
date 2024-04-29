// Here's the URL for tracking the fetchBus's returned busId
// http://data.itsfactory.fi/journeys/api/1/vehicle-activity?vehicleRef=${vehicleId}

const fetchJourneys = {
    /**
     * Fetch a bus from the Journeys API based on the line number and the given
     * coordinates
     * @param {*} line
     * @param {*} latitude
     * @param {*} longitude
     * @returns A list of the buses on that line
     */
    fetchBus: async (line, latitude, longitude) => {
        try {
            let trackingBusList = [];
            return await fetch(
                `https://data.itsfactory.fi/journeys/api/1/vehicle-activity?lineRef=${line}`
            )
                .then((res) => res.json())
                .then((data) => {
                    // Temp arr to test calling of ChooseBusScreen
                    let firstTwoItems = data.body.slice(0, 2);

                    // Change firstTwoItems back to data.body once done testing
                    firstTwoItems.forEach((e) => {
                        //Latitude = e.monitoredVehicleJourney.vehicleLocation.latitude
                        //Longitude = e.monitoredVehicleJourney.vehicleLocation.longitude

                        // TODO: Only call this if the bus is a certain distance from the user.
                        trackingBusList.push({
                            id: e.monitoredVehicleJourney.vehicleRef,
                            direction: e.monitoredVehicleJourney.directionRef,
                        });
                    });

                    /*
                    console.log(
                        `trackingBusList length: ${trackingBusList.length}`
                    );
                    */

                    console.log(`trackingBusList: ${trackingBusList}`);

                    return trackingBusList;
                });
        } catch (err) {
            console.log(err);
            return "could not be found";
        }
    },
    fetchLine: async (line) => {
        try {
            return await fetch(
                `https://data.itsfactory.fi/journeys/api/1/lines?name=${line}`
            )
                .then((res) => res.json())
                .then((data) => {
                    return data.body[0].description;
                });
        } catch (err) {
            console.log(err);
            return null;
        }
    },
};

export default fetchJourneys;
