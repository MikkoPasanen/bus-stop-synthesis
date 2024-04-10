const express = require('express');
const cors = require('cors');
const apiRouter = require('./routes/api');
const { json } = require('express');

const app = express();
app.use(cors({ origin: "http://localhost:5173 "}));
app.use(json());
app.use(express.static("./frontend/dist"));

app.use('/api', apiRouter);


app.listen(8080, () => {
    console.log('Server is running on port 8080');
})
.on('error', (err) => {
    console.log('Error while starting server', err);
});