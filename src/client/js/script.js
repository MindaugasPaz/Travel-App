//geonames API
let coordinatesAPI = 'http://api.geonames.org/postalCodeSearchJSON?placename=';
// let coordinatesKey = '&maxRows=10&username=mindpaz';

let pixabayAPI = 'https://pixabay.com/api/?key=' + process.env.pixabayKey;

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

if(document.getElementById('generate')){
    document.getElementById('generate').addEventListener('click', performAction)
}

function performAction(e){
    e.preventDefault();
    const cityName = document.getElementById('city').value;
    const tripStartDate = document.getElementById("start").value;
    const tripEndDate = document.getElementById("end").value;
    const visibleOutput = document.querySelector(".hidden");
    let allProjectData = {tripStartDate: tripStartDate, cityName: cityName, tripEndDate: tripEndDate};
    const tripDateUnix = new Date(tripStartDate).getTime() / 1000;
    //invoking countdown function
    const startCountDown = countDown(tripStartDate);
    //invoking duration function
    const StartTripDuration = tripDuration(tripStartDate, tripEndDate);
    getCoordinates(coordinatesAPI, cityName, process.env.coordinatesKey)
    .then(function (data){
        allProjectData.latitude = data.postalCodes[0].lat;
        allProjectData.longitude = data.postalCodes[0].lng;
        allProjectData.country = data.postalCodes[0].countryCode;
        getTemperatureAPI(allProjectData.latitude, allProjectData.longitude, tripDateUnix)
            .then(function (data) {
                allProjectData.temperature = data.currently.temperature;
                getPicture(pixabayAPI, cityName)
                    .then(function (data) {
                        allProjectData.url = data.hits[0].webformatURL;
                        postData('http://localhost:8080/addWeatherData', allProjectData)
                            .then(function () {
                                updateUI() && visibleOutput.classList.add("visible")
                            })
                    })
            })
    })
}

// Async GET coordinates
const getCoordinates = async (coordinatesAPI, city, coordinatesKey)=>{
    const response = await fetch(coordinatesAPI + city + coordinatesKey)
    try {
        const data = await response.json();
        return data;
    }
    catch(error) {
        console.log('error', error);
    }
}

//from server side
const getTemperatureAPI = async (lat, lng, tripDateUnix)=>{
    try {
        const weather = await fetch('http://localhost:8080/callWeatherAPI?latitude=' + lat + '&longitude=' + lng + '&date=' + tripDateUnix);
        const data = await weather.json();
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
        const newData = await postRequest.json();
        return newData;
    }
    catch (error) {
        console.log('Error', error);
    }
}

// Countdown how many days till trip
function countDown(tripStartDate) {
    // Get today's date and time
    let today = new Date().getTime();

    const tripDate = new Date(tripStartDate).getTime();
    // Find the distance between now and the count down date
    var distance = tripDate - today;
    const diffDays = Math.ceil(distance / (1000 * 60 * 60 * 24));

    // Output the result in an element with id="demo"
    document.getElementById("countdown").innerHTML = diffDays + ' days till your trip';

    // If the count down is over, write some text 
    if (distance < 0) {
        clearInterval(countDown);
        document.getElementById("countdown").innerHTML = "EXPIRED";
    }
}

function tripDuration(startDate, endDate) {
    const tripStartDate = new Date(startDate).getTime();
    const tripEndDate = new Date(endDate).getTime();
    // Find the distance between now and the count down date
    var distance = tripEndDate - tripStartDate;
    const diffDays = Math.ceil(distance / (1000 * 60 * 60 * 24));

    // Output the result in an element with id="demo"
    if(document.getElementById("duration")){
        document.getElementById("duration").innerHTML = ' Your trip duration is ' + diffDays + ' days '
    };

    // If the count down is over, write some text 
    if (distance < 0) {
        clearInterval(countDown);
        document.getElementById("duration").innerHTML = "EXPIRED";
    }
    return (diffDays);
}

module.exports = tripDuration;

// Update user interface
const updateUI = async () => {
    const request = await fetch('http://localhost:8080/all');
    try {
        const allData = await request.json();
        document.getElementById('destination').innerHTML = 'Your trip to ' + allData.cityName + ', ' + allData.country + ' on ' + allData.tripStartDate;
        //calculating to celsius
        // document.getElementById('temperature').innerHTML = (allData.temperature - 32) / 1.8;
        document.getElementById('temperature').innerHTML = allData.temperature;
        document.getElementById('image').src = allData.pictureURL;
    }
    catch (error) {
        console.log('error', error);
    }
}
