import { useState, useEffect } from "react";
import { mockFileSystem } from "../utils/mockFileSystem";
import { supabase } from "../lib/supabase";

export default function FileManagerApp({ openApp }) {
  const [path, setPath] = useState([mockFileSystem]);
  const [notes, setNotes] = useState([]);
  const [user, setUser] = useState(null);

  // right click menu
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const currentDir = path[path.length - 1];

  /* =========================
     GET USER
  ========================= */
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();
  }, []);

  /* =========================
     FETCH USER NOTES
  ========================= */
  useEffect(() => {
    if (!user) return;
    fetchNotes();
  }, [user]);

  const fetchNotes = async () => {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching notes:", error);
    } else {
      setNotes(data);
    }
  };

  /* =========================
     REALTIME REFRESH
  ========================= */
  useEffect(() => {
    window.addEventListener("notesUpdated", fetchNotes);
    return () =>
      window.removeEventListener("notesUpdated", fetchNotes);
  }, [user]);

  /* =========================
     RIGHT CLICK MENU
  ========================= */
  const handleRightClick = (e, item) => {
    e.preventDefault();
    setSelectedItem(item);
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    const closeMenu = () => setContextMenu(null);
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, []);

  /* =========================
     RENAME NOTE
  ========================= */
  const renameNote = async () => {
    if (!selectedItem?.id) return;

    const newName = prompt("Enter new file name");

    if (!newName) return;

    await supabase
      .from("notes")
      .update({ title: newName })
      .eq("id", selectedItem.id);

    fetchNotes();
  };

  /* =========================
     DELETE NOTE
  ========================= */
  const deleteNote = async () => {
    if (!selectedItem?.id) return;

    await supabase.from("notes").delete().eq("id", selectedItem.id);

    fetchNotes();
  };

  /* =========================
     CONVERT NOTES TO FILES
  ========================= */
  const notesAsFiles = notes.map((note) => ({
    id: note.id,
    name: note.title || `Note-${note.id.slice(0, 4)}.txt`,
    type: "file",
    extension: "txt",
    content: note.content,
  }));

  /* =========================
     OPEN ITEM
  ========================= */
  const openItem = (item) => {
    if (item.type === "folder") {
      setPath((prev) => [...prev, item]);
      return;
    }

    if (item.extension === "txt") {
      openApp("notes", { content: item.content, noteId: item.id });
    }

    if (["pdf", "docx", "pptx"].includes(item.extension)) {
      openApp("docs", { url: item.url });
    }

    if (["mp4", "webm", "m3u8"].includes(item.extension)) {
      openApp("media", { url: item.url });
    }

    if (["png", "jpg", "jpeg", "gif", "webp"].includes(item.extension)) {
      openApp("image", {
        images: [
          {
            original: item.url,
            thumbnail: item.url,
          },
        ],
        startIndex: 0,
      });
    }
  };

  /* =========================
     NAVIGATION
  ========================= */
  const goBack = () => {
    if (path.length > 1) {
      setPath((prev) => prev.slice(0, -1));
    }
  };

  const allItems = [...(currentDir.children || []), ...notesAsFiles];

  return (
    <div className="h-full flex flex-col bg-gray-100">

      {/* ===== Toolbar ===== */}
      <div className="flex items-center gap-2 p-2 bg-gray-200 shrink-0">
        <button
          onClick={goBack}
          disabled={path.length === 1}
          className="px-2 py-1 bg-slate-300 rounded disabled:opacity-50"
        >
          ← Back
        </button>

        <span className="text-sm text-gray-600">
          /{path.map((p) => p.name).join("/")}
        </span>
      </div>

      {/* ===== File List ===== */}
      <div className="flex-1 flex flex-row flex-wrap overflow-auto p-2">
        {allItems.map((item) => (
          <div
            key={item.id || item.name}
            onDoubleClick={() => openItem(item)}
            onContextMenu={(e) => handleRightClick(e, item)}
            className="gap-2 p-2 cursor-pointer rounded text-center w-24"
          >
            <span>
              {item.type === "folder" ? (
                <i className="fa-solid fa-folder text-6xl text-amber-300 hover:text-amber-500"></i>
              ) : (
                <i className="fa-solid fa-file-lines text-6xl text-gray-500 hover:text-gray-700"></i>
              )}
            </span>

            <br />
            <span className="text-xs break-words">{item.name}</span>
          </div>
        ))}
      </div>

      {/* ===== CONTEXT MENU ===== */}
      {contextMenu && (
        <div
          style={{
            top: contextMenu.y,
            left: contextMenu.x,
            position: "fixed",
          }}
          className="bg-white shadow-lg border rounded w-40 z-50"
        >
          <button
            className="block w-full text-left px-3 py-2 hover:bg-gray-100"
            onClick={() => openItem(selectedItem)}
          >
            Open
          </button>

          <button
            className="block w-full text-left px-3 py-2 hover:bg-gray-100"
            onClick={renameNote}
          >
            Rename
          </button>

          <button
            className="block w-full text-left px-3 py-2 hover:bg-red-100 text-red-600"
            onClick={deleteNote}
          >
            Delete
          </button>
        </div>
      )}

    </div>
  );
}