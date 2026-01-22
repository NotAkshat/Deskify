import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

export default function ImageViewer({ data }) {
  if (!data?.images || data.images.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Unsupported media
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-black overflow-hidden">
      <ImageGallery
        items={data.images}
        startIndex={data.startIndex || 0}
        showPlayButton={false}
        showFullscreenButton={true}
        showNav={true}
        lazyLoad
      />
    </div>
  );
}
