const pool = require('./dbConfig');

module.exports = {
    fetchBusStopAnnouncement: (id) => {
        return new Promise((resolve, reject) => {
            const sql = "SELECT announcement FROM bus_stops WHERE id = ?";
            pool.query(sql, [id], (err, result) => {
                if (err) {
                    reject({status: 500, message: err});
                } else {
                    resolve(result);
                }
            });
        })
    }
};