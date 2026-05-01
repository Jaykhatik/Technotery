import { createContext, useState, useContext } from 'react';
import translations from '../i18n';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const text = translations[language];
  const isRTL = language === 'ar';
  return (
    <LanguageContext.Provider value={{ language, setLanguage, text, isRTL }}>
      <div className={`app-container ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

export const useTranslation = (namespace) => {
  const { text } = useContext(LanguageContext);
  
  const t = (key) => {
    // Traverse based on namespace (e.g. "Login")
    if (namespace && text[namespace] && text[namespace][key]) {
      return text[namespace][key];
    }
    // Fallback if no namespace is provided or key is not in namespace
    if (text[key]) return text[key];
    
    return key;
  };

  return { t };
};
