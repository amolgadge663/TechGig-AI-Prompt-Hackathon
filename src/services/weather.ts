/**
 * WeatherService using Open‑Meteo (free, no API key) for current weather.
 * We request temperature_2m, wind_speed_10m, weather_code.
 * API docs and OpenAPI define these current attributes [2][11][8].
 */
export type CurrentWeather = {
  temperature: number | null;
  windSpeed: number | null;
  weatherCode: number | null;
  timeISO: string | null;
};

export async function fetchCurrentWeather(lat: number, lon: number): Promise<CurrentWeather> {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,wind_speed_10m,weather_code`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Weather fetch failed: ${res.status}`);
  const data = await res.json();
  const cur = data.current || {};
  return {
    temperature: typeof cur.temperature_2m === "number" ? cur.temperature_2m : null,
    windSpeed: typeof cur.wind_speed_10m === "number" ? cur.wind_speed_10m : null,
    weatherCode: typeof cur.weather_code === "number" ? cur.weather_code : null,
    timeISO: typeof cur.time === "string" ? cur.time : null,
  };
}
