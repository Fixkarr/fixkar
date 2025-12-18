import multer from "multer";

const multerErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {

    // file size error
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "File size too large. Max allowed size is 5MB",
      });
    }

    return res.status(400).json({
      message: err.message,
    });
  }

  // unknown error
  if (err) {
    return res.status(500).json({
      message: "File upload failed",
    });
  }

  next();
};

export default multerErrorHandler;
