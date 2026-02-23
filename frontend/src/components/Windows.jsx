import { useRef } from "react";
import { APP_CONFIG } from "../utils/index.js";


export default function Windows({
  win,
  focusWindow,
  closeWindow,
  updateWindow,
  minimizeWindow,
  toggleFullscreen,
  isFocused,
  openApp,
}) {
  // Do not render minimized windows
  if (win.minimized) return null;

  const dragRef = useRef(null);

  /* =========================
     DRAG HANDLER
  ========================= */
  const onDragStart = (e) => {
    if (win.fullscreen) return;

    e.stopPropagation();
    focusWindow(win.id);

    const startX = e.clientX;
    const startY = e.clientY;
    const origX = win.x;
    const origY = win.y;

    const onMouseMove = (e) => {
      updateWindow(win.id, {
        x: origX + (e.clientX - startX),
        y: origY + (e.clientY - startY),
      });
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  /* =========================
     RESIZE HANDLER
  ========================= */
  const onResizeStart = (e) => {
    if (win.fullscreen) return;

    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;
    const startW = win.width;
    const startH = win.height;

    const onMouseMove = (e) => {
      updateWindow(win.id, {
        width: Math.max(250, startW + (e.clientX - startX)),
        height: Math.max(180, startH + (e.clientY - startY)),
      });
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  /* =========================
     WINDOW STYLE
  ========================= */
  const windowStyle = win.fullscreen
    ? {
        left: 0,
        top: 0,
        width: "100%",
        height: "calc(100% - 48px)", // taskbar height
        zIndex: win.zIndex,
      }
    : {
        left: win.x,
        top: win.y,
        width: win.width,
        height: win.height,
        zIndex: win.zIndex,
      };

  const AppComponent = APP_CONFIG[win.app]?.component;

  return (
    <div
      tabIndex={0}
      className={`absolute rounded-md shadow-lg flex flex-col overflow-hidden
        ${isFocused ? "ring-2 ring-blue-400" : ""}`}
      style={windowStyle}
      onMouseDown={() => focusWindow(win.id)}
    >
      {/* ================= TITLE BAR ================= */}
      <div
        className="bg-slate-800 text-white p-2 flex justify-between items-center select-none shrink-0"
        onMouseDown={onDragStart}
      >
        <span className="truncate">{win.title}</span>

        <div className="flex gap-2">
          {/* Minimize */}
          <button
            title="Minimize"
            onClick={(e) => {
              e.stopPropagation();
              minimizeWindow(win.id);
            }}
          >
            🗕
          </button>

          {/* Fullscreen */}
          <button
            title="Fullscreen"
            onClick={(e) => {
              e.stopPropagation();
              toggleFullscreen(win.id);
            }}
          >
            {win.fullscreen ? "🗗" : "🗖"}
          </button>

          {/* Close */}
          <button
            title="Close"
            onClick={(e) => {
              e.stopPropagation();
              closeWindow(win.id);
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* ================= APP CONTENT ================= */}
      <div className="flex-1 overflow-hidden bg-white">
        {AppComponent && (
          <AppComponent
            data={win.data}
            isFocused={isFocused}
            openApp={openApp}
            windowId={win.id}
          />
        )}
      </div>

      {/* ================= RESIZE HANDLE ================= */}
      {!win.fullscreen && (
        <div
          className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize"
          onMouseDown={onResizeStart}
        />
      )}
    </div>
  );
}
