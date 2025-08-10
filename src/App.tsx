/**
 * App: Orchestrates orientation detection and routes to the correct feature.
 * - Portrait Upright -> Alarm
 * - Portrait Upside Down -> Timer
 * - Landscape Right-Side Up -> Stopwatch
 * - Landscape Left-Side Up -> Weather
 */
import { useEffect, useMemo, useState } from "react";
import { orientationService, OrientationKind } from "./services/orientation";
import AlarmClock from "./components/AlarmClock";
import Stopwatch from "./components/Stopwatch";
import Timer from "./components/Timer";
import WeatherCard from "./components/WeatherCard";

type Mode = "alarm" | "stopwatch" | "timer" | "weather";

function modeFromOrientation(kind: OrientationKind): Mode {
  switch (kind) {
    case "portrait-primary":
      return "alarm";
    case "portrait-secondary":
      return "timer";
    case "landscape-primary":
      return "stopwatch";
    case "landscape-secondary":
      return "weather";
    default:
      return "alarm";
  }
}

export default function App() {
  const [kind, setKind] = useState<OrientationKind>("unknown");
  const [mode, setMode] = useState<Mode>("alarm");
  const [iosPermissionGranted, setIosPermissionGranted] = useState<boolean>(false);

  useEffect(() => {
    orientationService.init();
    const off = orientationService.onChange((k) => {
      setKind(k);
      setMode(modeFromOrientation(k));
    });
    orientationService.enableDeviceOrientationFallback();
    return () => {
      off();
      orientationService.destroy();
    };
  }, []);

  const subtitle = useMemo(() => {
    switch (mode) {
      case "alarm":
        return "Portrait (upright)";
      case "timer":
        return "Portrait (upside‑down)";
      case "stopwatch":
        return "Landscape (right‑side up)";
      case "weather":
        return "Landscape (left‑side up)";
      default:
        return "";
    }
  }, [mode]);

  const requestMotion = async () => {
    const ok = await orientationService.requestPermissionOnGesture();
    setIosPermissionGranted(ok);
  };

  return (
    <div className={`app ${kind.replace("-", "_")}`}>
      <header className="topbar">
        <div className="title">Orientation Tools <br /><a href="https://www.linkedin.com/in/amolgadge663" target="_blank">Mr. Amol Gadage</a></div>
        <div className="badge">{kind}</div>
      </header>

      {!iosPermissionGranted && (
        <div className="banner">
          <div>
            To detect upside‑down or left‑side‑up on some devices (iOS 13+), allow motion/orientation access.
          </div>
          <button className="btn small" onClick={requestMotion}>
            Allow
          </button>
        </div>
      )}

      <main className="content">
        <div className="panel">
          <div className="panel-header">
            <h2 className="panel-title">
              {mode === "alarm" && "Alarm Clock"}
              {mode === "stopwatch" && "Stopwatch"}
              {mode === "timer" && "Timer"}
              {mode === "weather" && "Weather of the Day"}
            </h2>
            <div className="panel-subtitle">{subtitle}</div>
          </div>

          {mode === "alarm" && <AlarmClock />}
          {mode === "stopwatch" && <Stopwatch />}
          {mode === "timer" && <Timer />}
          {mode === "weather" && <WeatherCard />}
        </div>
      </main>

      <footer className="footer">
        <a
          className="footer-link left"
          href="https://github.com/amolgadge663/TechGig-AI-Prompt-Hackathon/blob/main/README.md"
          target="_blank"
          rel="noopener noreferrer" >
          README </a>

        <div className="footer-center">Rotate device to switch tools</div>

        <a
          className="footer-link right"
          href="https://amolsoftwares.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Website </a>

      </footer>
    </div>
  );
}
