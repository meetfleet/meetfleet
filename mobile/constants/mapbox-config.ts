if (!process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN) {
  throw new Error('Missing required environment variable: EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN. Please set this variable to your Mapbox access token.');
}
export const MAPBOX_ACCESS_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN;