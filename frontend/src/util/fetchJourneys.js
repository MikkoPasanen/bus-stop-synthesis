// Here's the URL for tracking the fetchBus's returned busId
// http://data.itsfactory.fi/journeys/api/1/vehicle-activity?vehicleRef=${vehicleId}

import haversine from "haversine-distance";

const fetchJourneys = {
    /**
     * Fetch a bus from the Journeys API based on the line number and the given
     * coordinates
     * @param {*} line
     * @param {*} latitude Latitude of user
     * @param {*} longitude Longitude of user
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
                    data.body.forEach((e) => {
                        const vehicleLatitude =
                            e.monitoredVehicleJourney.vehicleLocation.latitude;
                        const vehicleLongitude =
                            e.monitoredVehicleJourney.vehicleLocation.longitude;

                        const distance = haversine(
                            { latitude: latitude, longitude: longitude },
                            {
                                latitude: vehicleLatitude,
                                longitude: vehicleLongitude,
                            }
                        ).toFixed(0);

                        trackingBusList.push({
                            id: e.monitoredVehicleJourney.vehicleRef,
                            direction: e.monitoredVehicleJourney.directionRef,
                            distance: distance,
                        });
                    });

                    // Sort by distance in ascending order and remove all but
                    // first 2 elements
                    let filteredBusList = trackingBusList
                        .sort((a, b) => a.distance - b.distance)
                        .slice(0, 2);

                    // Check if 2nd nearest bus is within 20m of the nearest one
                    // if not, only return first bus
                    if (
                        !(
                            filteredBusList[1].distance -
                                filteredBusList[0].distance <
                            21
                        )
                    ) {
                        filteredBusList = filteredBusList.slice(0, 1);
                    }
                    /*
                    filteredBusList.forEach((e) => {
                        console.log(
                            `id: ${e.id}, direction: ${e.direction}, distance: ${e.distance}`
                        );
                    });

                    /*
                    console.log(
                        `trackingBusList length: ${trackingBusList.length}`
                    );
                    */
                    //return trackingBusList;

                    return filteredBusList;
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
