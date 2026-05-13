import { useEffect, useState } from "react";
import type { FormDataType } from "./Types/types";
import api from "./Services/api";
import { saveOfflineForm } from "./Utils/storage";
import { syncOfflineForms } from "./Utils/sync";

function App() {
  const [formData, setFormData] = useState<FormDataType>({
    id: "",
    name: "",
    email: "",
  });

  const [status, setStatus] = useState<string>("");

  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  // Handle Input Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Submit Form
  const handleSubmit = async (): Promise<void> => {
    const dataToSend = {
      ...formData,
      id: Date.now().toString(),
    };

    try {
      await api.post("/posts", dataToSend);

      setStatus("Submitted Successfully");

      console.log("Online Submit Success");
    } catch (error) {
      saveOfflineForm(dataToSend);

      setStatus("Saved Offline");

      console.log("Offline Saved");
    }
  };

  // Network Status
  useEffect(() => {
    const goOnline = () => {
      setIsOnline(true);

      syncOfflineForms();
    };

    const goOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", goOnline);

    window.addEventListener("offline", goOffline);

    return () => {
      window.removeEventListener("online", goOnline);

      window.removeEventListener("offline", goOffline);
    };
  }, []);

  return (
    <div
      style={{
        padding: "20px",
      }}
    >
      <h1>React TS Offline Sync</h1>

      <h2>
        Status:
        {isOnline ? " Online" : " Offline"}
      </h2>

      <input
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
      />

      <br />
      <br />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
      />

      <br />
      <br />

      <button onClick={handleSubmit}>Submit</button>

      <h3>{status}</h3>
    </div>
  );
}

export default App;
