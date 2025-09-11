# MisterToy Frontend

A modern React application for managing toy collections with Google Maps integration.

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

## Security Note

⚠️ **Never commit your `.env` file to version control!** The `.env` file is already included in `.gitignore` to prevent accidental commits.

## Features

- Toy collection management
- Google Maps integration for store locations
- Responsive design
- Modern UI components
- Real-time data updates
