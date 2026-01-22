import { useState } from "react";
import Taskbar from "./components/Taskbar";
import Windows from "./components/Windows";
import { APP_CONFIG } from "./utils/index";
import AnalogClock from "./apps/AnalogClock";

function App() {
  const [windows, setWindows] = useState([]);
  const [activeWindowId, setActiveWindowId] = useState(null);

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
      if (prev.length === 0) return prev;

      const maxZ = Math.max(...prev.map((w) => w.zIndex));

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
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id
          ? {
              ...w,
              minimized: false,
              zIndex: Math.max(...prev.map((p) => p.zIndex)) + 1,
            }
          : w,
      ),
    );
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-slate-900 via-slate-600 to-slate-400 relative">

      <AnalogClock />

      {/* Desktop area */}
      <div className="absolute inset-0">
        {windows.map((win) => (
          <Windows
            key={win.id}
            win={win}
            focusWindow={focusWindow}
            closeWindow={closeWindow}
            updateWindow={updateWindow}
            isFocused={win.id === activeWindowId}
            openApp={openApp}
            minimizeWindow={minimizeWindow}
            toggleFullscreen={toggleFullscreen}
          />
        ))}
      </div>

      {/* Taskbar */}
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
