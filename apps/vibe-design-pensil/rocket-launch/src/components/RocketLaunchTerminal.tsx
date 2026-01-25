export default function RocketLaunchTerminal() {
  return (
    <div className="h-screen w-screen bg-[var(--bg-primary)] flex flex-col">
      {/* Header */}
      <header className="w-full h-[100px] bg-[var(--bg-secondary)] flex items-center justify-between px-8 border-[3px] border-[var(--border-accent)]">
        <div className="flex flex-col gap-2">
          <span className="font-ibm-plex-mono text-[11px] text-[var(--accent-blue)] tracking-[1px]">
            [MISSION:CONTROL]
          </span>
          <h1 className="font-space-grotesk text-[32px] font-bold text-[var(--text-primary)] tracking-[2px]">
            MISSION CONTROL - FALCON IX
          </h1>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-[var(--accent-green)]" />
            <span className="font-space-grotesk text-[14px] font-bold text-[var(--accent-green)] tracking-[1.5px]">
              ALL SYSTEMS GO
            </span>
          </div>
        </div>
        <div className="flex gap-6 items-center">
          <div className="flex items-center gap-4">
            <span className="font-ibm-plex-mono text-[11px] text-[var(--text-secondary)] tracking-[1px]">MET:</span>
            <span className="font-space-grotesk text-[16px] font-bold text-[var(--accent-blue)] tracking-[1px]">00:05:42</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-ibm-plex-mono text-[11px] text-[var(--text-secondary)] tracking-[1px]">UTC:</span>
            <span className="font-space-grotesk text-[16px] font-bold text-[var(--text-primary)] tracking-[1px]">14:23:18</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex gap-6 p-8">
        {/* Left Panel */}
        <div className="w-[600px] flex flex-col gap-5">
          {/* Fuel Systems */}
          <div className="w-full h-[240px] bg-[var(--bg-panel)] border-[3px] border-[var(--border-primary)] p-6 flex flex-col gap-3">
            <h2 className="font-space-grotesk text-[12px] font-bold text-[var(--text-primary)] tracking-[1px]">
              [SYS:001] FUEL SYSTEMS
            </h2>
            <p className="font-ibm-plex-mono text-[10px] text-[var(--accent-green)] tracking-[1px]">
              STATUS: NOMINAL
            </p>
            <span className="font-ibm-plex-mono text-[10px] text-[var(--text-secondary)] tracking-[1px]">
              LOX (LIQUID OXYGEN)
            </span>
            <div className="w-full h-2 bg-[var(--border-primary)]">
              <div className="w-[92%] h-full bg-[var(--accent-blue)]" />
            </div>
            <span className="font-space-grotesk text-[18px] font-bold text-[var(--text-primary)]">92.4%</span>
            <span className="font-ibm-plex-mono text-[10px] text-[var(--text-secondary)] tracking-[1px]">
              RP-1 (ROCKET PROPELLANT)
            </span>
            <div className="w-full h-2 bg-[var(--border-primary)]">
              <div className="w-[88%] h-full bg-[var(--accent-blue)]" />
            </div>
            <span className="font-space-grotesk text-[18px] font-bold text-[var(--text-primary)]">88.7%</span>
          </div>

          {/* Engine Status */}
          <div className="w-full h-[240px] bg-[var(--bg-panel)] border-[3px] border-[var(--border-primary)] p-6 flex flex-col gap-3">
            <h2 className="font-space-grotesk text-[12px] font-bold text-[var(--text-primary)] tracking-[1px]">
              [SYS:002] ENGINE STATUS
            </h2>
            <div className="flex gap-2 w-full">
              {[1, 2, 3, 4, 5].map((num) => (
                <div key={num} className="w-12 h-12 bg-[var(--accent-green)] flex items-center justify-center">
                  <span className="font-space-grotesk text-[16px] font-bold text-[var(--text-dark)]">{num}</span>
                </div>
              ))}
            </div>
            <span className="font-space-grotesk text-[18px] font-bold text-[var(--text-primary)]">THRUST: 100%</span>
            <span className="font-ibm-plex-mono text-[11px] text-[var(--text-secondary)]">TEMP: 2,850°C</span>
          </div>

          {/* Trajectory */}
          <div className="flex-1 bg-[var(--bg-panel)] border-[3px] border-[var(--border-primary)] p-6 flex flex-col gap-3">
            <h2 className="font-space-grotesk text-[12px] font-bold text-[var(--text-primary)] tracking-[1px]">
              [SYS:003] TRAJECTORY & NAVIGATION
            </h2>
            <div className="flex justify-between w-full gap-3">
              <span className="font-ibm-plex-mono text-[10px] text-[var(--text-secondary)] tracking-[1px]">ALTITUDE:</span>
              <span className="font-space-grotesk text-[16px] font-bold text-[var(--accent-blue)]">12,450 m</span>
            </div>
            <div className="flex justify-between w-full gap-3">
              <span className="font-ibm-plex-mono text-[10px] text-[var(--text-secondary)] tracking-[1px]">VELOCITY:</span>
              <span className="font-space-grotesk text-[16px] font-bold text-[var(--accent-blue)]">2,847 m/s</span>
            </div>
            <div className="flex justify-between w-full gap-3">
              <span className="font-ibm-plex-mono text-[10px] text-[var(--text-secondary)] tracking-[1px]">TRAJECTORY:</span>
              <span className="font-space-grotesk text-[16px] font-bold text-[var(--accent-blue)]">48.2°</span>
            </div>
            <div className="flex justify-between w-full gap-3">
              <span className="font-ibm-plex-mono text-[10px] text-[var(--text-secondary)] tracking-[1px]">COORDINATES:</span>
              <span className="font-space-grotesk text-[14px] font-bold text-[var(--text-primary)]">28.5°N 80.6°W</span>
            </div>
          </div>
        </div>

        {/* Center Panel */}
        <div className="flex-1 flex flex-col gap-5">
          {/* Communications */}
          <div className="w-full h-[200px] bg-[var(--bg-panel)] border-[3px] border-[var(--border-primary)] p-6 flex flex-col gap-3">
            <h2 className="font-space-grotesk text-[12px] font-bold text-[var(--text-primary)] tracking-[1px]">
              [SYS:004] COMMUNICATIONS
            </h2>
            <div className="flex items-center gap-3">
              <div className="w-[10px] h-[10px] bg-[var(--accent-green)]" />
              <span className="font-ibm-plex-mono text-[11px] text-[var(--text-primary)] tracking-[1px]">TELEMETRY: ACTIVE</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-[10px] h-[10px] bg-[var(--accent-green)]" />
              <span className="font-ibm-plex-mono text-[11px] text-[var(--text-primary)] tracking-[1px]">GROUND STATION: LOCKED</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-[10px] h-[10px] bg-[var(--accent-green)]" />
              <span className="font-ibm-plex-mono text-[11px] text-[var(--text-primary)] tracking-[1px]">SIGNAL: 98.7%</span>
            </div>
          </div>

          {/* Environmental */}
          <div className="w-full h-[200px] bg-[var(--bg-panel)] border-[3px] border-[var(--border-primary)] p-6 flex flex-col gap-3">
            <h2 className="font-space-grotesk text-[12px] font-bold text-[var(--text-primary)] tracking-[1px]">
              [SYS:005] ENVIRONMENTAL
            </h2>
            <div className="flex justify-between w-full gap-3">
              <span className="font-ibm-plex-mono text-[10px] text-[var(--text-secondary)] tracking-[1px]">TEMPERATURE:</span>
              <span className="font-space-grotesk text-[16px] font-bold text-[var(--text-primary)]">22°C</span>
            </div>
            <div className="flex justify-between w-full gap-3">
              <span className="font-ibm-plex-mono text-[10px] text-[var(--text-secondary)] tracking-[1px]">WIND SPEED:</span>
              <span className="font-space-grotesk text-[16px] font-bold text-[var(--text-primary)]">8.4 km/h</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-[10px] h-[10px] bg-[var(--accent-green)]" />
              <span className="font-ibm-plex-mono text-[11px] text-[var(--accent-green)] tracking-[1px]">WEATHER: GO FOR LAUNCH</span>
            </div>
          </div>

          {/* Rocket Visual */}
          <div className="w-full h-[220px] bg-[var(--bg-secondary)] border-2 border-[var(--accent-blue)] flex items-center justify-center">
            <span className="font-space-grotesk text-[var(--accent-blue)]">[ROCKET VISUAL]</span>
          </div>

          {/* Vehicle Health */}
          <div className="flex-1 bg-[var(--bg-panel)] border-[3px] border-[var(--border-primary)] p-6 flex flex-col gap-3">
            <h2 className="font-space-grotesk text-[12px] font-bold text-[var(--text-primary)] tracking-[1px]">
              [SYS:006] VEHICLE HEALTH
            </h2>
            <div className="flex justify-between w-full gap-3">
              <span className="font-ibm-plex-mono text-[10px] text-[var(--text-secondary)] tracking-[1px]">STRUCTURAL INTEGRITY:</span>
              <span className="font-space-grotesk text-[16px] font-bold text-[var(--accent-green)]">100%</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-[10px] h-[10px] bg-[var(--accent-green)]" />
              <span className="font-ibm-plex-mono text-[11px] text-[var(--text-primary)] tracking-[1px]">AVIONICS: OPERATIONAL</span>
            </div>
            <div className="flex justify-between w-full gap-3">
              <span className="font-ibm-plex-mono text-[10px] text-[var(--text-secondary)] tracking-[1px]">POWER SYSTEMS:</span>
              <span className="font-space-grotesk text-[16px] font-bold text-[var(--accent-blue)]">28.5V</span>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-[400px] flex flex-col gap-5">
          {/* Countdown */}
          <div className="w-full h-[180px] bg-[var(--bg-panel)] border-4 border-[var(--accent-blue)] p-6 flex flex-col gap-4 items-center justify-center">
            <span className="font-ibm-plex-mono text-[11px] text-[var(--accent-blue)] tracking-[1px]">[LAUNCH:SEQ]</span>
            <span className="font-space-grotesk text-[48px] font-bold text-[var(--accent-blue)] tracking-[2px]">T- 00:05:42</span>
            <span className="font-ibm-plex-mono text-[11px] text-[var(--text-primary)] tracking-[1px]">AWAITING FINAL GO</span>
          </div>

          {/* Control Buttons */}
          <div className="flex flex-col gap-3">
            <button className="w-full h-[60px] bg-[var(--accent-green)] flex items-center justify-center hover:opacity-90 transition-opacity">
              <span className="font-space-grotesk text-[16px] font-bold text-[var(--text-dark)] tracking-[2px]">LAUNCH</span>
            </button>
            <button className="w-full h-[60px] bg-[var(--accent-red)] flex items-center justify-center hover:opacity-90 transition-opacity">
              <span className="font-space-grotesk text-[16px] font-bold text-[var(--text-primary)] tracking-[2px]">ABORT</span>
            </button>
            <button className="w-full h-[60px] border-[3px] border-[var(--accent-orange)] flex items-center justify-center hover:bg-[var(--accent-orange)] hover:bg-opacity-10 transition-colors">
              <span className="font-space-grotesk text-[16px] font-bold text-[var(--accent-orange)] tracking-[2px]">HOLD</span>
            </button>
            <button className="w-full h-[60px] border-[3px] border-[var(--text-secondary)] flex items-center justify-center hover:bg-[var(--text-secondary)] hover:bg-opacity-10 transition-colors">
              <span className="font-space-grotesk text-[16px] font-bold text-[var(--text-secondary)] tracking-[2px]">RESET</span>
            </button>
          </div>

          {/* Safety Checks */}
          <div className="flex-1 bg-[var(--bg-panel)] border-[3px] border-[var(--border-primary)] p-6 flex flex-col gap-3">
            <h2 className="font-space-grotesk text-[11px] font-bold text-[var(--text-primary)] tracking-[1px]">
              [AUTH:001] LAUNCH AUTHORIZATION
            </h2>
            <div className="w-full h-10 bg-[var(--accent-green)] flex items-center justify-center">
              <span className="font-space-grotesk text-[12px] font-bold text-[var(--text-dark)] tracking-[1.5px]">LAUNCH AUTHORIZED</span>
            </div>
            <div className="w-full h-[2px] bg-[var(--border-primary)]" />
            <span className="font-ibm-plex-mono text-[10px] text-[var(--text-secondary)] tracking-[1px]">SAFETY CHECKLIST</span>
            {[
              'FUEL SYSTEMS NOMINAL',
              'ENGINES OPERATIONAL',
              'WEATHER CONDITIONS GO',
              'RANGE SAFETY ARMED',
              'FLIGHT TERMINATION READY',
              'TELEMETRY LOCKED'
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-3 h-3 bg-[var(--accent-green)]" />
                <span className="font-ibm-plex-mono text-[10px] text-[var(--text-primary)] tracking-[0.5px]">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alert Panel */}
      <div className="w-full h-[120px] bg-[var(--bg-secondary)] border-2 border-[var(--border-primary)] flex">
        <div className="w-1 bg-[var(--accent-orange)]" />
        <div className="flex-1 flex flex-col gap-3 p-5">
          <h2 className="font-space-grotesk text-[12px] font-bold text-[var(--text-primary)] tracking-[1px]">
            [LOG:001] SYSTEM EVENTS
          </h2>
          <div className="flex flex-col gap-1">
            <span className="font-ibm-plex-mono text-[10px] text-[var(--accent-blue)] tracking-[0.5px]">[00:05:42] LAUNCH SEQUENCE INITIATED</span>
            <span className="font-ibm-plex-mono text-[10px] text-[var(--accent-green)] tracking-[0.5px]">[00:05:38] ALL SYSTEMS NOMINAL - GO FOR LAUNCH</span>
            <span className="font-ibm-plex-mono text-[10px] text-[var(--text-primary)] tracking-[0.5px]">[00:05:30] RANGE SAFETY OFFICER: GO</span>
            <span className="font-ibm-plex-mono text-[10px] text-[var(--text-primary)] tracking-[0.5px]">[00:05:22] WEATHER OFFICER: GO FOR LAUNCH</span>
            <span className="font-ibm-plex-mono text-[10px] text-[var(--accent-blue)] tracking-[0.5px]">[00:05:15] TELEMETRY: SIGNAL LOCK CONFIRMED</span>
          </div>
        </div>
      </div>
    </div>
  );
}
