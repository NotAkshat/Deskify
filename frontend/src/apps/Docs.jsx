import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

export default function Docs({ data }) {
  if (!data?.url) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        No document to display
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-white">
      
      {/* Scrollable document area */}
      <div className="flex-1 overflow-auto">
        <DocViewer
          documents={[{ uri: data.url }]}
          pluginRenderers={DocViewerRenderers}
          style={{ height: "100%" }}
        />
      </div>

    </div>
  );
}
