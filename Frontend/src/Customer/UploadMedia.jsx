import React, { useRef, useState } from "react";
import axios from "axios";
import {
  IoClose,
  IoCloudUploadOutline,
  IoImageOutline,
  IoPlayCircleOutline,
} from "react-icons/io5";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaFileVideo,
  FaCloudUploadAlt,
} from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import { server_url } from "../App";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setCurrentUserData } from "../redux/user.slice";

const UploadMedia = () => {
  const dispatch = useDispatch();

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef(null);

  // handle leave
  const handleLeave = () => {
    setPreview(null);
    setFile(null);
    setUploading(false);
    setError("");
    setProgress(0);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // 1️⃣ File select + preview
  const handleSelect = (e) => {
    const selected = e.target.files[0];

    if (!selected) return;

    setError("");
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setProgress(0);
  };

  // 2️⃣ Get signature from backend
  const getSignature = async () => {
    const res = await axios.get(`${server_url}/api/user/signature`);
    return res.data;
  };

  // 3️⃣ Upload (SIGNED, REST, XHR)
  const handleUpload = async () => {
    if (!file) return;

    try {
      setUploading(true);
      setProgress(0);
      setError("");

      const { signature, timestamp, cloudName, apiKey, folder } =
        await getSignature();

      const xhr = new XMLHttpRequest();
      const formData = new FormData();

      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);
      formData.append("folder", folder);
      formData.append("resource_type", "auto");

      // progress
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          setProgress(percent);
        }
      };

      // success
      xhr.onload = async () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);

          const res = await axios.post(
            `${server_url}/api/user/upload-media`,
            {
              mediaUrl: response.secure_url,
              mediaType: response.resource_type,
              publicId: response.public_id,
            },
            { withCredentials: true }
          );

          dispatch(setCurrentUserData(res.data));

          toast.success("Media uploaded!");

          setPreview(null);
          setFile(null);
          setProgress(0);

          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }

          setUploading(false);
        } else {
          setError("Upload failed: Server rejected the file.");
          setUploading(false);
        }
      };

      // network / CORS / connection error
      xhr.onerror = () => {
        setError(
          "Upload failed due to network / CORS / connection issue. Try smaller file or different network."
        );
        setUploading(false);
      };

      xhr.open(
        "POST",
        `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`
      );

      xhr.send(formData);
    } catch (err) {
      console.error(err);
      setError("Upload failed: Could not get upload signature.");
      setUploading(false);
    }
  };

  const isImage = file?.type?.startsWith("image");
  const isVideo = file?.type?.startsWith("video");

  return (
    <div className="w-100">
      {/* ================= UPLOAD CARD ================= */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="card-body p-3 p-md-4">
          {/* Heading */}
          <div className="d-flex align-items-start gap-3 mb-3">
            <div
              className="bg-primary bg-opacity-10 text-primary rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
              style={{
                width: "46px",
                height: "46px",
              }}
            >
              <FaCloudUploadAlt size={21} />
            </div>

            <div>
              <h6 className="fw-bold text-dark mb-1">
                Add to your gallery
              </h6>

              <p className="text-muted small mb-0">
                Upload photos or videos of your completed work.
              </p>
            </div>
          </div>

          {/* ================= SELECT BUTTON ================= */}
          {!preview && (
            <>
              <label
                htmlFor="media"
                className="border rounded-4 p-4 p-md-5 w-100 text-center d-flex flex-column align-items-center justify-content-center"
                style={{
                  cursor: uploading ? "not-allowed" : "pointer",
                  borderStyle: "dashed",
                  background: "#f8faff",
                  minHeight: "180px",
                }}
              >
                <div
                  className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center mb-3"
                  style={{
                    width: "58px",
                    height: "58px",
                  }}
                >
                  <IoCloudUploadOutline size={28} />
                </div>

                <h6 className="fw-bold mb-1">
                  Choose photos or videos
                </h6>

                <small className="text-muted mb-3">
                  Tap here to select media from your device
                </small>

                <span className="btn btn-primary rounded-pill px-4 d-inline-flex align-items-center gap-2">
                  <IoCloudUploadOutline size={18} />
                  {uploading ? "Uploading..." : "Select Media"}
                </span>

                <small className="text-muted mt-3">
                  Images & videos supported
                </small>

                <input
                  type="file"
                  hidden
                  id="media"
                  accept="image/*,video/*"
                  onChange={handleSelect}
                  disabled={uploading}
                  ref={fileInputRef}
                />
              </label>
            </>
          )}

          {/* ================= PREVIEW ================= */}
          {preview && (
            <div className="mt-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div>
                  <h6 className="fw-bold mb-1">Preview</h6>

                  <small className="text-muted">
                    Review your media before uploading
                  </small>
                </div>

                <button
                  type="button"
                  className="btn btn-light border rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: "38px",
                    height: "38px",
                  }}
                  onClick={handleLeave}
                  disabled={uploading}
                  aria-label="Remove selected media"
                >
                  <IoClose size={20} />
                </button>
              </div>

              <div
                className="position-relative rounded-4 overflow-hidden bg-dark"
                style={{
                  maxHeight: "420px",
                }}
              >
                {isImage ? (
                  <img
                    src={preview}
                    alt="preview"
                    className="w-100"
                    style={{
                      maxHeight: "420px",
                      objectFit: "contain",
                      display: "block",
                    }}
                  />
                ) : (
                  <video
                    src={preview}
                    controls
                    className="w-100"
                    style={{
                      maxHeight: "420px",
                      objectFit: "contain",
                      display: "block",
                    }}
                  />
                )}

                {/* Media Type Badge */}
                <div
                  className="position-absolute top-0 start-0 m-3 badge bg-dark bg-opacity-75 rounded-pill px-3 py-2 d-flex align-items-center gap-2"
                >
                  {isImage ? (
                    <>
                      <IoImageOutline />
                      Image
                    </>
                  ) : (
                    <>
                      <FaFileVideo />
                      Video
                    </>
                  )}
                </div>
              </div>

              {/* File Information */}
              <div className="bg-light rounded-3 p-3 mt-3">
                <div className="d-flex align-items-center gap-2">
                  <FaCheckCircle className="text-success" />

                  <div className="flex-grow-1 overflow-hidden">
                    <div className="fw-semibold text-dark text-truncate">
                      {file?.name}
                    </div>

                    <small className="text-muted">
                      {(file?.size / (1024 * 1024)).toFixed(2)} MB
                    </small>
                  </div>
                </div>
              </div>

              {/* Upload Button */}
              <button
                type="button"
                className="btn btn-primary btn-lg rounded-3 w-100 mt-3 fw-semibold d-flex align-items-center justify-content-center gap-2"
                onClick={handleUpload}
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <ClipLoader size={18} color="#fff" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <IoCloudUploadOutline size={21} />
                    Upload to Gallery
                  </>
                )}
              </button>
            </div>
          )}

          {/* ================= PROGRESS ================= */}
          {uploading && (
            <div className="mt-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <small className="fw-semibold text-dark">
                  Uploading your media
                </small>

                <small className="fw-bold text-primary">
                  {progress}%
                </small>
              </div>

              <div
                className="progress rounded-pill"
                style={{
                  height: "8px",
                  backgroundColor: "#e9ecef",
                }}
              >
                <div
                  className="progress-bar progress-bar-striped progress-bar-animated rounded-pill"
                  role="progressbar"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>

              <small className="text-muted d-block mt-2">
                Please don't close this window while your file is uploading.
              </small>
            </div>
          )}

          {/* ================= ERROR ================= */}
          {error && (
            <div className="alert alert-danger border-0 rounded-3 mt-4 mb-0 d-flex align-items-start gap-2">
              <FaExclamationCircle className="mt-1 flex-shrink-0" />

              <div>
                <div className="fw-semibold mb-1">
                  Upload failed
                </div>

                <small>{error}</small>
              </div>

              <button
                type="button"
                className="btn-close ms-auto"
                onClick={() => setError("")}
                aria-label="Close"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadMedia;