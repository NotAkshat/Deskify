import { useState } from "react";
import { mockFileSystem } from "../utils/mockFileSystem";

export default function FileManagerApp({ openApp }) {
  const [path, setPath] = useState([mockFileSystem]);

  const currentDir = path[path.length - 1];

  const openItem = (item) => {
    if (item.type === "folder") {
      setPath((prev) => [...prev, item]);
      return;
    }

    if (item.extension === "txt") {
      openApp("notes", { content: item.content });
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

  const goBack = () => {
    if (path.length > 1) {
      setPath((prev) => prev.slice(0, -1));
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-100">
      {/* Toolbar */}
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

      {/* File list */}
      <div className="flex-1 flex flex-row overflow-auto p-2">
        {currentDir.children?.map((item) => (
          <div
            key={item.name}
            onDoubleClick={() => openItem(item)}
            className="gap-2 p-2 cursor-pointer rounded"
          >
            <span className="text-xl">
              {item.type === "folder" ? (
                <i className="fa-solid fa-folder text-6xl text-amber-300 hover:text-amber-500"></i>
              ) : (
                <i className="fa-solid fa-file-lines text-6xl text-gray-500 hover:text-gray-700"></i>
              )}
            </span>
            <br />
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
