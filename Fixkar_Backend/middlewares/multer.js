import multer from "multer"

const storage = multer.memoryStorage();

// Keep request bodies bounded to reduce memory-exhaustion risk when using memoryStorage.
const upload = multer({
  storage,
  limits: {
    fileSize: 25 * 1024 * 1024,
    files: 5,
  },
});

export default upload;
