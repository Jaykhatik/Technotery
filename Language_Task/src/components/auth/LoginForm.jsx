import { useTranslation } from '../../context/LanguageContext';

export default function LoginForm() {
  const { t } = useTranslation("Login");

  return (
    <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
      <div className="form-group">
        <label htmlFor="login-email">{t("emailLabel")}</label>
        <input 
          type="email" 
          id="login-email" 
          placeholder={t("emailPlaceholder")} 
          required 
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="login-password">{t("passwordLabel")}</label>
        <input 
          type="password" 
          id="login-password" 
          placeholder={t("passwordPlaceholder")} 
          required 
        />
      </div>

      <div className="form-options">
        <label className="checkbox-label">
          <input type="checkbox" />
          <span>{t("rememberMe")}</span>
        </label>
        <a href="#" className="forgot-link">{t("forgotPassword")}</a>
      </div>

      <button type="submit" className="primary-btn">
        {t("loginBtn")}
      </button>
    </form>
  );
}
