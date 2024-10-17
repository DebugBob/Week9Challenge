import { promises as fs } from "fs";
import WeatherService from './weatherService'; 


class CityName {
  name: string;
  id: number;

  constructor(name: string, id: number) {
    this.name = name;
    this.id = id;
  }
}

// HistoryService class
class HistoryService {
  private filePath = "./db/searchHistory.json";

  
  private async read() {
    try {
      const data = await fs.readFile(this.filePath, { encoding: "utf8", flag: "a+" });
      return data ? JSON.parse(data) : []; 
    } catch (error) {
      console.error("Error reading search history:", error);
      return [];
    }
  }

  private async write(cities: CityName[]) {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(cities, null, 2), "utf8");
    } catch (error) {
      console.error("Error writing search history:", error);
    }
  }

  
  async getCities() {
    return await this.read();
  }


  async getHistory() {
    return await this.getCities();
  }

  
  async addCity(city: string) {
    const cities = await this.getCities();
    const id = cities.length > 0 ? cities[cities.length - 1].id + 1 : 1; 
    const newCity = new CityName(city, id);
    cities.push(newCity);
    await this.write(cities);
  }

  
  async saveCity(city: string) {
    await this.addCity(city);
  }

  
  async removeCity(id: number) {
    const cities = await this.getCities();
    const updatedCities = cities.filter(city => city.id !== id); 
    await this.write(updatedCities);
  }

  
  async deleteCity(id: number) {
    await this.removeCity(id);
  }

  
  async getWeather(city: string) {
    try {
      const weatherData = await WeatherService.getWeather(city); 
      return weatherData; 
    } catch (error) {
      console.error(`Error fetching weather for city ${city}:`, error);
      throw error; 
    }
  }
}

export default new HistoryService();
