import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>Admin</h2>

      <nav>
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/users">Users</NavLink>
      </nav>
    </div>
  );
}

export default Sidebar;