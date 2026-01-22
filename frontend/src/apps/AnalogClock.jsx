import { useEffect, useState } from "react";
import Clock from "react-clock";
import "react-clock/dist/Clock.css";

export default function AnalogClock() {
  const [value, setValue] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setValue(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none ">
      <div className="-translate-y-64 scale-125 opacity-80">
        <Clock
          value={value}
          renderNumbers={true}
          hourHandWidth={4}
          minuteHandWidth={3}
          secondHandWidth={2}
        />
      </div>
    </div>
  );
}
