import { useState } from "react";

export default function SearchBox({ onSearch, disabled }) {
  const [value, setValue] = useState("");

  function submit(e) {
    e.preventDefault();
    if (!value.trim()) return;
    onSearch(value.trim());
  }

  return (
    <form className="searchbox" onSubmit={submit}>
      <input
        className="search-input"
        placeholder="Ask: e.g. 'breach of contract summary for clause 5'"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled}
        aria-label="search"
      />
      <button className="search-btn" disabled={disabled}>
        Search
      </button>
    </form>
  );
}
