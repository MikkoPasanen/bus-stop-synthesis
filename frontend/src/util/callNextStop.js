// ID of the next stop.
let nextStopID = undefined;
// Whether or not the upcoming stop has been called.
let hasBeenCalled = false;

/**
 *
 * @param {int} stopID ID of the next stop
 * @param {int} timeDifferenceInMinutes Time difference to the next stop
 * @returns true if stop should be called, false if it shouldn't
 */
const callNextStop = (stopID, timeDifferenceInMinutes) => {
    // Update StopID and called status
    if (stopID != nextStopID) {
        nextStopID = stopID;
        hasBeenCalled = false;
    }

    // Call if less than 30 seconds away
    if (timeDifferenceInMinutes < 1 && !hasBeenCalled) {
        hasBeenCalled = true;
        return true;
    }

    return false;
};

export default callNextStop;
