// Import required packages
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// Load environment variables from .env
dotenv.config();

// Import local weather data
import weatherData from './data/weather.json' with { type: 'json' };

// Create Express application
const app = express();

// Allow requests from other domains (frontend)
app.use(cors());

// Set server port
const PORT = process.env.PORT || 3001;

/*
|--------------------------------------------------------------------------
| Weather Route
|--------------------------------------------------------------------------
| Example:
| /weather?searchQuery=Seattle
|
| Finds a city in weather.json and returns a simplified forecast
|--------------------------------------------------------------------------
*/
app.get('/weather', (request, response) => {
  try {
    // Get query parameter from URL
    const { searchQuery } = request.query;

    // Validate required query parameter
    if (!searchQuery) {
      return response.status(400).send({
        error: 'searchQuery is required'
      });
    }

    // Find matching city in weather.json
    const targetCity = weatherData.find(
      city =>
        city.city_name.toLowerCase() === searchQuery.toLowerCase()
    );

    // Return error if city is not found
    if (!targetCity) {
      return response.status(404).send({
        error: 'City not found'
      });
    }

    // Convert raw weather data into Forecast objects
    const formattedWeather = targetCity.data.map(
      day => new Forecast(day)
    );

    // Send formatted weather data to client
    response.send(formattedWeather);

  } catch (error) {
    // Pass errors to error-handling middleware
    console.error(error);
    response.status(500).send({
      error: 'Something went wrong.'
    });
  }
});

/*
|--------------------------------------------------------------------------
| Forecast Class
|--------------------------------------------------------------------------
| Creates a simplified forecast object that matches the frontend's needs.
|--------------------------------------------------------------------------
*/
class Forecast {
  constructor(dayObj) {
    // Date of forecast
    this.date = dayObj.valid_date;

    // Forecast description
    this.description =
      `Low of ${dayObj.low_temp}, ` +
      `high of ${dayObj.max_temp} ` +
      `with ${dayObj.weather.description}`;
  }
}

/*
|--------------------------------------------------------------------------
| Error Handler
|--------------------------------------------------------------------------
| Catches errors that are passed with next(error)
|--------------------------------------------------------------------------
*/
app.use((error, request, response, next) => {
  console.error(error);

  response.status(500).send({
    error: 'Something went wrong on our server.'
  });
});

/*
|--------------------------------------------------------------------------
| Start Server
|--------------------------------------------------------------------------
*/
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

