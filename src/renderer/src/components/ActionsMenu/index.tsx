import {
  CheckIcon,
  DeleteIcon,
  EditIcon,
  OptionsIcon,
  ViewIcon,
} from '@components/Icons';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './styles.css';

interface ActionsMenuProps {
  onView?: () => void;
  onEdit?: () => void;
  onPayment?: () => void;
  onDelete?: () => void;
}

export function ActionsMenu({
  onView,
  onEdit,
  onPayment,
  onDelete,
}: ActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, right: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const updatePosition = () => {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (!rect) return;
      setPosition({
        top: rect.bottom + 4,
        right: window.innerWidth - rect.right,
      });
    };

    updatePosition();

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        dropdownRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [open]);

  return (
    <div className="actions-menu">
      <button
        ref={triggerRef}
        className="actions-menu-trigger"
        onClick={() => setOpen((prev) => !prev)}
        type="button"
        aria-label="Ações"
      >
        <OptionsIcon />
      </button>
      {open &&
        createPortal(
          <div
            className="actions-menu-dropdown"
            ref={dropdownRef}
            style={{ top: position.top, right: position.right }}
          >
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
            {onPayment && (
              <button
                className="actions-menu-item"
                onClick={() => {
                  onPayment();
                  setOpen(false);
                }}
                type="button"
              >
                <CheckIcon size={14} />
                Registrar pagamento
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
          </div>,
          document.body,
        )}
    </div>
  );
}
