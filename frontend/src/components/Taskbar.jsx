import { APP_CONFIG } from "../utils";

export default function Taskbar({
  onOpenApp,
  windows,
  restoreWindow,
  focusedWindowId,
}) {
  return (
    <div className="fixed bottom-0 w-full h-12 bg-black/70 backdrop-blur-md flex items-center px-4 text-white gap-4">
      
      {/* ===== App Launchers ===== */}
      {Object.entries(APP_CONFIG).map(([key, app]) => (
        <button
          key={key}
          onClick={() => onOpenApp(key)}
          title={app.title}
          className="hover:text-gray-400"
        >
          <i className={app.icon}></i>
        </button>
      ))}

      {/* Spacer */}
      <div className="flex-1" />

      {/* ===== Running / Minimized Windows ===== */}
      <div className="flex items-center gap-2">
        {windows.map((w) => {
          const app = APP_CONFIG[w.app];
          if (!app) return null;

          return (
            <button
              key={w.id}
              onClick={() => restoreWindow(w.id)}
              title={w.title}
              className={`w-8 h-8 flex items-center justify-center rounded transition
                ${
                  focusedWindowId === w.id
                    ? "bg-blue-600"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
            >
              <i className={app.icon}></i>
            </button>
          );
        })}
      </div>
    </div>
  );
}
