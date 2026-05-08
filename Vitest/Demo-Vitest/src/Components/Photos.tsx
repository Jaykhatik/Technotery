import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/components/Photos.css";

type Photo = {
  id: number;
  title: string;
};

export default function Photos() {
  const [photo, setPhoto] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/photos?_limit=10")
      .then((res) => {
        setPhoto(res.data);
        setLoading(false);
      })
      .catch(() => {
  setError(true);
  setLoading(false);
});
  }, []);

  if (loading) return <p>Loading...</p>; 
  if (error) return <p>Failed to load</p>;

  return (
    <div className="card photo-card">
      <div className="photo-meta">
        <p className="meta-label">JSONPlaceholder API</p>
        <h2>Photos Gallery</h2>
      </div>
      {photo.length > 0 ? (
        <ul className="photo-list">
          {photo.map((p) => (
            <li key={p.id} className="photo-item">
              <p className="photo-title">{p.title}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No Photos found</p>
      )}
    </div>
  );
}
