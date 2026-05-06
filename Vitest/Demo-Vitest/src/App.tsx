import axios from "axios";
import { useEffect, useState } from "react";
type User = {
  name: string;
};
export default function App({ name = "shivaji" }: { name?: string }) {
  const [count, setCount] = useState(0);
  const [data, setData] = useState<{ name: string } | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((data: User) => {
        // console.log(data)
        setUser(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load");
        setLoading(false);
      });
  }, []);
  const fetchuser = async () => {
    const res = await axios.get("https://jsonplaceholder.typicode.com/users/1");
    const userData: { name: string } = await res.data;
    setData(userData);
  };
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  return (
    <>
      <div>App</div>
      <h1>{name}</h1>
      <h2>{count}</h2>
      <button onClick={() => setCount(count + 1)}>Click me</button>
      <div className="fetch-api">
        <h1>Fetch API</h1>
        {data && <h2>{data.name}</h2>}
        <button onClick={fetchuser}>Fetch User</button>
      </div>
      <h1>Welcome {user?.name}</h1>
    </>
  );
}
