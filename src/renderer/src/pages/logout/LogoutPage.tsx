import { LogoutIcon } from '@components/Icons';
import { ConfirmDialog } from '@components/ConfirmDialog';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../routes';
import './styles.css';

export function LogoutPage() {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <div className="logout-page">
      <span className="logout-page-icon">
        <LogoutIcon size={32} />
      </span>
      <h1 className="logout-page-title">Até logo!</h1>
      <p className="logout-page-message">
        O Meu Negócio é um aplicativo local — seus dados continuam salvos neste
        computador. Você pode voltar para o painel quando quiser.
      </p>
      <div className="logout-page-actions">
        <Link className="logout-page-link" to={ROUTES.DASHBOARD}>
          Voltar ao Dashboard
        </Link>
        <button
          className="logout-page-close-btn"
          onClick={() => setConfirmOpen(true)}
          type="button"
        >
          Fechar aplicativo
        </button>
      </div>
      <ConfirmDialog
        open={confirmOpen}
        title="Fechar aplicativo"
        confirmLabel="Fechar"
        danger
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => window.api.app.quit()}
      >
        Tem certeza que deseja fechar o Meu Negócio? Seus dados continuam
        salvos neste computador.
      </ConfirmDialog>
    </div>
  );
}
