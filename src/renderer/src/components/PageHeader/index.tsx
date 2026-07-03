import './styles.css';

interface PageHeaderProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function PageHeader({
  icon,
  title,
  subtitle,
  actions,
}: PageHeaderProps) {
  return (
    <div className="page-header">
      <div className="page-header-main">
        <span className="page-header-icon">{icon}</span>
        <div className="page-header-text">
          <h1 className="page-header-title">{title}</h1>
          {subtitle && <p className="page-header-subtitle">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="page-header-actions">{actions}</div>}
    </div>
  );
}
