import { useState } from "react";

export default function CalculatorApp() {
  const [display, setDisplay] = useState("");

  const handleInput = (value) => {
    if (value === "C") return setDisplay("");
    if (value === "=") {
      try {
        setDisplay(eval(display).toString());
      } catch {
        setDisplay("Error");
      }
      return;
    }
    setDisplay((prev) => prev + value);
  };

  const handleKeyDown = (e) => {
    const key = e.key;

    if (/[0-9]/.test(key) || ["+", "-", "*", "/", "."].includes(key)) {
      handleInput(key);
    }

    if (key === "Enter" || key === "=") handleInput("=");
    if (key === "Backspace") setDisplay((p) => p.slice(0, -1));
    if (key === "Escape") handleInput("C");
  };

  return (
    <div
      className="h-full flex flex-col p-2 gap-2 bg-gray-100"
      onKeyDown={handleKeyDown}
    >
      <div className="bg-black text-white text-right px-4 py-3 rounded text-2xl font-mono">
        {display || "0"}
      </div>

      <div className="grid grid-cols-4 gap-2">
        {["7","8","9","/","4","5","6","*","1","2","3","-","0",".","C","+","="].map(
          (btn) => (
            <button
              key={btn}
              onClick={() => handleInput(btn)}
              className="bg-slate-300 hover:bg-slate-400 rounded p-2 font-bold"
            >
              {btn}
            </button>
          )
        )}
      </div>
    </div>
  );
}
