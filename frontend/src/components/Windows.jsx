import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

  const resizeRef = useRef(null);

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
     WINDOW ANIMATIONS
  ========================= */

  const variants = {
    initial: {
      scale: 0.9,
      opacity: 0,
      y: 40,
    },

    open: {
      scale: isFocused ? 1 : 0.98,
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
      },
    },

    minimize: {
      scale: 0.3,
      opacity: 0,
      y: 300,
      transition: {
        duration: 0.25,
      },
    },
  };

  const AppComponent = APP_CONFIG[win.app]?.component;

  return (
    <AnimatePresence>
      {!win.minimized && (
        <motion.div
          key={win.id}
          layout
          variants={variants}
          initial="initial"
          animate="open"
          exit="minimize"
          tabIndex={0}
          className={`relative rounded-xl shadow-lg flex flex-col overflow-hidden
          bg-black/30 backdrop-blur-xl border border-white/10
          ${isFocused ? "ring-2 ring-blue-400" : ""}`}
          style={{
            width: "100%",
            height: "100%",
            zIndex: win.zIndex,
          }}
          onMouseDown={() => focusWindow(win.id)}
        >

          {/* ================= TITLE BAR ================= */}

          <div className="bg-slate-800 text-white p-2 flex justify-between items-center select-none shrink-0">
            <span className="truncate text-sm">{win.title}</span>

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

          <div className="flex-1 overflow-auto bg-black/40 backdrop-blur-xl border-t border-white/10 p-4">

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
              ref={resizeRef}
              className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize"
              onMouseDown={onResizeStart}
            />
          )}

        </motion.div>
      )}
    </AnimatePresence>
  );
}