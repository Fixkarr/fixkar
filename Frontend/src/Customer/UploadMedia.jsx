import React, { useState } from "react";
import axios from "axios";
import { IoCloudUploadOutline } from "react-icons/io5";
import { ClipLoader } from "react-spinners";
import { server_url } from "../App";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setCurrentUserData } from "../redux/user.slice";
import { useRef } from "react";

const UploadMedia = () => {
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef= useRef(null)

  // 1️⃣ File select + preview
  const handleSelect = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setError("");
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
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
         const res =  await axios.post(`${server_url}/api/user/upload-media`,  {
        mediaUrl: response.secure_url,
        mediaType: response.resource_type,
        publicId: response.public_id,
      }, {withCredentials : true})
          dispatch(setCurrentUserData(res.data));
          toast.success("Media uploaded!")
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

  return (
    <div className="card border-0 shadow-sm rounded-4 p-4">

      {/* Upload Button */}
      <label
        htmlFor="media"
        className="btn btn-primary rounded-pill px-4 d-inline-flex align-items-center gap-2"
      >
        {uploading ? (
          <>
            <ClipLoader size={16} color="#fff" />
            Uploading...
          </>
        ) : (
          <>
            <IoCloudUploadOutline size={18} />
            Select Media
          </>
        )}

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

      {/* Preview */}
      {preview && (
        <div className="mt-4 text-center">
          <div className="ratio ratio-1x1 rounded-4 overflow-hidden shadow-sm">
            {file.type.startsWith("image") ? (
              <img
                src={preview}
                alt="preview"
                className="w-100 h-100 object-fit-cover"
              />
            ) : (
              <video
                src={preview}
                controls
                className="w-100 h-100 object-fit-cover"
              />
            )}
          </div>

          <button
            className="btn btn-success rounded-pill px-4 mt-3"
            onClick={handleUpload}
            disabled={uploading}
          >
            Upload
          </button>
        </div>
      )}

      {/* Progress */}
      {uploading && (
        <div className="progress mt-4">
          <div
            className="progress-bar progress-bar-striped progress-bar-animated"
            style={{ width: `${progress}%` }}
          >
            {progress}%
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="alert alert-danger mt-4 rounded-3">
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
};

export default UploadMedia;
