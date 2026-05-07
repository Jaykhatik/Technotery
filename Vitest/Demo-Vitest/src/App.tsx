import { ThemeProvider } from "./context/ThemeProvider";
import { CounterComponent } from "./redux/Features/counter/Counter";
import Photos from "./Components/Photos";
import { ThemeComponent } from "./Components/ThemeCompo";

export default function App() {
  return (
     <main className="app">
      <header className="app__hero">
        <p className="app__eyebrow">Vitest & React demo</p>
        <h1>Modern Dashboard</h1>
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
