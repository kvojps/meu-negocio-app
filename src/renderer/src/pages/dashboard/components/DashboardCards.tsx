import '../styles.css';

interface DashboardCardsProps {
  totalRevenue: number;
  currentMonthSales: number;
  avgTicket: number;
  pendingOrders: number;
  lowStockCount: number;
}

function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function DashboardCards({
  totalRevenue,
  currentMonthSales,
  avgTicket,
  pendingOrders,
  lowStockCount,
}: DashboardCardsProps) {
  const cards = [
    {
      label: 'Faturamento Total',
      value: formatBRL(totalRevenue),
      sub: `${currentMonthSales} venda${currentMonthSales !== 1 ? 's' : ''} no mês`,
      color: '#2cba7a',
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16 6l2.29 2.29-9.17 9.17-4.24-4.24 1.41-1.41 2.83 2.83 7.76-7.77L16 6zM3 12c0 4.97 4.03 9 9 9s9-4.03 9-9-4.03-9-9-9-9 4.03-9 9z"
            fill="currentColor"
          />
        </svg>
      ),
    },
    {
      label: 'Vendas no Mês',
      value: String(currentMonthSales),
      sub: 'pedidos concluídos',
      color: '#3b82f6',
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"
            fill="currentColor"
          />
        </svg>
      ),
    },
    {
      label: 'Ticket Médio',
      value: formatBRL(avgTicket),
      sub: 'por venda',
      color: '#8b5cf6',
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58s1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41s-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z"
            fill="currentColor"
          />
        </svg>
      ),
    },
    {
      label: 'Pedidos Pendentes',
      value: String(pendingOrders),
      sub:
        pendingOrders === 1
          ? 'aguardando processamento'
          : 'aguardando processamento',
      color: '#f59e0b',
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"
            fill="currentColor"
          />
        </svg>
      ),
    },
    {
      label: 'Estoque Baixo',
      value: String(lowStockCount),
      sub:
        lowStockCount === 1
          ? 'produto abaixo do mínimo'
          : 'produtos abaixo do mínimo',
      color: '#ef4444',
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2L1 21h22L12 2zm0 4l7.53 13H4.47L12 6zm-1 9h2v2h-2zm0-6h2v4h-2z"
            fill="currentColor"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="dashboard-cards">
      {cards.map((card) => (
        <div
          key={card.label}
          className="dashboard-card"
          style={{ '--card-accent': card.color } as React.CSSProperties}
        >
          <div className="dashboard-card-icon" style={{ color: card.color }}>
            {card.icon}
          </div>
          <div className="dashboard-card-value">{card.value}</div>
          <div className="dashboard-card-label">{card.label}</div>
          <div className="dashboard-card-sub">{card.sub}</div>
        </div>
      ))}
    </div>
  );
}
