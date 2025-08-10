/**
 * OrientationService
 * - Prefers Screen Orientation API (orientation.type).
 * - Uses matchMedia for base portrait/landscape transitions.
 * - Fallback to DeviceOrientationEvent for primary/secondary on platforms without Screen Orientation API.
 * - iOS 13+ requires requestPermission() via user gesture over HTTPS.
 *
 * References:
 * - ScreenOrientation types: portrait-primary/secondary, landscape-primary/secondary [10][19][16].
 * - iOS motion/orientation permission and user gesture/HTTPS requirement [12][9][6][15].
 */
export type OrientationKind =
  | "portrait-primary"
  | "portrait-secondary"
  | "landscape-primary"
  | "landscape-secondary"
  | "unknown";

type Listener = (kind: OrientationKind) => void;

const PORTRAIT_MQ = "(orientation: portrait)";

function fromScreenOrientation(): OrientationKind {
  const so = (screen as any).orientation;
  if (so && typeof so.type === "string") {
    const t = so.type as string;
    if (
      t === "portrait-primary" ||
      t === "portrait-secondary" ||
      t === "landscape-primary" ||
      t === "landscape-secondary"
    ) {
      return t as OrientationKind;
    }
  }
  return "unknown";
}

// Infer primary/secondary using deviceorientation beta/gamma if needed.
function inferFromDeviceOrientation(beta: number | null, gamma: number | null): OrientationKind {
  if (beta == null || gamma == null) return "unknown";
  const absB = Math.abs(beta);
  const absG = Math.abs(gamma);
  if (absB >= absG) {
    return beta > 0 ? "portrait-primary" : "portrait-secondary";
  } else {
    return gamma > 0 ? "landscape-primary" : "landscape-secondary";
  }
}

function supportsIOSPermission(): boolean {
  return typeof (window as any).DeviceOrientationEvent !== "undefined" &&
    typeof (DeviceOrientationEvent as any).requestPermission === "function";
}

async function requestIOSPermission(): Promise<boolean> {
  try {
    const res = await (DeviceOrientationEvent as any).requestPermission();
    return res === "granted";
  } catch {
    return false;
  }
}

let lastDO: OrientationKind = "unknown";
let doActive = false;

export class OrientationService {
  private listeners: Set<Listener> = new Set();
  private portraitMQ = window.matchMedia(PORTRAIT_MQ);
  private current: OrientationKind = "unknown";
  private soChangeBound = this.handleSOChange.bind(this);
  private mqChangeBound = this.handleMQChange.bind(this);

  private deviceOrientationHandler = (e: DeviceOrientationEvent) => {
    const kind = inferFromDeviceOrientation(
      typeof e.beta === "number" ? e.beta : null,
      typeof e.gamma === "number" ? e.gamma : null
    );
    if (kind !== "unknown") {
      this.update(kind);
      lastDO = kind;
    }
  };

  init() {
    // Initial state
    const so = fromScreenOrientation();
    this.current = so !== "unknown" ? so : (this.portraitMQ.matches ? "portrait-primary" : "landscape-primary");

    // ScreenOrientation API change listener (when available) [10][19][16]
    const screenOrientation = (screen as any).orientation;
    if (screenOrientation && typeof screenOrientation.addEventListener === "function") {
      screenOrientation.addEventListener("change", this.soChangeBound);
    }

    // matchMedia listener for cross-browser portrait/landscape transitions
    if (typeof this.portraitMQ.addEventListener === "function") {
      this.portraitMQ.addEventListener("change", this.mqChangeBound);
    } else if (typeof (this.portraitMQ as any).addListener === "function") {
      (this.portraitMQ as any).addListener(this.mqChangeBound);
    }

    // Fallback for primary/secondary if Screen Orientation is not available
    if (so === "unknown") {
      this.enableDeviceOrientationFallback();
    }

    this.emit();
  }

  async enableDeviceOrientationFallback() {
    if (doActive) return;
    // iOS 13+ requires user gesture to request permission [12][9][15]
    if (supportsIOSPermission()) {
      // Defer to requestPermissionOnGesture()
      return;
    } else {
      window.addEventListener("deviceorientation", this.deviceOrientationHandler, { passive: true });
      doActive = true;
    }
  }

  async requestPermissionOnGesture() {
    if (!supportsIOSPermission()) return true;
    const granted = await requestIOSPermission();
    if (granted) {
      window.addEventListener("deviceorientation", this.deviceOrientationHandler, { passive: true });
      doActive = true;
    }
    return granted;
  }

  private handleSOChange() {
    const so = fromScreenOrientation();
    if (so !== "unknown") {
      this.update(so);
    }
  }

  private handleMQChange(e: MediaQueryListEvent) {
    const base = e.matches ? "portrait" : "landscape";
    let next: OrientationKind;
    if (base === "portrait") {
      next = (this.current === "portrait-secondary")
        ? "portrait-secondary"
        : (lastDO.startsWith("portrait") ? lastDO : "portrait-primary");
    } else {
      next = (this.current === "landscape-secondary")
        ? "landscape-secondary"
        : (lastDO.startsWith("landscape") ? lastDO : "landscape-primary");
    }
    this.update(next);
  }

  private update(next: OrientationKind) {
    if (this.current !== next) {
      this.current = next;
      this.emit();
    }
  }

  onChange(fn: Listener) {
    this.listeners.add(fn);
    fn(this.current);
    return () => this.listeners.delete(fn);
  }

  getCurrent(): OrientationKind {
    return this.current;
  }

  private emit() {
    this.listeners.forEach((l) => l(this.current));
  }

  destroy() {
    const screenOrientation = (screen as any).orientation;
    if (screenOrientation && typeof screenOrientation.removeEventListener === "function") {
      screenOrientation.removeEventListener("change", this.soChangeBound);
    }
    if (typeof this.portraitMQ.removeEventListener === "function") {
      this.portraitMQ.removeEventListener("change", this.mqChangeBound);
    } else if (typeof (this.portraitMQ as any).removeListener === "function") {
      (this.portraitMQ as any).removeListener(this.mqChangeBound);
    }
    if (doActive) {
      window.removeEventListener("deviceorientation", this.deviceOrientationHandler as any);
      doActive = false;
    }
  }
}

export const orientationService = new OrientationService();
