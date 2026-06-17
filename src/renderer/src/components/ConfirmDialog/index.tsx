import { Modal } from '@components/Modal';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  children: React.ReactNode;
}

export function ConfirmDialog({
  open,
  title,
  onConfirm,
  onCancel,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  danger = false,
  children,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      footer={
        <>
          <button
            className="modal-btn modal-btn--cancel"
            onClick={onCancel}
            type="button"
          >
            {cancelLabel}
          </button>
          <button
            className={`modal-btn ${danger ? 'modal-btn--danger' : 'modal-btn--confirm'}`}
            onClick={onConfirm}
            type="button"
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: 1.6 }}>
        {children}
      </p>
    </Modal>
  );
}
