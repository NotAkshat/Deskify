export const mockFileSystem = {
  name: "root",
  type: "folder",
  children: [
    {
      name: "Documents",
      type: "folder",
      children: [
        {
          name: "notes.txt",
          type: "file",
          extension: "txt",
          url: "/demofiles/notes.txt"
        },
        {
          name: "manual.pdf",
          type: "file",
          extension: "pdf",
          url: "/demofiles/manual.pdf",
        },
      ],
    },
    {
      name: "Pictures",
      type: "folder",
      children: [
        {
          name: "demo.jpg",
          type: "file",
          extension: "jpg",
          url: "/demofiles/demo.jpg"
        }
      ]
    },
    {
      name: "Videos",
      type: "folder",
      children: [
        {
          name: "demo.mp4",
          type: "file",
          extension: "mp4",
          url: "/demofiles/demo.mp4"
        }
      ]
    },
  ],
};    
