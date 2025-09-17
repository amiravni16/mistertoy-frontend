# MisterToy Frontend

A modern React application for managing toy collections with Google Maps integration.

## 🚀 Live Demo

**Frontend:** [https://mistertoy-frontend-hqv8.onrender.com](https://mistertoy-frontend-hqv8.onrender.com)  
**Backend API:** [https://mistertoy-backend-8pc5.onrender.com](https://mistertoy-backend-8pc5.onrender.com)

## Environment Setup

### Required Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Google Maps API Key
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### Getting a Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Maps JavaScript API
4. Create credentials (API Key)
5. Restrict the API key to your domain for security
6. Add the API key to your `.env` file

## Development

```bash
npm install
npm run dev
```

## Deployment

This application is deployed on [Render.com](https://render.com/):

- **Frontend:** Deployed as a Static Site
- **Backend:** Deployed as a Web Service
- **Database:** MongoDB Atlas (cloud database)

### Environment Variables for Production

The following environment variables are configured in Render:

- `VITE_API_URL`: Backend API URL
- `VITE_GOOGLE_MAPS_API_KEY`: Google Maps API key

## Security Note

⚠️ **Never commit your `.env` file to version control!** The `.env` file is already included in `.gitignore` to prevent accidental commits.

## Features

- Toy collection management
- Google Maps integration for store locations
- Responsive design
- Modern UI components
- Real-time data updates
