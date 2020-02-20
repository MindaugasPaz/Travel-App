// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Require Express to run server and routes
const express = require('express');
const https = require('https');

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
app.get('/all', sendData);

function sendData (request, response) {
    response.json(projectData);
}

// POST route
app.post('/addWeatherData', addData);

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

app.get('/callWeatherAPI', sendWeatherData);

async function sendWeatherData (request, response) {
    const latitude = request.query.latitude;
    const longitude = request.query.longitude;
    const tripDate = request.query.date;
    let temperature = await callExternalAPI(latitude, longitude, tripDate)
        .then( (data) => {
            return data;
        })
        .catch((e) => {
            console.log('error', e)
        })
    response.json(temperature);
}

function callExternalAPI(lat, lng, date) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.darksky.net',
            port: 443,
            path: '/forecast/b144ed645a10cba2f973e8ab02fd4d24/' + lat + ',' + lng + ',' + date,
            method: 'GET'
        }

        const req = https.request(options, res => {
            console.log(`statusCode: ${res.statusCode}`)
            let data = '';
            // (string concatination) adding response to string until stream is over
            res.on('data', chunk => {
                data += chunk;
            })
            res.on('end', () => {
                try {
                    data = JSON.parse(data);
                } catch(e) {
                    reject(e);
                }
                resolve(data);
            })
        })
        req.end();
    }
)}
