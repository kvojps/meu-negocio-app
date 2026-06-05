import { useState } from "react";
import "./Styles.css";

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <aside className={`sidebar-container ${isOpen ? "is-open" : "is-closed"}`}>
      <button
        type="button"
        className="sidebar-toggle"
        onClick={() => setIsOpen((current) => !current)}
        aria-label={isOpen ? "Fechar sidebar" : "Abrir sidebar"}
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>
    </aside>
  );
}
