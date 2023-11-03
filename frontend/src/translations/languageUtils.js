import i18n from "i18next";

export function initializeLanguage() {
  const storedLang = localStorage.getItem("selectedLang");
  if (storedLang) {
    i18n.changeLanguage(storedLang);
  } else {
    localStorage.setItem("selectedLang", "en"); // Default to English if not set
  }
}
