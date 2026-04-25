function ContentCard({ content }) {
  return (
    <article className="content-card">
      <div className="card-top">
        <span className={`status-badge ${content.status}`}>
          {content.status}
        </span>
      </div>

      <h3>{content.title}</h3>
      <p>{content.excerpt || 'No excerpt available.'}</p>

      <div className="card-footer">
        <small>
          {content.published_at
            ? new Date(content.published_at).toLocaleDateString()
            : 'Not published'}
        </small>

        <div className="card-actions">
          <button>Edit</button>
          <button>Delete</button>
        </div>
      </div>
    </article>
  );
}

export default ContentCard;