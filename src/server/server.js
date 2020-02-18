// Setup empty JS object to act as endpoint for all routes
projectData = {};

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
    response.json(projectData)
}

// POST route
app.post('/addWeatherData', addData)

function addData(request, response) {
    projectData.latitude = request.body.latitude;
    projectData.longitude = request.body.longitude;
    projectData.temperature = request.body.temperature;
    projectData.tripStartDate = request.body.tripStartDate;
    projectData.tripEndDate = request.body.tripEndDate;
    projectData.cityName = request.body.cityName;
    projectData.pictureURL = request.body.url;
    projectData.country = request.body.country;
    response.json(projectData);
    console.log(projectData)
}
module.exports = app;