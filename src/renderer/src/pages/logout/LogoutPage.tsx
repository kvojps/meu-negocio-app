import { LogoutIcon } from '@components/Icons';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../routes';
import './styles.css';

export function LogoutPage() {
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
      <Link className="logout-page-link" to={ROUTES.DASHBOARD}>
        Voltar ao Dashboard
      </Link>
    </div>
  );
}
