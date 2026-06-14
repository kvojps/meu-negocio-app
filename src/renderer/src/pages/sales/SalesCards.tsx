import { useMemo } from 'react';
import './sales-cards.css';
import type { Order } from '../../../../shared/types/order';
import { getOrderTotal } from '../../../../shared/types/order';

interface SalesCardsProps {
  completedOrders: Order[];
}

function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

function getTodayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getMostSoldProduct(orders: Order[]): string {
  const map = new Map<string, number>();
  for (const order of orders) {
    for (const item of order.items) {
      map.set(
        item.productName,
        (map.get(item.productName) ?? 0) + item.quantity,
      );
    }
  }
  let best = '';
  let bestQty = 0;
  for (const [name, qty] of map) {
    if (qty > bestQty) {
      bestQty = qty;
      best = name;
    }
  }
  return best;
}

export function SalesCards({ completedOrders }: SalesCardsProps) {
  const cards = useMemo(() => {
    const totalRevenue = completedOrders.reduce(
      (sum, o) => sum + getOrderTotal(o),
      0,
    );
    const totalSales = completedOrders.length;
    const avgTicket = totalSales > 0 ? totalRevenue / totalSales : 0;
    const today = getTodayISO();
    const todaySales = completedOrders.filter(
      (o) => o.createdAt.slice(0, 10) === today,
    ).length;
    const topProduct = getMostSoldProduct(completedOrders);

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
      {
        label: 'Vendas Hoje',
        value: String(todaySales),
        sub: todaySales === 1 ? 'venda hoje' : 'vendas hoje',
        icon: (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"
              fill="currentColor"
            />
          </svg>
        ),
        color: '#8b5cf6',
      },
      {
        label: 'Produto Mais Vendido',
        value: topProduct || '—',
        sub: topProduct ? 'em quantidade' : 'nenhuma venda',
        icon: (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17.21 9l-4.38-6.56c-.19-.28-.51-.44-.83-.44s-.64.16-.83.44L6.79 9H2c-.55 0-1 .45-1 1 0 .09.01.18.04.27l2.54 9.27c.23.84 1 1.46 1.92 1.46h13c.92 0 1.69-.62 1.93-1.46l2.54-9.27L23 10c0-.55-.45-1-1-1h-4.79zM9 9l3-4.5L15 9H9zm3 10c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"
              fill="currentColor"
            />
          </svg>
        ),
        color: '#ef4444',
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
