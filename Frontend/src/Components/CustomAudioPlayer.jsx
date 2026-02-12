import React, { useRef, useState, useEffect } from "react";

const CustomAudioPlayer = ({ src, isMine= false }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;

    const updateProgress = () => {
      const percent =
        (audio.currentTime / audio.duration) * 100;
      setProgress(percent || 0);
    };

    const setAudioData = () => {
      setDuration(audio.duration);
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", setAudioData);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", setAudioData);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }

    setIsPlaying(!isPlaying);
  };

  const formatTime = (time) => {
    if (!time) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div
      className={`d-flex align-items-center gap-2 px-2 py-2 rounded-pill ${
        isMine ? "bg-light text-dark" : "bg-secondary text-white"
      }`}
      style={{ maxWidth: 220 }}
    >
      <button
        onClick={togglePlay}
        className="btn btn-sm btn-primary rounded-circle"
        style={{ width: 32, height: 32 }}
      >
        {isPlaying ? "❚❚" : "▶"}
      </button>

      <div style={{ flex: 1 }}>
        <div
          style={{
            height: 4,
            background: "#ddd",
            borderRadius: 5,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              background: "#0d6efd",
            }}
          />
        </div>

        <small style={{ fontSize: 11 }}>
          {formatTime(audioRef.current?.currentTime)} /{" "}
          {formatTime(duration)}
        </small>
      </div>

      <audio ref={audioRef} src={src} />
    </div>
  );
};

export default CustomAudioPlayer;
