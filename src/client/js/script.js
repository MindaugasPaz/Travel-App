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
    const cityName = document.getElementById('city').value;
    const tripDate = document.getElementById("start").value;
    let allProjectData = {tripDate: tripDate, cityName: cityName};
    const tripDateUnix = new Date(tripDate).getTime() / 1000;
    //invoking countdown function
    const startCountDown = countDown();
    console.log(tripDateUnix, 'trip date in UNIX')
    console.log(newDate);
    getCoordinates(coordinatesAPI, cityName, coordinatesKey)
    .then(function (data){
        allProjectData.latitude = data.postalCodes[0].lat;
        allProjectData.longitude = data.postalCodes[0].lng;
        allProjectData.country = data.postalCodes[0].countryCode;
            getTemperature(allProjectData.latitude, allProjectData.longitude, tripDateUnix)
            .then(function(data){
                allProjectData.temperature = data.currently.temperature;
                    getPicture(pixabayAPI, cityName)
                    .then(function(data){
                        allProjectData.url = data.hits[0].webformatURL;
                        console.log('kazkas', data);
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
    try {
        const data = await response.json();
        console.log('cia', data);
        return data;
    }
    catch(error) {
        console.log('error', error);
    }
}

// Async GET temperature
const getTemperature = async (lat, lng, tripDateUnix)=>{
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

// Countdown how many days till trip
function countDown() {
    // Get today's date and time
    let today = new Date().getTime();
    // let today = d.toLocaleString('en-GB', { year: 'numeric', month: 'numeric', day: 'numeric' });
    const date = document.getElementById("start").value;

    const tripDate = new Date(date).getTime();
    // Find the distance between now and the count down date
    var distance = tripDate - today;
    const diffDays = Math.ceil(distance / (1000 * 60 * 60 * 24));
    console.log(diffDays);

    // Output the result in an element with id="demo"
    document.getElementById("demo").innerHTML = diffDays + ' days till your trip';

    // If the count down is over, write some text 
    if (distance < 0) {
        clearInterval(countDown);
        document.getElementById("demo").innerHTML = "EXPIRED";
    }
}

// Update user interface
const updateUI = async () => {
    const request = await fetch('http://localhost:8080/all');
    try {
        const allData = await request.json();
        document.getElementById('destination').innerHTML = 'Your trip to ' + allData.cityName + ', ' + allData.country + ' on ' + allData.tripDate;
        // document.getElementById('country').innerHTML =  + 
        //calculating to celsius
        document.getElementById('temperature').innerHTML = (allData.temperature - 32) / 1.8;
        document.getElementById('image').src = allData.pictureURL;
    }
    catch (error) {
        console.log('error', error);
    }
}

export { performAction }