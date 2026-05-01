import { useLanguage, useTranslation } from '../../context/LanguageContext';

export default function TopBar() {
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation("Login");

  return (
    <header className="top-bar">
      <div className="logo">{t("logoText")}</div>
      <div className="lang-switcher">
        <button 
          className={language === 'en' ? 'active' : ''} 
          onClick={() => setLanguage('en')}
        >
          {t("langEnglish")}
        </button>
        <button 
          className={language === 'ar' ? 'active' : ''} 
          onClick={() => setLanguage('ar')}
        >
          {t("langArabic")}
        </button>
      </div>
    </header>
  );
}
