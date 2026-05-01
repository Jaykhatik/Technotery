import { useTranslation } from '../../context/LanguageContext';

export default function SignupForm() {
  const { t } = useTranslation("Login");

  return (
    <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
      <div className="form-group">
        <label htmlFor="signup-name">{t("fullNameLabel")}</label>
        <input 
          type="text" 
          id="signup-name" 
          placeholder={t("fullNamePlaceholder")} 
          required 
        />
      </div>

      <div className="form-group">
        <label htmlFor="signup-email">{t("emailLabel")}</label>
        <input 
          type="email" 
          id="signup-email" 
          placeholder={t("emailPlaceholder")} 
          required 
        />
      </div>

      <div className="form-group">
        <label htmlFor="signup-password">{t("passwordLabel")}</label>
        <input 
          type="password" 
          id="signup-password" 
          placeholder={t("passwordPlaceholder")} 
          required 
        />
      </div>

      <div className="form-group">
        <label htmlFor="signup-confirm">{t("confirmPasswordLabel")}</label>
        <input 
          type="password" 
          id="signup-confirm" 
          placeholder={t("confirmPasswordPlaceholder")} 
          required 
        />
      </div>

      <button type="submit" className="primary-btn">
        {t("signupBtn")}
      </button>
    </form>
  );
}
