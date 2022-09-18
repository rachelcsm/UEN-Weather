const fetch = require("node-fetch");
const prompt = require("prompt-sync")({sigint:true});
var location = prompt("Enter location: ");
getWeather(location)

function getWeather(location) {
    var currentdate = new Date(); 

    var year = currentdate.getFullYear()

    var month = currentdate.getMonth()+1
    if (month < 10) {
      month = "0" + month
    }

    var date = currentdate.getDate()
    if (date < 10) {
      date = "0" + date
    }

    var hours = currentdate.getHours()
    if (hours < 10) {
      hours = "0" + hours
    }

    var minutes = currentdate.getMinutes()
    if (minutes < 10) {
      minutes = "0" + minutes
    }

    var seconds = currentdate.getSeconds()
    if (seconds < 10) {
      seconds = "0" + seconds
    }

    var datetime = year + "-" + month  + "-" + date + "T" + hours + ":" + minutes + ":" + seconds;
      
    const getData = async () => {
      const response = await fetch('https://api.data.gov.sg/v1/environment/2-hour-weather-forecast?date_time=' + datetime)
      const data = await response.json();
      return data;
    };
      
    (async () => {
      const data = await getData();
      const forecasts = data.items[0].forecasts;
      for (let i=0; i<forecasts.length; i++) {
        if (forecasts[i].area.toUpperCase() == location.toUpperCase()) {
          console.log("Weather at " + forecasts[i].area + " is " + forecasts[i].forecast)
          return
        }
      } 
      console.log("Location not found.")
    })();

}