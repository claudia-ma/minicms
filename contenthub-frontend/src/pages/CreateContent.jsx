import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateContent() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    body: "",
    status: "draft",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch(`${API_URL}/api/contents`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    console.log("Respuesta backend:", data);

    if (!res.ok) {
      throw new Error(data.message || "Error creando contenido");
    }

    navigate("/", { state: { created: true } });
  } catch (err) {
    console.error("Create error:", err);
    alert(err.message);
  }
};

  return (
    <div className="create-page">
      <h1>Create Content</h1>

      <form onSubmit={handleSubmit} className="form">
        <input name="title" placeholder="Title" onChange={handleChange} />
        <input name="excerpt" placeholder="Excerpt" onChange={handleChange} />
        <textarea name="body" placeholder="Write your content..." onChange={handleChange} />
        <select name="status" onChange={handleChange}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>

        <button type="submit" className="primary-button">Publish</button>
      </form>
    </div>
  );
}

export default CreateContent;