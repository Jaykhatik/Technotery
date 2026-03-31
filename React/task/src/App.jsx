import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import User from "./pages/User";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/users" element={<User />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;