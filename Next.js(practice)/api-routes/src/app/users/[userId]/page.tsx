import { getUserById } from "@/services/userService";
import Link from "next/link";
import UserDetailCard from "@/components/UserDetailCard";
import { PageProps } from "@/types";

export default async function UserDetailPage({ params }: PageProps) {
  const { userId } = await params;
  const users = await getUserById(userId);

  if (!users || users.length === 0) {
    return (
      <div className="detail-container">
        <Link href="/users" className="btn btn-back">
          ← Back to Directory
        </Link>
        <div className="error-card">
          <h2>User Not Found</h2>
          <p>No user profile matches the ID #{userId}.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="detail-container">
      <Link href="/users" className="btn btn-back">
        ← Back to Directory
      </Link>

      <div className="detail-header">
        <h1>User Profile Details</h1>
      </div>

      <div className="detail-grid">
        {users.map((u, index) => (
          <UserDetailCard initialUser={u} key={`${u.userId}-${index}`} />
        ))}
      </div>
    </div>
  );
}

