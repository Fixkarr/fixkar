import React, { useState, useRef, useEffect } from "react";
import { FaMicrophone } from "react-icons/fa";

const VoiceRecorder = ({ onAudioReady }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      stopStream();
    };
  }, []);

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const startRecording = async () => {
    if (isRecording) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        clearInterval(timerRef.current);

        if (audioChunksRef.current.length === 0) {
          stopStream();
          setIsRecording(false);
          return;
        }

        const blob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });

        onAudioReady(blob);

        setRecordingTime(0);
        setIsRecording(false);
        stopStream();
      };

      mediaRecorder.start();
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (err) {
      console.log("Microphone permission denied : ", err);
      alert(`${err.name}\n${err.message}`)
    }
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current || !isRecording) return;

    mediaRecorderRef.current.stop();
  };

  return (
    <div className="d-flex align-items-center">
      {!isRecording ? (
        <button
        type="button"
          className="attach-btn btn btn-outline-primary rounded-circle"
          onClick={startRecording}
        >
          <FaMicrophone size={20}/>
        </button>
      ) : (
        <button
            type="button"
          className="btn btn-danger rounded-circle"
          onClick={stopRecording}
        >
          ⏹
        </button>
      )}

      {isRecording && (
        <small className="text-danger ms-2">
          Recording... {recordingTime}s
        </small>
      )}
    </div>
  );
};

export default VoiceRecorder;
