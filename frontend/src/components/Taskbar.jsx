import { APP_CONFIG } from "../utils";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Taskbar({
  onOpenApp,
  windows,
  restoreWindow,
  focusedWindowId,
}) {

  const mouseX = useMotionValue(Infinity);

  // group windows by app
  const windowsByApp = {};
  windows.forEach((w) => {
    if (!windowsByApp[w.app]) windowsByApp[w.app] = [];
    windowsByApp[w.app].push(w);
  });

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 flex h-16 items-end gap-4 rounded-xl bg-black/70 backdrop-blur-xl px-4 pb-2 text-white shadow-lg"
    >
      {Object.entries(APP_CONFIG).map(([key, app]) => {
        const appWindows = windowsByApp[key] || [];
        const isRunning = appWindows.length > 0;

        return (
          <DockIcon
            key={key}
            mouseX={mouseX}
            icon={app.icon}
            title={app.title}
            isRunning={isRunning}
            onClick={() => {
              if (isRunning) {
                restoreWindow(appWindows[0].id);
              } else {
                onOpenApp(key);
              }
            }}
          />
        );
      })}
    </motion.div>
  );
}

function DockIcon({ mouseX, icon, title, isRunning, onClick }) {
  const ref = useRef(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const size = useTransform(distance, [-150, 0, 150], [40, 70, 40]);
  const scale = useSpring(size, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <motion.div
      ref={ref}
      style={{ width: scale, height: scale }}
      onClick={onClick}
      title={title}
      className="relative flex items-center justify-center cursor-pointer rounded-lg bg-gray-700 hover:bg-gray-600 transition"
    >
      <i className={icon}></i>

      {/* running dot */}
      {isRunning && (
        <span className="absolute -bottom-1 w-1.5 h-1.5 bg-white rounded-full"></span>
      )}
    </motion.div>
  );
}