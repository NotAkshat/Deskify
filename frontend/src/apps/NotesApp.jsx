import { useEffect, useState } from "react";

export default function NotesApp(data) {
  const [text, setText] = useState("");
  // Load saved note on mount
  useEffect(() => {
    const saved = localStorage.getItem("notes-content");
    if (saved) {
      setText(saved);
    }
  }, []);

  // Save note whenever text changes
  useEffect(() => {
    localStorage.setItem("notes-content", text);
  }, [text]);

  useEffect(() =>  {
    if(data?.content) {
      setText(data.content)
    }

  }, [data]);

  return (
    <textarea
      className="w-full h-full resize-none outline-none p-2 bg-transparent text-black"
      placeholder="Start typing your notes..."
      value={text}
      onChange={(e) => setText(e.target.value)}
    />
  );
}
