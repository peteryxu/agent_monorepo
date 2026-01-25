# Rocket Launch Terminal

A futuristic NASA Mission Control style rocket launch terminal built with Next.js, React, and Tailwind CSS v4.

## Design

The interface was designed using Pencil and exported to React/Next.js code. The design file is located at:
`rocket-launch-terminal.pen`

## Features

- **NASA Mission Control aesthetic** - Professional, data-dense dashboard
- **6 System Status Panels**:
  - Fuel Systems (LOX & RP-1 levels with progress bars)
  - Engine Status (5 engines with indicators)
  - Trajectory & Navigation (altitude, velocity, coordinates)
  - Communications (telemetry, ground station, signal)
  - Environmental (temperature, wind, weather status)
  - Vehicle Health (structural integrity, avionics, power)
- **Launch Control Section**:
  - Large countdown timer (T- 00:05:42)
  - 4 Control buttons: LAUNCH, ABORT, HOLD, RESET
  - Launch authorization panel with safety checklist
- **System Events Log** with timestamps

## Tech Stack

- **Next.js 15** - React framework
- **React 19** - UI library
- **Tailwind CSS v4** - Utility-first CSS framework
- **TypeScript** - Type safety
- **Space Grotesk & IBM Plex Mono** - Typography

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the rocket launch terminal.

### Build

```bash
npm run build
npm start
```

## Design System

### Color Palette

- **Background**: Dark navy (#0a0e1a, #121820)
- **Panels**: Near-black (#0F0F0F)
- **Borders**: Dark gray (#2A2A2A)
- **Accent Blue**: Electric blue (#00d4ff) - Primary indicators
- **Accent Green**: Success green (#00ff88) - GO states
- **Accent Orange**: Warning orange (#ff9500) - HOLD states
- **Accent Red**: Alert red (#ff0000) - ABORT state

### Typography

- **Headers**: Space Grotesk (geometric, technical)
- **Data/Labels**: IBM Plex Mono (terminal aesthetic)
- Bracket labels convention: [SYS:001], [LAUNCH:SEQ], etc.

## Project Structure

```
src/
├── app/
│   ├── globals.css          # Tailwind v4 styles and CSS variables
│   ├── layout.tsx           # Root layout with fonts
│   └── page.tsx             # Home page
└── components/
    └── RocketLaunchTerminal.tsx  # Main terminal component
```

## Customization

All colors are defined as CSS variables in `src/app/globals.css`. You can easily customize the color scheme by modifying the `:root` variables.

## License

MIT
