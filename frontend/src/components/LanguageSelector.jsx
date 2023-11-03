import React from "react";
import { useTranslation } from "react-i18next";

function LanguageSelector() {
  const { i18n } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("selectedLang", lang);
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <button onClick={() => changeLanguage("en")}>EN</button>
      <button onClick={() => changeLanguage("fr")}>FR</button>
      <button onClick={() => changeLanguage("it")}>IT</button>
      <button onClick={() => changeLanguage("es")}>ES</button>
    </div>
  );
}

export default LanguageSelector;
