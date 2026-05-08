import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeProvider } from "../context/ThemeProvider";
import { CounterComponent } from "../redux/Features/counter/Counter";
import Photos from "../Components/Photos";
import { ThemeComponent } from "../Components/ThemeCompo";
import "../styles/pages/Home.css";

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <main className="app">
      <header className="app__hero">
        <nav className="nav-class">
          <button onClick={handleLogout} className="logout-btn" >
            Logout
          </button>
        </nav>
        <p className="app__eyebrow">Vitest & React demo</p>
        {/* <h1>Modern Dashboard</h1> */}
      </header>
      <section className="app__grid">
        <Photos />
        <ThemeProvider>
          <ThemeComponent />
        </ThemeProvider>
        <CounterComponent />
      </section>
    </main>
  );
}
