// Setup empty JS object to act as endpoint for all routes
projectData = {};
pictureData = {};

// Require Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();

/* Dependencies */
const bodyParser = require('body-parser');

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

// Initialize the main project folder
app.use(express.static('dist'));
const port = 8080;

//Spin up the server
const server = app.listen(port, listening);

// Callback to debug
function listening(){
    console.log('server running');
    console.log(`running on localhost: ${port}`);
};

//GET route that returns the projectData object
app.get('/all', sendData)

function sendData (request, response) {
    response.send(projectData)
}

// POST route
app.post('/addWeatherData', addData)

function addData(request, response) {
    projectData.latitude = request.body.latitude;
    projectData.longitude = request.body.longitude;
    projectData.temperature = request.body.temperature;
    projectData.tripDate = request.body.tripDate;
    projectData.pictureURL = request.body.url;
    // projectData.country = request.body.country;
    response.end();
    console.log(projectData)
}

app.get('/pictureURL', sendPicData)

function sendPicData (request, response) {
    response.send(pictureData)
}

// POST route
app.post('/addPicData', addPicData)

function addPicData(request, response) {
    pictureData.url = request.body.url;
    response.end();
    console.log(pictureData)
}
