import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">
      <h2>ContentHub</h2>
      <p className="sidebar-subtitle">Editorial Control</p>

      <nav className="sidebar-nav">
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/">Contents</NavLink>
        <NavLink to="/create">Create</NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;