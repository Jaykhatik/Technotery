import { getUserDetail } from "@/services/user";
import Link from "next/link";

interface PageProps {
  params: Promise<{ userId: string }>;
}

export default async function UserDetailPage({ params }: PageProps) {
  const { userId } = await params;
  const users = await getUserDetail(userId);

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
        {users.map((u, index) => {
          const initials = u.userName
            ? u.userName.slice(0, 2).toUpperCase()
            : "US";
          return (
            <div className="detail-card" key={`${u.userId}-${index}`}>
              <div className="profile-section">
                <div className="avatar-large">{initials}</div>
                <div className="user-details">
                  <span className="user-name">{u.userName}</span>
                  <span className="user-id">Profile ID: #{u.userId}</span>
                </div>
              </div>

              <div className="info-grid">
                <div className="meta-item">
                  <span className="meta-label">Email Address</span>
                  <span className="meta-value">{u.email}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Age</span>
                  <span className="meta-value">{u.age} years old</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Current City</span>
                  <span className="meta-value">{u.city}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
