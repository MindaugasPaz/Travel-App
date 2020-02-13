document.getElementById('generate').addEventListener('click', x);

// Update the count down every 1 second
var x = setInterval(function () {

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
        clearInterval(x);
        document.getElementById("demo").innerHTML = "EXPIRED";
    }
}, 1000);

export { x }