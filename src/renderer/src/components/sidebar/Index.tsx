import { useState } from 'react';
import './Styles.css';

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <aside
      className={`sidebar-container ${isOpen ? 'is-open' : 'is-closed'}`}
    ></aside>
  );
}
