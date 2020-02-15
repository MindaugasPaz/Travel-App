// let baseURL = 'https://api.openweathermap.org/data/2.5/weather?zip=';
// let key = '661daa7377189bfe425b6af1f07ac279';

//geonames API
let coordinatesAPI = 'http://api.geonames.org/postalCodeSearchJSON?placename=';
let coordinatesKey = '&maxRows=10&username=mindpaz';

//darkSky API
//https://api.darksky.net/forecast/[key]/[latitude],[longitude],[time]
let weatherAPI = 'https://api.darksky.net/forecast/b144ed645a10cba2f973e8ab02fd4d24/';

let pixabayAPI = 'https://pixabay.com/api/?key=15273121-5e9553185566e2219c94b636e&q=';

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

document.getElementById('generate').addEventListener('click', performAction);

function performAction(e){
    e.preventDefault();
    const cityName = document.getElementById('zip').value;
    const tripDate = document.getElementById("start").value;
    let allProjectData = {tripDate: tripDate};
    const tripDateUnix = new Date(tripDate).getTime() / 1000;
    console.log(tripDateUnix, 'trip date in UNIX')
    console.log(newDate);
    getCoordinates(coordinatesAPI, cityName, coordinatesKey)
    .then(function (data){
        allProjectData.latitude = data.postalCodes[0].lat;
        allProjectData.longitude = data.postalCodes[0].lng;
        // Add data to POST request
        // postData('http://localhost:8080/addWeatherData', {latitude: data.postalCodes[0].lat, longitude: data.postalCodes[0].lng, tripDate: tripDate } )
        // Function which updates UI
        // .then(function() {
        //     updateUI()
        // })
            getTemperature(allProjectData.latitude, allProjectData.longitude, tripDateUnix)
            .then(function(data){
                allProjectData.temperature = data.currently.temperature;
                // postData('http://localhost:8080/addWeatherData', {latitude: data.latitude, longitude: data.longitude, temperature: data.currently.temperature, tripDate: tripDate } )
                // .then(function(){
                    getPicture(pixabayAPI, cityName)
                    .then(function(data){
                        allProjectData.url = data.hits[0].webformatURL;
                        console.log('kazkas', data);
                        // postData('http://localhost:8080/addPicData', {url: data.hits[0].webformatURL})
                        // .then(function() {
                            postData('http://localhost:8080/addWeatherData', allProjectData)
                            .then(function(){
                                updateUI()
                            })
                        })
                    })
                // })
            // })
    })
}

// Async GET coordinates
const getCoordinates = async (coordinatesAPI, city, coordinatesKey)=>{
    const response = await fetch(coordinatesAPI + city + coordinatesKey)
    // console.log(response);
    try {
        const data = await response.json();
        console.log('cia', data);
        console.log('PIRMAS');
        return data;
    }
    catch(error) {
        console.log('error', error);
    }
}

// Async GET temperature
const getTemperature = async (lat, lng, tripDateUnix)=>{
    // const response = await fetch('http://localhost:8080/all')
    // const allData = await response.json();
    try {
        const weather = await fetch(weatherAPI + lat +',' + lng + ',' + tripDateUnix);
        const data = await weather.json();
        console.log(data, 'cia');
        return data;
    }
    catch(error) {
        console.log('error', error);
    }
}

const getPicture = async (pixabayAPI, city)=>{
    const response = await fetch(pixabayAPI + city)
    try {
        const data = await response.json();
        console.log('paveiksliukas', data)
        return data;
    }
    catch(error) {
        console.log('error', error);
    }
}

// Async POST
const postData = async (url = '', data = {}) => {
    const postRequest = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    try {
        console.log('ANTRAS');
        const newData = await postRequest.json();
        console.log(newData, 'ANTRAS VEL');
        return newData;
    }
    catch (error) {
        console.log('Error', error);
    }
}

// Update user interface
const updateUI = async () => {
    const request = await fetch('http://localhost:8080/all');
    try {
        const allData = await request.json();
        console.log('TRECIAS');
        document.getElementById('date').innerHTML = allData.latitude;
        document.getElementById('temp').innerHTML = allData.longitude;
        //calculating to celsius
        document.getElementById('content').innerHTML = (allData.temperature - 32) /1.8;
    }
    catch (error) {
        console.log('error', error);
    }
}

export { performAction }