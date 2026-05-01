import { Outlet, NavLink } from 'react-router-dom';
import { useTranslation } from '../../context/LanguageContext';
import TopBar from './TopBar';

export default function AuthLayout() {
  const { t } = useTranslation("Login");

  return (
    <>
      <TopBar />
      <main className="main-content">
        <div className="layout-card">
          {/* Info Side */}
          <div className="info-side">
            <div className="info-content">
              <h2>{t("infoTitle")}</h2>
              <p>{t("infoSubtitle")}</p>
              <ul className="info-features">
                <li>{t("infoFeature1")}</li>
                <li>{t("infoFeature2")}</li>
                <li>{t("infoFeature3")}</li>
              </ul>
            </div>
            <div className="deco-circle"></div>
          </div>

          {/* Auth Side */}
          <div className="auth-side">
            <div className="auth-card">
              {/* Routing Tabs */}
              <div className="tabs">
                <NavLink 
                  to="/login" 
                  className={({ isActive }) => `tab ${isActive ? 'active' : ''}`}
                >
                  {t("loginTab")}
                </NavLink>
                <NavLink 
                  to="/signup" 
                  className={({ isActive }) => `tab ${isActive ? 'active' : ''}`}
                >
                  {t("signupTab")}
                </NavLink>
              </div>

              {/* Render either Login or Signup depending on the route */}
              <div className="form-container">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
