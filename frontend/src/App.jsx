import { useState } from "react";
import Taskbar from "./components/Taskbar";
import Windows from "./components/Windows";
import { APP_CONFIG } from "./utils";
import DigitalClock from "./apps/DigitalClock";
import Aurora from "./components/Aurora";

function App() {
  const [windows, setWindows] = useState([]);
  const [activeWindowId, setActiveWindowId] = useState(null);

  /* =========================
     WINDOW ACTIONS
  ========================= */

  const openApp = (app, data = {}) => {
    const config = APP_CONFIG[app];
    if (!config) return;

    setWindows((prev) => [
      ...prev,
      {
        id: Date.now(),
        app,
        title: config.title,
        x: 100 + prev.length * 20,
        y: 80 + prev.length * 20,
        width: config.width,
        height: config.height,
        zIndex: prev.length + 1,
        minimized: false,
        fullscreen: false,
        data,
      },
    ]);
  };

  const focusWindow = (id) => {
    setActiveWindowId(id);

    setWindows((prev) => {
      const maxZ = Math.max(0, ...prev.map((w) => w.zIndex));
      return prev.map((w) => (w.id === id ? { ...w, zIndex: maxZ + 1 } : w));
    });
  };

  const closeWindow = (id) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  };

  const updateWindow = (id, changes) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, ...changes } : w)),
    );
  };

  const minimizeWindow = (id) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, minimized: true } : w)),
    );
  };

  const toggleFullscreen = (id) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, fullscreen: !w.fullscreen } : w)),
    );
  };

  const restoreWindow = (id) => {
    setWindows((prev) => {
      const maxZ = Math.max(0, ...prev.map((w) => w.zIndex));
      return prev.map((w) =>
        w.id === id ? { ...w, minimized: false, zIndex: maxZ + 1 } : w,
      );
    });
  };

  /* =========================
     RENDER
  ========================= */

  return (
  <div className="w-screen h-screen relative overflow-hidden bg-black">

    {/* 🌌 GLOBAL BACKGROUND */}
    <div className="absolute inset-0">
      <Aurora
        colorStops={["#1a5fb4", "#3584e4", "#99c1f1"]}
        blend={0.5}
        amplitude={1.0}
        speed={1}
      />
    </div>

    {/* 🕒 CLOCK */}
    <DigitalClock />

    {/* 🪟 DESKTOP (TILING LAYOUT) */}
    <div
      className="absolute inset-x-0 top-0 bottom-12 grid gap-2 p-2 auto-rows-fr"
      style={{
        gridTemplateColumns: `repeat(${Math.ceil(
          Math.sqrt(windows.length || 1)
        )}, 1fr)`
      }}
    >
      {windows.map((win) => (
        <Windows
          key={win.id}
          win={win}
          focusWindow={focusWindow}
          closeWindow={closeWindow}
          updateWindow={updateWindow}
          minimizeWindow={minimizeWindow}
          toggleFullscreen={toggleFullscreen}
          isFocused={win.id === activeWindowId}
          openApp={openApp}
        />
      ))}
    </div>

    {/* 📌 TASKBAR */}
    <Taskbar
      onOpenApp={openApp}
      windows={windows}
      restoreWindow={restoreWindow}
      focusedWindowId={activeWindowId}
    />

  </div>
);
}

export default App;
