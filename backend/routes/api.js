const express = require('express');
const database = require('../database/methods');

const apiRouter = express.Router();

apiRouter.get('/mp3/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await database.fetchBusStopAnnouncement(id);

        const mp3 = result[0].announcement.toString('base64');

        res.json({ mp3 });
    } catch (err) {
        res.status(err.status).json({ message: err.message });
    }
});

apiRouter.get('/prefix', async (req, res) => {
    try {
        const result = await database.fetchPrefixAnnouncement();

        const prefix = result[0].announcement.toString('base64');

        res.json({ prefix });
    } catch (err) {
        res.status(err.status).json({ message: err.message });
    }
});

module.exports = apiRouter;