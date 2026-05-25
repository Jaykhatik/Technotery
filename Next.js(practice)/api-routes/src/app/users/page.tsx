import { getUsersList } from "@/services/user";
import Link from "next/link";

export default async function UserPage() {
  const responseData = await getUsersList();
  const users = responseData.data;

  console.log(users);

  return (
    <div className="container">
      <header className="header">
        <div className="header-content">
          <h1>Users Directory</h1>
          <p>Manage and browse active registered profiles</p>
        </div>
        <Link href="/adduser" className="btn btn-primary">
          <span className="add-icon">+</span> Add User
        </Link>
      </header>

      <div className="grid">
        {users.map((u, index) => {
          const initials = u.userName
            ? u.userName.slice(0, 2).toUpperCase()
            : "US";
          return (
            <div className="card" key={`${u.userId}-${index}`}>
              <div className="user-info">
                <div className="avatar">{initials}</div>
                <div className="user-details">
                  <span className="user-name">{u.userName}</span>
                  <span className="user-id">ID: #{u.userId}</span>
                </div>
              </div>

              <Link href={`/users/${u.userId}`} className="btn">
                View Details
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
