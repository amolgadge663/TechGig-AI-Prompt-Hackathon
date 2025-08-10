/**
 * Timer
 * - Presets and custom seconds input.
 * - Start/Stop with countdown and alert at 0.
 */
import { useEffect, useRef, useState } from "react";
import { primeAudio } from "../services/audio";

function format(totalSec: number) {
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function Timer() {
  const [seconds, setSeconds] = useState(300);
  const [remaining, setRemaining] = useState(300);
  const [running, setRunning] = useState(false);
  const idRef = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    idRef.current = window.setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(idRef.current!);
          alert("Timer done!");
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => {
      if (idRef.current) clearInterval(idRef.current);
    };
  }, [running]);

  const start = async () => {
    await primeAudio();
    setRemaining(seconds);
    setRunning(true);
  };
  const stop = () => setRunning(false);

  return (
    <div className="stack">
      <div className="big center">{format(remaining)}</div>
      <div className="row">
        <button className="chip" onClick={() => !running && setSeconds(60)}>1m</button>
        <button className="chip" onClick={() => !running && setSeconds(300)}>5m</button>
        <button className="chip" onClick={() => !running && setSeconds(600)}>10m</button>
      </div>
      <label className="row">
        <span>Custom (sec)</span>
        <input
          type="number"
          className="input"
          min={1}
          value={seconds}
          onChange={(e) => setSeconds(Math.max(1, Number(e.target.value)))}
          disabled={running}
        />
      </label>
      <div className="row">
        <button className="btn" onClick={start} disabled={running}>Start</button>
        <button className="btn secondary" onClick={stop} disabled={!running}>Stop</button>
      </div>
    </div>
  );
}
