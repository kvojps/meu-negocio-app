import { useEffect, useRef, useState } from 'react';
import { DeleteIcon, EditIcon, OptionsIcon } from './Icons';

interface ActionsMenuProps {
  onEdit: () => void;
  onDelete: () => void;
}

export function ActionsMenu({ onEdit, onDelete }: ActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="actions-menu" ref={ref}>
      <button
        className="actions-menu-trigger"
        onClick={() => setOpen(!open)}
        type="button"
        aria-label="Ações"
      >
        <OptionsIcon />
      </button>
      {open && (
        <div className="actions-menu-dropdown">
          <button
            className="actions-menu-item"
            onClick={() => {
              onEdit();
              setOpen(false);
            }}
            type="button"
          >
            <EditIcon size={14} />
            Editar
          </button>
          <button
            className="actions-menu-item actions-menu-item--delete"
            onClick={() => {
              onDelete();
              setOpen(false);
            }}
            type="button"
          >
            <DeleteIcon size={14} />
            Excluir
          </button>
        </div>
      )}
    </div>
  );
}
