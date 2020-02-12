// let baseURL = 'https://api.openweathermap.org/data/2.5/weather?zip=';
// let key = '661daa7377189bfe425b6af1f07ac279';

let baseURL = 'http://api.geonames.org/postalCodeSearchJSON?placename=';
let key = '&maxRows=10&username=mindpaz';

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

document.getElementById('generate').addEventListener('click', performAction);

function performAction(e){
    e.preventDefault();
    const cityName = document.getElementById('zip').value;
    const feelings = document.getElementById('feelings').value;
    console.log(newDate);
    getTemperature(baseURL, cityName, key)
    .then(function (data){
        // Add data to POST request
        postData('http://localhost:8080/addWeatherData', {latitude: data.postalCodes[0].lat, longitude: data.postalCodes[0].lng, country: data.postalCodes[0].countryCode } )
        // Function which updates UI
        .then(function() {
            updateUI()
        })
    })
}

// Async GET
const getTemperature = async (baseURL, city, key)=>{
// const getTemperatureDemo = async (url)=>{
    const response = await fetch(baseURL + city + key)
    console.log(response);
    try {
        const data = await response.json();
        console.log(data);
        console.log('PIRMAS');
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
        document.getElementById('content').innerHTML = allData.country;
    }
    catch (error) {
        console.log('error', error);
    }
}

export { performAction }