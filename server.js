'use strict'

// load env variable from the .env file
require('dotenv').config();

// application depedencies
// express is the standard server framework for nodejs
const express = require('express');
// cross origin request sharing
const cors = require('cors');
const superagent = require('superagent');

// application setup
const PORT = process.env.PORT;
const app = express();
app.use(cors());

// API routes
app.get('/location', handleLocationRequest);
app.get('/weather', handleWeatherRequest);

app.listen(PORT, () => console.log(`App is listening on ${PORT}`));

function handleLocationRequest(request, response) {
  try {

    // TODO: create the url for the geocode google API
    // TODO: run a get request with superagent
    // TODO: send the response from superagent

    const URL = `https://maps.googleapis.com/maps/api/geocode/json?address=${request.query.data}&key=${process.env.GEO_API_KEY}`;

    return superagent.get(URL)
      .then(res => {
        const locationData = new Location(request.query.data, res.body);
        response.send(locationData);
        response.send(res);
      })
      .catch(error => {
        handleError(error, response);
      })


  }
  catch(error) {
    handleError(error, response);
  }
}

function Location(query, geoData) {
  this.seach_query = query;
  this.formatted_query = geoData.results[0].formatted_address;
  this.latitude = geoData.results[0].geometry.location.lat;
  this.longitude = geoData.results[0].geometry.location.lng;
}



function handleWeatherRequest(request, response){

  try {
    const weatherData = require('./data/darksky.json');
    const daySummaries = [];

    weatherData.daily.data.forEach(dayData => {
      daySummaries.push(new Weather (dayData));
    })
    response.send(daySummaries);
  } catch(error) {
    handleError(error, response);
  }
}

function Weather(dayData) {
  this.forecast = dayData.summary;
  this.time = new Date(dayData.time * 1000).toString().slice(0,15);
  this.time = dayData.time;
}



function handleError(error, response){
  console.error(error);
  response.status(500).send('Status: 500. So sorry, something went wrong');
}


