import { DeleteIcon, EditIcon, OptionsIcon, ViewIcon } from '@components/Icons';
import { useEffect, useRef, useState } from 'react';
import './styles.css';

interface ActionsMenuProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ActionsMenu({ onView, onEdit, onDelete }: ActionsMenuProps) {
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
          {onView && (
            <button
              className="actions-menu-item"
              onClick={() => {
                onView();
                setOpen(false);
              }}
              type="button"
            >
              <ViewIcon size={14} />
              Ver
            </button>
          )}
          {onEdit && (
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
          )}
          {onDelete && (
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
          )}
        </div>
      )}
    </div>
  );
}
