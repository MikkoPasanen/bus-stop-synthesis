const express = require('express');
const database = require('../database/methods');

const apiRouter = express.Router();

apiRouter.get('/bus-stop-announcement/:id', async (req, res) => {
    try {
        const id = req.params.id;

        const result = await database.fetchBusStopAnnouncement(id);

        const mp3 = result[0].announcement.toString('base64');

        res.json({ mp3 });
    } catch (err) {
        res.status(err.status).json({ message: err.message });
    }
});

module.exports = apiRouter;