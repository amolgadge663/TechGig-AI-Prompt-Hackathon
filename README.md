---
It includes project overview, features, tech stack, setup, deployment, permissions, testing, and creator profile/links.
---

# App link (GitHub Pages)
- https://amolgadge663.github.io/TechGig-AI-Prompt-Hackathon/

# Orientation Tools (React + Vite)
Mobile-first, one-page web app that switches features based on how you hold your phone:
- Portrait Upright → Alarm Clock
- Landscape Right-Side Up → Stopwatch
- Portrait Upside Down → Timer
- Landscape Left-Side Up → Weather of the Day (Open‑Meteo, free, no API key)

Seamless orientation transitions, responsive/touch-friendly UI, and runs fully in the browser on Android and iOS.

## Demo
- Rotate your device to switch between tools.
- On iOS 13+, tap “Allow motion/orientation” when prompted to enable upside-down/left-side-up detection.
- Grant Location to see the Weather of the Day.

## Features
- Orientation-driven mode routing with smooth transitions
- Alarm Clock (set daily HH:mm; audible + alert)
- Stopwatch (start/pause, lap, reset; high-precision rAF)
- Timer (presets, custom seconds, countdown alert)
- Weather of the Day (current temperature, wind, condition via Open‑Meteo, no API key)
- Mobile-first, touch-friendly design
- iOS motion/orientation permission handling
- Works fully in-browser (no native app)

## Tech Stack
- React + Vite
- TypeScript
- Open‑Meteo API for weather (no key required)
- Screen Orientation API + matchMedia + DeviceOrientationEvent fallback

## Orientation Mapping
- portrait-primary → Alarm
- portrait-secondary → Timer
- landscape-primary → Stopwatch
- landscape-secondary → Weather

## Project Structure
- src/services/orientation.ts — cross-browser orientation detection with iOS permission flow
- src/services/weather.ts — Open‑Meteo current weather fetcher
- src/components/AlarmClock.tsx — alarm UI/logic
- src/components/Stopwatch.tsx — stopwatch UI/logic
- src/components/Timer.tsx — timer UI/logic
- src/components/WeatherCard.tsx — weather UI/logic (geolocation + fetch)
- src/App.tsx — mode router and layout
- src/styles.css — mobile-first styling

## Prerequisites
- Node.js 18+ and npm
- For iOS motion/orientation permission to work, serve over HTTPS (Vercel/Netlify/GitHub Pages are fine)

## Setup
1) Install dependencies
- npm install

2) Run dev server
- npm run dev
- Open the local URL on your phone. For iOS sensor permissions, use HTTPS (e.g., deploy or use a local HTTPS tunnel).

3) Build
- npm run build
- Output goes to dist/

## Environment Variables
None required. Weather uses Open‑Meteo (no API key).

If you plan to deploy to GitHub Pages under a repository subpath, set Vite base in vite.config.ts to "/your-repo-name/". For multi-host support, you can make base configurable via env.

## Deployment (Free Options)
- GitHub Pages
  - If deploying at username.github.io/repo-name, set base: "/repo-name/" in vite.config.ts.
  - npm i -D gh-pages
  - Add scripts: "predeploy": "npm run build", "deploy": "gh-pages -d dist"
  - npm run deploy
  - Enable Pages on gh-pages branch in repo settings.
- Vercel
  - Import GitHub repo; framework auto-detected; build = npm run build; output = dist.
- Netlify
  - Build command: npm run build
  - Publish directory: dist
  - For SPAs with client routing (not needed here), add a 200 redirect.

All three serve over HTTPS, which is required for iOS motion/orientation permission prompts.

## iOS Motion/Orientation Permission
- iOS 13+ requires a user gesture to call DeviceOrientationEvent.requestPermission()
- The app shows a banner: tap “Allow” to grant permission
- Requires HTTPS; otherwise permission will not be granted

## Weather API
- Provider: Open‑Meteo (free tier, no API key)
- Data: temperature_2m, wind_speed_10m, weather_code
- The app requests browser geolocation to fetch local current weather

## Testing Checklist
- Rotate through all four orientations; confirm mode switches:
  - Portrait Upright → Alarm
  - Landscape Right-Side Up → Stopwatch
  - Portrait Upside Down → Timer
  - Landscape Left-Side Up → Weather
- iOS Safari:
  - Before permission: only portrait/landscape might be detected
  - After tapping “Allow”: upside-down and left-side-up should work
- Weather:
  - Grant geolocation; verify temperature and condition appear
  - Deny geolocation; see a friendly error
- Timer/Alarm/Stopwatch:
  - Alarm triggers at selected HH:mm with alert + tone
  - Stopwatch Start/Pause/Lap/Reset behave correctly
  - Timer presets and custom input work; alert at 0

## Accessibility & UX
- Large touch targets and single-column layout
- Minimal layout shift between modes
- Subtitles indicate the active orientation
- Motion permission banner is dismissible upon granting

## Known Limitations
- Some older/mobile browsers may not expose full Screen Orientation types; fallback heuristics using DeviceOrientation beta/gamma are used.
- On desktop, orientation features may not reflect device posture.

## License
MIT

## Creator
- Name: Amol Gadage
- Portfolio: https://amolsoftwares.com/
- LinkedIn: https://www.linkedin.com/in/amolgadge663/
- GitHub: https://github.com/amolgadge663/
- Blog: https://amolsoftwares.blogspot.com/
- Instagram: https://www.instagram.com/amolsoftwares/
- YouTube: https://www.youtube.com/@AmolTech
- YouTube: https://www.youtube.com/@AmolSoftwares

## About Me
Java Developer with over 5.5+ years of experience across Waterfall, Agile, and Kanban SDLC. Skilled in requirement gathering, client interaction, analysis, design, development, handling clients, and managing projects. Working as a Java Backend Developer + DevOps Engineer with Spring Boot 3.x, Java 17, Azure Cloud, Kubernetes, Docker, CI/CD, Microservices, Spring Security, and more.

I’m a Software Engineer who loves building mobile apps, websites, writing blogs, creating Instagram reels, and YouTube videos. My specialties include:
- Backend: Java, Spring Boot, Microservices, REST, Security
- Cloud & DevOps: AWS, GCP, Azure, Kubernetes, Docker, Jenkins, CI/CD
- Other: Kotlin, Flutter, Go, Python, AI/ML
- Frontend: React, Vite, TypeScript, Node.js
- Domains: Insurance and more

Contributions, suggestions, and stars are welcome!

[1] https://amolsoftwares.blogspot.com