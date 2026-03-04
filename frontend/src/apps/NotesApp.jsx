import { supabase } from "../lib/supabase";
import { useEffect, useState } from "react";

export default function NotesApp() {
  const [text, setText] = useState("");
  const [noteId, setNoteId] = useState(null);
  const [noteName, setNoteName] = useState("Untitled");
  const [user, setUser] = useState(null);

  // =============================
  // GET LOGGED IN USER
  // =============================
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();
  }, []);

  // =============================
  // FETCH LATEST NOTE FOR USER
  // =============================
  useEffect(() => {
    if (!user) return;
    fetchNote();
  }, [user]);

  const fetchNote = async () => {
    const { data } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1);

    if (data && data.length > 0) {
      setText(data[0].content);
      setNoteId(data[0].id);
      setNoteName(data[0].name || "Untitled");
    }
  };

  // =============================
  // AUTO SAVE (DEBOUNCE)
  // =============================
  useEffect(() => {
    if (!text || !user) return;

    const timeout = setTimeout(() => {
      saveNote();
    }, 800);

    return () => clearTimeout(timeout);
  }, [text]);

  // =============================
  // SAVE NOTE
  // =============================
  const saveNote = async () => {
    if (!user) return;

    if (noteId) {
      await supabase
        .from("notes")
        .update({
          content: text,
          name: noteName,
        })
        .eq("id", noteId);
    } else {
      const { data } = await supabase
        .from("notes")
        .insert([
          {
            content: text,
            name: noteName,
            user_id: user.id,
          },
        ])
        .select();

      if (data && data.length > 0) {
        setNoteId(data[0].id);
      }
    }
  };

  // =============================
  // DELETE NOTE
  // =============================
  const deleteNote = async () => {
    if (!noteId) return;

    await supabase.from("notes").delete().eq("id", noteId);

    setText("");
    setNoteId(null);
    setNoteName("Untitled");
  };

  // =============================
  // RENAME NOTE
  // =============================
  const renameNote = async () => {
    const newName = prompt("Enter new note name");

    if (!newName) return;

    setNoteName(newName);

    if (noteId) {
      await supabase
        .from("notes")
        .update({ name: newName })
        .eq("id", noteId);
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* HEADER */}
      <div className="flex items-center justify-between px-3 py-1">
        <span className="font-semibold">{noteName}</span>

        <div className="flex gap-2">
          <button
            onClick={renameNote}
            className="bg-blue-500 text-white px-2 py-1 rounded"
          >
            Rename
          </button>

          <button
            onClick={deleteNote}
            className="bg-red-500 text-white px-2 py-1 rounded"
          >
            Delete
          </button>
        </div>
      </div>

      {/* TEXTAREA */}
      <textarea
        className="flex-1 resize-none outline-none p-2 bg-transparent text-white font-bold"
        placeholder="Start typing your notes..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </div>
  );
}