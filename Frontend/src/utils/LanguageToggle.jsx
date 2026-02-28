import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaGlobe } from "react-icons/fa";

const LanguageToggle = () => {
  const { i18n } = useTranslation();
  const [lang, setLang] = useState(
    localStorage.getItem("lang") || "en"
  );

  useEffect(() => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  }, [lang, i18n]);

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
      onClick={() =>
        setLang(lang === "en" ? "hi" : "en")
      }
    >
      <FaGlobe />
    </button>
  );
};

export default LanguageToggle;