export default function ResultCard({ doc }) {
  return (
    <article className="result-card">
      <header>
        <strong>{doc.title}</strong>
        <span className="meta">
          {doc.type} • {doc.date}
        </span>
      </header>
      <p className="snippet">{doc.snippet}</p>
      <details>
        <summary>Full excerpt</summary>
        <pre className="excerpt">{doc.excerpt}</pre>
      </details>
    </article>
  );
}
