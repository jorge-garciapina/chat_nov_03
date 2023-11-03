import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Importing the individual translation files
import enTranslation from "./english/enTranslation.json";
import frTranslation from "./french/frTranslation.json";
import itTranslation from "./italian/itTranslation.json";
import esTranslation from "./spanish/esTranslation.json";

i18n
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    resources: {
      en: { translation: enTranslation },
      fr: { translation: frTranslation },
      it: { translation: itTranslation },
      es: { translation: esTranslation },
    },
    lng: "en", // Default language
    fallbackLng: "en", // Use 'en' if the desired language is not available

    interpolation: {
      escapeValue: false, // React already safes from XSS
    },

    react: {
      useSuspense: false, // Set this to true if your app uses Suspense components
    },
  });

export default i18n;
