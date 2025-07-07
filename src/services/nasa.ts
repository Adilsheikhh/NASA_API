import axios from 'axios';
import { NASAImage } from '@/types';

const NASA_API_BASE_URL = 'https://api.nasa.gov/planetary/apod';

export class NASAService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getImageOfTheDay(): Promise<NASAImage> {
    try {
      const response = await axios.get(NASA_API_BASE_URL, {
        params: {
          api_key: this.apiKey,
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching NASA image:', error);
      throw new Error('Failed to fetch NASA image of the day');
    }
  }

  async getImageByDate(date: string): Promise<NASAImage> {
    try {
      const response = await axios.get(NASA_API_BASE_URL, {
        params: {
          api_key: this.apiKey,
          date: date,
        },
      });
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching NASA image for date ${date}:`, error);
      throw new Error(`Failed to fetch NASA image for date ${date}`);
    }
  }

  async getImagesInRange(startDate: string, endDate: string): Promise<NASAImage[]> {
    try {
      const response = await axios.get(NASA_API_BASE_URL, {
        params: {
          api_key: this.apiKey,
          start_date: startDate,
          end_date: endDate,
        },
      });
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching NASA images from ${startDate} to ${endDate}:`, error);
      throw new Error(`Failed to fetch NASA images for date range`);
    }
  }
}
