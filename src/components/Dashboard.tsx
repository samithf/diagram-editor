import { useAuth } from "../context/AuthContext";

export function Dashboard() {
  const { user, logout } = useAuth();

  if (!user) {
    return <p>You must be logged in to view this page.</p>;
  }

  return (
    <div>
      <h2>Welcome, {user.email}</h2>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
