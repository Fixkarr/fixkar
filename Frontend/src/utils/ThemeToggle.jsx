import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

const ThemeToggle = () => {
  const [invert, setInvert] = useState(
    localStorage.getItem("invert") === "true"
  );

  useEffect(() => {
    if (invert) {
      document.body.classList.add("invert-mode");
      localStorage.setItem("invert", "true");
    } else {
      document.body.classList.remove("invert-mode");
      localStorage.setItem("invert", "false");
    }
  }, [invert]);

  return (
    <button
      className="btn btn-primary rounded-circle shadow-lg"
      style={{
        width: "50px",
        height: "50px",
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: 9999
      }}
      onClick={() => setInvert(!invert)}
    >
      {invert ? <FaSun /> : <FaMoon />}
    </button>
  );
};

export default ThemeToggle;