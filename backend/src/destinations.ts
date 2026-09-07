import type { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { json } from './http';

type GeoResult = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country_code: string;
  country?: string;
  timezone?: string;
};

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const query = event.queryStringParameters?.query?.trim();

  if (!query || query.length < 2) {
    return json(400, { message: 'query must contain at least 2 characters' });
  }

  try {
    const geoParams = new URLSearchParams({
      name: query,
      count: '6',
      language: 'en',
      format: 'json',
    });

    const geoResponse = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?${geoParams}`,
    );

    if (!geoResponse.ok) {
      return json(502, { message: 'Geocoding provider unavailable' });
    }

    const geoData = (await geoResponse.json()) as { results?: GeoResult[] };
    const items = await Promise.all(
      (geoData.results ?? []).map(async (location) => {
        const weatherParams = new URLSearchParams({
          latitude: String(location.latitude),
          longitude: String(location.longitude),
          current:
            'temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code',
          timezone: 'auto',
        });

        const weatherResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?${weatherParams}`,
        );

        if (!weatherResponse.ok) {
          throw new Error('Weather provider unavailable');
        }

        const weather = (await weatherResponse.json()) as any;

        return {
          id: location.id,
          name: location.name,
          country: location.country ?? location.country_code,
          countryCode: location.country_code,
          latitude: location.latitude,
          longitude: location.longitude,
          timezone: location.timezone,
          temperature: weather.current?.temperature_2m,
          apparentTemperature: weather.current?.apparent_temperature,
          humidity: weather.current?.relative_humidity_2m,
          windSpeed: weather.current?.wind_speed_10m,
          weatherCode: weather.current?.weather_code,
        };
      }),
    );

    return json(200, { items });
  } catch (error) {
    console.error(error);
    return json(500, { message: 'Unable to search destinations' });
  }
};
