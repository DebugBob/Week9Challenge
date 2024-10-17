import dotenv from 'dotenv';
dotenv.config();


interface Coordinates {
  lat: number;
  lon: number;
}


class Weather {
  temperature: number;
  humidity: number;
  description: string;

  constructor(temperature: number, humidity: number, description: string) {
    this.temperature = temperature;
    this.humidity = humidity;
    this.description = description;
  }
}


class WeatherService {
  // Define the baseURL, API key, and city name properties
  baseURL: string;
  apiKey: string;
  city: string;

  constructor() {
    this.baseURL = 'https://api.openweathermap.org/data/2.5';
    this.apiKey = process.env.API_KEY || '';
    this.city = '';
  }

  
  private async fetchLocationData(query: string) {
    const response = await fetch(this.buildGeocodeQuery(query));
    if (!response.ok) {
      throw new Error('Failed to fetch location data');
    }
    return response.json();
  }

  
  private destructureLocationData(locationData: any[]): Coordinates {
    if (locationData.length === 0) {
      throw new Error('No location data found');
    }
    return {
      lat: locationData[0].lat,
      lon: locationData[0].lon,
    };
  }

  
  private buildGeocodeQuery(query: string) {
    return `${this.baseURL}/geo/1.0/direct?q=${query}&limit=1&appid=${this.apiKey}`;
  }

  
  private buildWeatherQuery(coordinates: Coordinates) {
    return `${this.baseURL}/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`;
  }

  
  private async fetchWeatherData(coordinates: Coordinates) {
    const response = await fetch(this.buildWeatherQuery(coordinates));
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }
    return response.json();
  }

  
  private parseCurrentWeather(response: any) {
    const temp = response.main.temp;
    const humidity = response.main.humidity;
    const description = response.weather[0].description;

    return new Weather(temp, humidity, description);
  }

  
  async getWeatherForCity(city: string) {
    this.city = city;
    const coordinates = await this.fetchLocationData(city);
    const coord = this.destructureLocationData(coordinates);
    const weatherData = await this.fetchWeatherData(coord);
    return this.parseCurrentWeather(weatherData);
  }
}

export default new WeatherService();
