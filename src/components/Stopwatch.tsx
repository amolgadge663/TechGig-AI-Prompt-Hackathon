 /**
 * Stopwatch
 * - High-precision timer using rAF.
 * - Start/Pause, Lap, Reset.
 */
import { useEffect, useRef, useState } from "react";

function format(ms: number) {
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const cs = Math.floor((ms % 1000) / 10);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(cs).padStart(2, "0")}`;
}

export default function Stopwatch() {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [laps, setLaps] = useState<number[]>([]);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    const startAt = performance.now() - elapsed;
    startRef.current = startAt;

    const tick = () => {
      setElapsed(performance.now() - (startRef.current || 0));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [running]);

  const onLap = () => setLaps((prev) => [elapsed, ...prev]);
  const onReset = () => {
    setRunning(false);
    setElapsed(0);
    setLaps([]);
  };

  return (
    <div className="stack">
      <div className="big center">{format(elapsed)}</div>
      <div className="row">
        <button className="btn" onClick={() => setRunning((r) => !r)}>
          {running ? "Pause" : "Start"}
        </button>
        <button className="btn" onClick={onLap} disabled={!running}>
          Lap
        </button>
        <button className="btn secondary" onClick={onReset}>
          Reset
        </button>
      </div>
      {laps.length > 0 && (
        <div className="list">
          {laps.map((l, i) => (
            <div key={i} className="list-item">
              Lap {laps.length - i}: {format(l)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
