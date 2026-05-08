import { useTheme } from "../context/ThemeContext";
import "../styles/components/Theme.css";


export function ThemeComponent() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="card theme-compo">
      <p className="app__eyebrow">Context API</p>
      <h2>Theme Switcher</h2>
      <p className="theme-status">Current: <span>{theme}</span></p>
      <button className="btn--primary" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        Toggle Theme
      </button>
    </div>
  );
}
