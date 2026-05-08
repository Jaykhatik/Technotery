import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppRoutes from "./Routes/Approutes";

export default function App() {
  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <AppRoutes />
    </Router>
  );
}
