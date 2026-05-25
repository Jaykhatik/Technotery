import { getAllUsers } from "@/services/userService";
import Link from "next/link";
import UserCard from "@/components/UserCard";

export default async function UserPage() {
  const responseData = await getAllUsers();
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
        {users.map((u, index) => (
          <UserCard user={u} key={`${u.userId}-${index}`} />
        ))}
      </div>
    </div>
  );
}

