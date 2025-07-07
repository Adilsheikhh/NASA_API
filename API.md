# 🚀 NASA Image Explorer - API Reference

## Overview

The NASA Image Explorer provides a REST API for accessing NASA's Astronomy Picture of the Day (APOD) data enhanced with AI-generated explanations using Google's Gemini AI.

## Base URL

```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

## Authentication

API keys are required for external service access but not for the internal API routes. Set up your environment variables:

```env
NASA_API_KEY=your_nasa_api_key
GEMINI_API_KEY=your_gemini_api_key
```

## Endpoints

### 🌌 NASA Images

#### Get Today's Image
Retrieve the current Astronomy Picture of the Day.

```http
GET /api/nasa
```

**Response:**
```json
{
  "date": "2024-01-15",
  "explanation": "This stunning image shows...",
  "hdurl": "https://apod.nasa.gov/apod/image/2401/image_hd.jpg",
  "media_type": "image",
  "service_version": "v1",
  "title": "Galaxy Cluster Abell 2744",
  "url": "https://apod.nasa.gov/apod/image/2401/image.jpg",
  "copyright": "NASA, ESA, Hubble"
}
```

#### Get Image by Date
Retrieve the APOD for a specific date.

```http
GET /api/nasa?date=YYYY-MM-DD
```

**Parameters:**
- `date` (string, required): Date in YYYY-MM-DD format

**Example:**
```http
GET /api/nasa?date=2024-01-15
```

#### Get Images in Date Range
Retrieve multiple APODs within a date range.

```http
GET /api/nasa?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD
```

**Parameters:**
- `start_date` (string, required): Start date in YYYY-MM-DD format
- `end_date` (string, required): End date in YYYY-MM-DD format

**Example:**
```http
GET /api/nasa?start_date=2024-01-01&end_date=2024-01-07
```

**Response:**
```json
[
  {
    "date": "2024-01-07",
    "explanation": "...",
    "title": "...",
    "url": "...",
    "media_type": "image"
  },
  {
    "date": "2024-01-06",
    "explanation": "...",
    "title": "...",
    "url": "...",
    "media_type": "image"
  }
]
```

### 🤖 AI Explanations

#### Generate Enhanced Explanation
Generate an AI-powered explanation for a NASA image.

```http
POST /api/explain
Content-Type: application/json
```

**Request Body:**
```json
{
  "image": {
    "date": "2024-01-15",
    "explanation": "NASA's original explanation...",
    "title": "Galaxy Cluster Abell 2744",
    "url": "https://apod.nasa.gov/apod/image/2401/image.jpg",
    "media_type": "image"
  }
}
```

**Response:**
```json
{
  "explanation": "This breathtaking image reveals one of the most massive galaxy clusters known to astronomy...",
  "keyFeatures": [
    "Gravitational lensing effects",
    "Background galaxies distorted into arcs",
    "Dark matter distribution",
    "Multiple galaxy populations"
  ],
  "scientificContext": "Abell 2744 serves as a natural telescope, using its immense gravitational field to magnify and distort light from more distant galaxies..."
}
```

## Error Handling

All endpoints return consistent error responses:

### Error Response Format
```json
{
  "error": "Error message describing what went wrong",
  "code": "ERROR_CODE",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Missing or invalid API key |
| 404 | Not Found | Resource not found |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |
| 503 | Service Unavailable | External API unavailable |

### Common Error Scenarios

#### NASA API Errors
```json
{
  "error": "Failed to fetch NASA data",
  "code": "NASA_API_ERROR",
  "details": "Invalid date format or date out of range"
}
```

#### Gemini AI Errors
```json
{
  "error": "Failed to generate explanation",
  "code": "GEMINI_API_ERROR",
  "details": "AI service temporarily unavailable"
}
```

#### Validation Errors
```json
{
  "error": "Invalid request parameters",
  "code": "VALIDATION_ERROR",
  "details": {
    "date": "Date must be in YYYY-MM-DD format",
    "start_date": "Start date cannot be in the future"
  }
}
```

## Rate Limiting

### NASA API Limits
- **With API Key**: 1,000 requests per hour
- **Without API Key**: 50 requests per hour

### Gemini AI Limits
- Varies based on your Google Cloud plan
- Typically 60 requests per minute for free tier

### Internal API Limits
- No artificial limits imposed
- Limited by external API constraints

## Data Models

### NASAImage
```typescript
interface NASAImage {
  date: string;           // ISO date string (YYYY-MM-DD)
  explanation: string;    // NASA's original explanation
  hdurl?: string;         // High-resolution image URL (optional)
  media_type: 'image' | 'video';
  service_version: string; // API version
  title: string;          // Image title
  url: string;           // Standard resolution URL
  copyright?: string;    // Copyright information (optional)
}
```

### AIExplanation
```typescript
interface AIExplanation {
  explanation: string;        // Simplified, accessible explanation
  keyFeatures: string[];     // Array of key visual/scientific features
  scientificContext: string; // Broader astronomical/scientific context
}
```

## Code Examples

### JavaScript/TypeScript

#### Fetch Today's Image
```javascript
async function getTodaysImage() {
  try {
    const response = await fetch('/api/nasa');
    if (!response.ok) {
      throw new Error('Failed to fetch image');
    }
    const image = await response.json();
    return image;
  } catch (error) {
    console.error('Error:', error);
  }
}
```

#### Get AI Explanation
```javascript
async function getAIExplanation(image) {
  try {
    const response = await fetch('/api/explain', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to get explanation');
    }
    
    const explanation = await response.json();
    return explanation;
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### Python

#### Fetch Recent Images
```python
import requests
from datetime import datetime, timedelta

def get_recent_images(days=7):
    end_date = datetime.now().strftime('%Y-%m-%d')
    start_date = (datetime.now() - timedelta(days=days)).strftime('%Y-%m-%d')
    
    url = f'/api/nasa?start_date={start_date}&end_date={end_date}'
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f'Error: {e}')
        return None
```

### cURL

#### Get Today's Image
```bash
curl -X GET "https://your-domain.com/api/nasa" \
     -H "Accept: application/json"
```

#### Get AI Explanation
```bash
curl -X POST "https://your-domain.com/api/explain" \
     -H "Content-Type: application/json" \
     -d '{
       "image": {
         "date": "2024-01-15",
         "explanation": "Original NASA explanation...",
         "title": "Galaxy Cluster",
         "url": "https://apod.nasa.gov/image.jpg",
         "media_type": "image"
       }
     }'
```

## SDKs and Wrappers

### JavaScript/TypeScript SDK

Create a simple SDK wrapper:

```typescript
class NASAExplorerAPI {
  constructor(private baseURL: string = '/api') {}

  async getTodaysImage(): Promise<NASAImage> {
    const response = await fetch(`${this.baseURL}/nasa`);
    if (!response.ok) throw new Error('Failed to fetch image');
    return response.json();
  }

  async getImageByDate(date: string): Promise<NASAImage> {
    const response = await fetch(`${this.baseURL}/nasa?date=${date}`);
    if (!response.ok) throw new Error('Failed to fetch image');
    return response.json();
  }

  async getImagesInRange(startDate: string, endDate: string): Promise<NASAImage[]> {
    const response = await fetch(
      `${this.baseURL}/nasa?start_date=${startDate}&end_date=${endDate}`
    );
    if (!response.ok) throw new Error('Failed to fetch images');
    return response.json();
  }

  async getAIExplanation(image: NASAImage): Promise<AIExplanation> {
    const response = await fetch(`${this.baseURL}/explain`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image })
    });
    if (!response.ok) throw new Error('Failed to get explanation');
    return response.json();
  }
}

// Usage
const api = new NASAExplorerAPI();
const image = await api.getTodaysImage();
const explanation = await api.getAIExplanation(image);
```

## Webhooks and Real-time Updates

Currently, the API doesn't support webhooks or real-time updates. However, you can implement polling or use Server-Sent Events for live updates:

### Polling Example
```javascript
// Poll for new images every hour
setInterval(async () => {
  const latestImage = await api.getTodaysImage();
  // Handle new image
}, 60 * 60 * 1000); // 1 hour
```

## Versioning

The API currently uses implicit versioning. Future versions will include explicit version headers:

```http
API-Version: v1
```

## Testing

### Postman Collection
Import the provided Postman collection for easy API testing:

```json
{
  "info": {
    "name": "NASA Image Explorer API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Get Today's Image",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/api/nasa"
      }
    }
  ]
}
```

### Test Environment Variables
```json
{
  "baseUrl": "http://localhost:3000",
  "productionUrl": "https://your-domain.com"
}
```

---

## Support

For API support:
- 📧 Email: api-support@nasa-explorer.com
- 🐛 Issues: [GitHub Issues](https://github.com/your-repo/issues)
- 📖 Documentation: [Full Docs](https://your-domain.com/docs)

## Changelog

### v1.2.0 (Latest)
- Added Gemini AI integration
- Enhanced error handling
- Improved response format

### v1.1.0
- Added date range queries
- Better error messages
- Performance improvements

### v1.0.0
- Initial API release
- NASA APOD integration
- Basic error handling
