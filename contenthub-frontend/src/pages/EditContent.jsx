import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditContent() {
  const API_URL = import.meta.env.VITE_API_URL;
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    body: "",
    status: "draft",
  });

  useEffect(() => {
    fetch(`${API_URL}/api/contents/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setForm({
          title: data.title || "",
          excerpt: data.excerpt || "",
          body: data.body || "",
          status: data.status || "draft",
        });
      })
      .catch((err) => console.error("Error loading content:", err));
  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/api/contents/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("Error updating content");
      }

      navigate("/", { state: { updated: true } });
    } catch (err) {
      console.error(err);
      alert("Error updating content");
    }
  };

  return (
    <div className="create-page">
      <h1>Edit Content</h1>

      <form onSubmit={handleSubmit} className="form">
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
        />

        <input
          name="excerpt"
          placeholder="Excerpt"
          value={form.excerpt}
          onChange={handleChange}
        />

        <textarea
          name="body"
          placeholder="Write your content..."
          value={form.body}
          onChange={handleChange}
        />

        <select name="status" value={form.status} onChange={handleChange}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>

        <button type="submit" className="primary-button">
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default EditContent;