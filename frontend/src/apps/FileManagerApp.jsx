import { useState, useEffect } from "react";
import { mockFileSystem } from "../utils/mockFileSystem";
import { supabase } from "../lib/supabase";

export default function FileManagerApp({ openApp }) {
  const [path, setPath] = useState([mockFileSystem]);
  const [notes, setNotes] = useState([]);
  const [files, setFiles] = useState([]);
  const [user, setUser] = useState(null);

  const [contextMenu, setContextMenu] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const currentDir = path[path.length - 1];

  /* ================= USER ================= */
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();
  }, []);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    if (!user) return;
    fetchNotes();
    fetchFiles();
  }, [user]);

  const fetchNotes = async () => {
    const { data } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    setNotes(data || []);
  };

  const fetchFiles = async () => {
    const { data } = await supabase
      .from("files")
      .select("*")
      .eq("user_id", user.id);

    setFiles(data || []);
  };

  /* ================= REALTIME REFRESH ================= */
  useEffect(() => {
    const refresh = () => {
      fetchNotes();
      fetchFiles();
    };

    window.addEventListener("notesUpdated", refresh);
    return () => window.removeEventListener("notesUpdated", refresh);
  }, [user]);

  /* ================= RIGHT CLICK ================= */
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

  /* ================= RENAME ================= */
  const renameItem = async () => {
    if (!selectedItem?.id) return;

    const newName = prompt("Enter new name");
    if (!newName) return;

    if (selectedItem.source === "note") {
      await supabase.from("notes").update({ title: newName }).eq("id", selectedItem.id);
      fetchNotes();
    }

    if (selectedItem.source === "file") {
      await supabase.from("files").update({ name: newName }).eq("id", selectedItem.id);
      fetchFiles();
    }
  };

  /* ================= DELETE ================= */
  const deleteItem = async () => {
    if (!selectedItem?.id) return;

    if (selectedItem.source === "note") {
      await supabase.from("notes").delete().eq("id", selectedItem.id);
      fetchNotes();
    }

    if (selectedItem.source === "file") {
      await supabase.from("files").delete().eq("id", selectedItem.id);
      fetchFiles();
    }
  };

  /* ================= CONVERT DATA ================= */
  const notesAsFiles = notes.map((note) => ({
    id: note.id,
    name: note.title || `Note-${note.id.slice(0, 4)}.txt`,
    type: "file",
    extension: "txt",
    content: note.content,
    source: "note",
  }));

  const storageFiles = files.map((file) => ({
    id: file.id,
    name: file.name,
    type: "file",
    extension: file.extension,
    url: file.url,
    source: "file",
  }));

  const allItems = [
    ...(currentDir.children || []),
    ...notesAsFiles,
    ...storageFiles,
  ];

  /* ================= OPEN ITEM ================= */
  const openItem = (item) => {
    if (item.type === "folder") {
      setPath((prev) => [...prev, item]);
      return;
    }

    if (item.extension === "txt") {
      openApp("notes", { content: item.content, noteId: item.id });
    }

    if (["png", "jpg", "jpeg", "gif", "webp"].includes(item.extension)) {
      openApp("image", {
        images: [{ original: item.url, thumbnail: item.url }],
        startIndex: 0,
      });
    }

    if (["mp4", "webm"].includes(item.extension)) {
      openApp("media", { url: item.url });
    }
  };

  /* ================= NAVIGATION ================= */
  const goBack = () => {
    if (path.length > 1) {
      setPath((prev) => prev.slice(0, -1));
    }
  };

  /* ================= ICON HELPER ================= */
  const getIcon = (ext, type) => {
    if (type === "folder") return "fa-folder text-amber-400";

    if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext))
      return "fa-file-image text-purple-500";

    if (["mp4", "webm"].includes(ext))
      return "fa-file-video text-blue-500";

    if (ext === "txt") return "fa-file-lines text-gray-600";

    return "fa-file text-gray-500";
  };

  return (
    <div className="h-full flex flex-col">

      {/* ===== Toolbar ===== */}
      <div className="flex items-center gap-2 p-2 shrink-0">
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
      <div className="flex-1 flex flex-wrap overflow-auto p-2">
        {allItems.map((item) => (
          <div
            key={item.id || item.name}
            onDoubleClick={() => openItem(item)}
            onContextMenu={(e) => handleRightClick(e, item)}
            className="p-2 cursor-pointer rounded text-center w-24"
          >
            <i className={`fa-solid text-6xl ${getIcon(item.extension, item.type)}`} />
            <div className="text-xs break-words mt-1">{item.name}</div>
          </div>
        ))}
      </div>

      {/* ===== Context Menu ===== */}
      {contextMenu && (
        <div
          style={{ top: contextMenu.y, left: contextMenu.x }}
          className="fixed bg-white shadow-lg border rounded w-40 z-50"
        >
          <button className="block w-full px-3 py-2 hover:bg-gray-100" onClick={() => openItem(selectedItem)}>
            Open
          </button>

          <button className="block w-full px-3 py-2 hover:bg-gray-100" onClick={renameItem}>
            Rename
          </button>

          <button className="block w-full px-3 py-2 hover:bg-red-100 text-red-600" onClick={deleteItem}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
}