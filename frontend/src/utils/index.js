import NotesApp from "../apps/NotesApp";
import CalculatorApp from "../apps/CalculatorApp";
import FileManagerApp from "../apps/FileManagerApp";
import ImageViewer from "../apps/ImageViewer";
import Docs from "../apps/Docs";
import VideoPlayer from "../apps/VideoPlayer";

export const APP_CONFIG = {
  notes: {
    title: "Notes",
    component: NotesApp,
    width: 400,
    height: 300,
    icon: "fa-regular fa-note-sticky",
  },
  calculator: {
    title: "Calculator",
    component: CalculatorApp,
    width: 350,
    height: 450,
    icon: "fa-solid fa-calculator",
  },
  files: {
    title: "File Manager",
    component: FileManagerApp,
    width: 500,
    height: 400,
    icon: "fa-solid fa-folder",
  },
  media: {
    title: "Media Viewer",
    component: VideoPlayer,
    width: 800,
    height: 500,
    icon: "fa-solid fa-film",
  },
  image: {
    title: "Image Viewer",
    component: ImageViewer,
    width: 800,
    height: 500,
    icon: "fa-regular fa-image",
  },
  docs: {
    title: "Document Viewer",
    component: Docs,
    width: 800,
    height: 600,
    icon: "fa-regular fa-file",
  }
};
