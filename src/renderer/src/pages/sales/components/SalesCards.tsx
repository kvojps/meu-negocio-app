import type { Order } from '@shared/types/order';
import { getOrderProfit, getOrderTotal } from '@shared/types/order';
import { useMemo } from 'react';
import '../styles.css';

interface SalesCardsProps {
  completedOrders: Order[];
}

function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function SalesCards({ completedOrders }: SalesCardsProps) {
  const cards = useMemo(() => {
    const totalRevenue = completedOrders.reduce(
      (sum, o) => sum + getOrderTotal(o),
      0,
    );
    const totalProfit = completedOrders.reduce(
      (sum, o) => sum + getOrderProfit(o),
      0,
    );
    const totalSales = completedOrders.length;
    const avgTicket = totalSales > 0 ? totalRevenue / totalSales : 0;

    return [
      {
        label: 'Total Vendido',
        value: formatBRL(totalRevenue),
        sub: `${totalSales} venda${totalSales !== 1 ? 's' : ''}`,
        icon: (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
              fill="currentColor"
            />
            <path
              d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"
              fill="currentColor"
              opacity="0.4"
            />
            <circle cx="12" cy="12" r="2" fill="currentColor" />
          </svg>
        ),
        color: '#2cba7a',
      },
      {
        label: 'Lucro Total',
        value: formatBRL(totalProfit),
        sub:
          totalRevenue > 0
            ? `${((totalProfit / totalRevenue) * 100).toFixed(1)}% de margem`
            : 'sem vendas',
        icon: (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1.5 15.5l-4-4 1.41-1.41 2.59 2.58 6.09-6.09 1.41 1.42-7.5 7.5z"
              fill="currentColor"
            />
          </svg>
        ),
        color: '#06b6d4',
      },
      {
        label: 'Quantidade de Vendas',
        value: String(totalSales),
        sub: 'pedidos concluídos',
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
        color: '#3b82f6',
      },
      {
        label: 'Ticket Médio',
        value: formatBRL(avgTicket),
        sub: 'por venda',
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
        color: '#f59e0b',
      },
    ];
  }, [completedOrders]);

  return (
    <div className="sales-cards">
      {cards.map((card) => (
        <div
          key={card.label}
          className="sales-card"
          style={{ '--card-accent': card.color } as React.CSSProperties}
        >
          <div className="sales-card-icon" style={{ color: card.color }}>
            {card.icon}
          </div>
          <div className="sales-card-value">{card.value}</div>
          <div className="sales-card-label">{card.label}</div>
          <div className="sales-card-sub">{card.sub}</div>
        </div>
      ))}
    </div>
  );
}
