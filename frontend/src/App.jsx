import { useState } from "react";
import SearchBox from "./components/SearchBox";
import ResultCard from "./components/ResultCard";
import axios from "axios";

export default function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSearch(q) {
    setQuery(q);
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const resp = await axios.post(
        "http://localhost:8000/generate",
        { query: q },
        { timeout: 20000 }
      );
      setResults(resp.data);
    } catch (err) {
      console.error(err);
      if (err.response) {
        setError(
          `Server error: ${err.response.status} ${err.response.statusText}`
        );
      } else if (err.request) {
        setError("Network error: could not reach server");
      } else {
        setError("Unexpected error");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-root">
      <header className="header">
        <h1>Legal Assistant — Document Search</h1>
        <p className="subtitle">
          Search legal documents and get concise summaries.
        </p>
      </header>

      <main className="container">
        <SearchBox onSearch={handleSearch} disabled={loading} />

        {loading && (
          <div className="status">
            Searching… <span className="dot" />
          </div>
        )}

        {error && <div className="error">{error}</div>}

        {results && (
          <section className="results">
            <h2>Summary</h2>
            <div className="summary">{results.summary}</div>

            <h3>Matches</h3>
            {results.matches && results.matches.length > 0 ? (
              results.matches.map((m, i) => <ResultCard key={i} doc={m} />)
            ) : (
              <div className="empty">No matches found.</div>
            )}
          </section>
        )}

        <footer className="footer">
          <small>Mocked demo • Not a legal adviser</small>
        </footer>
      </main>
    </div>
  );
}
