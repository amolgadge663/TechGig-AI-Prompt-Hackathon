/**
 * WeatherCard
 * - Requests geolocation and shows current temperature, wind, and condition text.
 * - Uses Open‑Meteo free API (no key) [1][2][11][8].
 */
import { useEffect, useState } from "react";
import { fetchCurrentWeather } from "../services/weather";

type State =
  | { status: "idle" }
  | { status: "locating" }
  | { status: "loading"; lat: number; lon: number }
  | { status: "ready"; temp: number | null; ws: number | null; code: number | null }
  | { status: "error"; message: string };

function codeToText(code: number | null): string {
  if (code == null) return "Unknown";
  if (code === 0) return "Clear sky";
  if ([1, 2, 3].includes(code)) return "Mainly clear / Partly cloudy / Overcast";
  if ([45, 48].includes(code)) return "Fog";
  if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle";
  if ([61, 63, 65].includes(code)) return "Rain";
  if ([66, 67].includes(code)) return "Freezing rain";
  if ([71, 73, 75].includes(code)) return "Snow";
  if (code === 77) return "Snow grains";
  if ([80, 81, 82].includes(code)) return "Rain showers";
  if ([85, 86].includes(code)) return "Snow showers";
  if (code === 95) return "Thunderstorm";
  if ([96, 99].includes(code)) return "Thunderstorm with hail";
  return "Weather";
}

export default function WeatherCard() {
  const [state, setState] = useState<State>({ status: "idle" });

  useEffect(() => {
    let mounted = true;
    const go = () => {
      setState({ status: "locating" });
      if (!navigator.geolocation) {
        setState({ status: "error", message: "Geolocation not supported" });
        return;
      }
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          if (!mounted) return;
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          setState({ status: "loading", lat, lon });
          try {
            const w = await fetchCurrentWeather(lat, lon); // Open‑Meteo [2][11][8]
            if (!mounted) return;
            setState({
              status: "ready",
              temp: w.temperature,
              ws: w.windSpeed,
              code: w.weatherCode,
            });
          } catch (e: any) {
            if (!mounted) return;
            setState({ status: "error", message: e?.message || "Weather fetch failed" });
          }
        },
        (err) => {
          if (!mounted) return;
          setState({ status: "error", message: err.message || "Location error" });
        },
        { enableHighAccuracy: false, timeout: 10000 }
      );
    };
    go();
    return () => {
      mounted = false;
    };
  }, []);

  if (state.status === "error") {
    return <div className="error">{state.message}</div>;
  }

  if (state.status === "idle" || state.status === "locating" || state.status === "loading") {
    return <div className="skeleton">Loading...</div>;
  }

  const { temp, ws, code } = state;

  return (
    <div className="stack center">
      <div className="big">{temp != null ? `${temp.toFixed(1)}°C` : "—"}</div>
      <div className="muted">{codeToText(code)}</div>
      <div className="muted">{ws != null ? `Wind ${ws.toFixed(1)} m/s` : ""}</div>
      <div className="hint">Powered by Open‑Meteo</div>
    </div>
  );
}
