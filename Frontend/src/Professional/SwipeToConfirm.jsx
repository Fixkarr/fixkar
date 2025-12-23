import { useRef, useState } from "react";

const SwipeToConfirm = ({ onConfirm, disabled }) => {
  const trackRef = useRef(null);
  const [dragX, setDragX] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = (clientX) => {
    if (confirmed || disabled) return;

    const rect = trackRef.current.getBoundingClientRect();
    let newX = clientX - rect.left - 23;

    if (newX < 0) newX = 0;
    if (newX > rect.width - 46) newX = rect.width - 46;

    setDragX(newX);

    if (newX > rect.width * 0.75) {
      setConfirmed(true);
      setIsDragging(false);
      onConfirm();
    }
  };

  return (
    <div className="w-100 mt-3">
      <p className="text-center fw-semibold text-muted mb-2">
        {confirmed
          ? "✔ You have reached the location"
          : "Swipe right to confirm arrival"}
      </p>

      <div
        ref={trackRef}
        className={`position-relative rounded-pill p-1 ${
          confirmed ? "bg-success-subtle" : "bg-light"
        }`}
        style={{ height: "56px" }}
        onMouseMove={(e) => isDragging && handleMove(e.clientX)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onTouchMove={(e) => handleMove(e.touches[0].clientX)}
        onTouchEnd={() => setIsDragging(false)}
      >
        <div
          className="position-absolute top-50 translate-middle-y rounded-circle 
                     d-flex align-items-center justify-content-center text-white"
          style={{
            width: "46px",
            height: "46px",
            left: "6px",
            transform: `translate(${dragX}px, -50%)`,
            backgroundColor: confirmed ? "#198754" : "#0d6efd",
            cursor: disabled ? "not-allowed" : "grab",
            transition: confirmed ? "all 0.3s ease" : "none",
            userSelect: "none",
          }}
          onMouseDown={() => !disabled && setIsDragging(true)}
          onTouchStart={() => !disabled && setIsDragging(true)}
        >
          ➜
        </div>

        <div className="h-100 d-flex align-items-center justify-content-center">
          <span className="fw-semibold text-secondary">
            {confirmed ? "Reached" : "Slide"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SwipeToConfirm;
