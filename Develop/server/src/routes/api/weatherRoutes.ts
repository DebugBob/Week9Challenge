import { Router } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';


router.post('/', async (_req, res) => {
  try {
    const { city } = req.body; // Extract city name from request body
    if (!city) {
      return res.status(400).json({ error: 'City name is required.' }); // Validate city name
    }

    
    const weatherData = await WeatherService.getWeatherForCity(city); 

    
    await HistoryService.saveCity(city); 

    res.status(200).json(weatherData); 
  } catch (error) {
    console.error('Error retrieving weather data:', error);
    res.status(500).json({ error: 'Failed to retrieve weather data.' });
  }
});


router.get('/history', async (_req, res) => {
  try {
    const history = await HistoryService.getHistory(); 
    res.status(200).json(history); 
  } catch (error) {
    console.error('Error retrieving search history:', error);
    res.status(500).json({ error: 'Failed to retrieve search history.' });
  }
});


router.delete('/history/:id', async (req, res) => {
  const { id } = req.params; 

  try {
    await HistoryService.deleteCity(Number(id)); 
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting city from search history:', error);
    res.status(500).json({ error: 'Failed to delete city from search history.' });
  }
});

export default router;
