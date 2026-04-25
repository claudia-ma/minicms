import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Toast from "../components/Toast";

function Dashboard() {
  const [contents, setContents] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [localToast, setLocalToast] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  const toastMessage =
    localToast ||
    (location.state?.created
      ? "Content created successfully"
      : location.state?.updated
      ? "Content updated successfully"
      : "");

  const totalContents = contents.length;

  const totalDrafts = contents.filter(
    (content) => content.status === "draft"
  ).length;

  const totalPublished = contents.filter(
    (content) => content.status === "published"
  ).length;

  const filteredContents = contents.filter((content) => {
    const matchesSearch =
      content.title.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || content.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/contents/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        throw new Error("Error deleting content");
      }

      setContents((prev) =>
        prev.filter((content) => content.id !== id)
      );

      setDeleteId(null);
      setLocalToast("Content created successfully");

      setTimeout(() => {
        setLocalToast("");
      }, 2500);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/contents?t=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => setContents(data))
      .catch((err) => console.error("Error loading contents:", err));
  }, []);

  return (
    <main className="dashboard">
      <Toast message={toastMessage} />

      <section className="dashboard-intro">
        <h3>All Content</h3>
        <p>Your latest entries, drafts and published pieces.</p>
      </section>

      <div className="stats-grid">
        <div className="stat-card">
          <h2>{totalContents}</h2>
          <p>Total Content</p>
        </div>

        <div className="stat-card">
          <h2>{totalDrafts}</h2>
          <p>Drafts</p>
        </div>

        <div className="stat-card">
          <h2>{totalPublished}</h2>
          <p>Published</p>
        </div>
      </div>

      <div className="filter-bar">
        <button
          className={statusFilter === "all" ? "active-filter" : ""}
          onClick={() => setStatusFilter("all")}
        >
          All
        </button>

        <button
          className={statusFilter === "draft" ? "active-filter" : ""}
          onClick={() => setStatusFilter("draft")}
        >
          Draft
        </button>

        <button
          className={statusFilter === "published" ? "active-filter" : ""}
          onClick={() => setStatusFilter("published")}
        >
          Published
        </button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search content..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <section className="content-grid">
        {filteredContents.length === 0 ? (
          <div className="empty-state">
            <h3>No content found</h3>
            <p>Try changing your filters or create a new entry.</p>
          </div>
        ) : (
          filteredContents.map((content) => (
            <div className="content-card" key={content.id}>
  <div className="card-header">
    <span className={`status-badge ${content.status}`}>

      <span className="status-dot"></span>

      {content.status}

    </span>

    <small>
      {new Date(content.created_at).toLocaleDateString()}
    </small>
  </div>

  <h3>{content.title}</h3>

  <p>{content.excerpt || "No excerpt available."}</p>

  <div className="content-meta">
    <span>
      {content.status}
    </span>
    
    <span>
      Updated today
    </span>

  </div>

  <div className="card-actions">
    <button onClick={() => navigate(`/edit/${content.id}`)}>
      Edit
    </button>

    <button onClick={() => setDeleteId(content.id)}>
      Delete
    </button>
  </div>

  {deleteId === content.id && (
    <div className="delete-confirm">
      <p>Delete this content?</p>

      <div className="delete-confirm-actions">
        <button
          className="confirm-delete"
          onClick={() => handleDelete(content.id)}
        >
          Yes, delete
        </button>

        <button
          className="cancel-delete"
          onClick={() => setDeleteId(null)}
        >
          Cancel
        </button>
      </div>
    </div>
  )}
</div>
          ))
        )}
      </section>
    </main>
  );
}

export default Dashboard;