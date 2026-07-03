import { Link } from 'react-router-dom';
import { ROUTES } from '../../routes';
import './styles.css';

export function NotFoundPage() {
  return (
    <div className="not-found-page">
      <span className="not-found-code">404</span>
      <h1 className="not-found-title">Página não encontrada</h1>
      <p className="not-found-message">
        O endereço acessado não existe ou foi movido.
      </p>
      <Link className="not-found-link" to={ROUTES.DASHBOARD}>
        Voltar para o Dashboard
      </Link>
    </div>
  );
}
