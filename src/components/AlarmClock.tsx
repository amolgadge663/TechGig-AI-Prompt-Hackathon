/**
 * AlarmClock
 * - Shows current time (seconds).
 * - Arm an alarm for a selected HH:mm today.
 * - Plays a tone and shows a toast alert on trigger.
 */
import { useEffect, useRef, useState } from "react";
import { primeAudio } from "../services/audio";

const beepUrl =
  "data:audio/wav;base64,UklGRhQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABYAZGF0YQAAAAA="; // tiny placeholder

function nowHHmmss() {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}
function nowHHmm() {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

export default function AlarmClock() {
  const [time, setTime] = useState(nowHHmm());
  const [armed, setArmed] = useState(false);
  const [tick, setTick] = useState(nowHHmmss());
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const id = setInterval(() => setTick(nowHHmmss()), 250);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!armed) return;
    const id = setInterval(() => {
      const hm = tick.slice(0, 5);
      if (hm === time) {
        setArmed(false);
        audioRef.current?.play().catch(() => { });
        alert("Alarm!");
      }
    }, 1000);
    return () => clearInterval(id);
  }, [armed, time, tick]);

  return (
    <div className="stack">
      <div className="big center">{tick}</div>
      <label className="row">
        <span>Alarm time</span>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="input"
        />
      </label>
      <div className="row">
        <button
          className="btn"
          onClick={async () => {
            await primeAudio(); // unlock audio on first user gesture
            setArmed(true);
          }}
          disabled={armed}
        >
          Arm
        </button>
        <button className="btn secondary" onClick={() => setArmed(false)}>
          Disarm
        </button>
      </div>
      <audio ref={audioRef} src={beepUrl} />
    </div>
  );
}
