import { useMemo } from 'react';
import './styles.css';
import { getOrderTotal } from '../../../../shared/types/order';
import { useOrders } from '../../hooks/orders/useOrders';
import { useProducts } from '../../hooks/products/useProducts';
import { DashboardCards } from './DashboardCards';

function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(dateStr));
}

function formatShortMonth(dateStr: string): string {
  return new Date(dateStr)
    .toLocaleDateString('pt-BR', { month: 'short' })
    .replace('.', '');
}

export function DashboardPage() {
  const { products } = useProducts();
  const { orders } = useOrders(() => {});

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const completedOrders = useMemo(
    () => orders.filter((o) => o.status === 'completed'),
    [orders],
  );

  const pendingOrders = useMemo(
    () => orders.filter((o) => o.status === 'pending'),
    [orders],
  );

  const totalRevenue = useMemo(
    () => completedOrders.reduce((s, o) => s + getOrderTotal(o), 0),
    [completedOrders],
  );

  const currentMonthOrders = useMemo(
    () => completedOrders.filter((o) => new Date(o.createdAt) >= startOfMonth),
    [completedOrders],
  );

  const avgTicket =
    completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;

  const lowStockCount = useMemo(
    () => products.filter((p) => p.stock <= p.minStock).length,
    [products],
  );

  const monthlyRevenue = useMemo(() => {
    const map: Record<string, number> = {};
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toISOString().slice(0, 7);
      map[key] = 0;
    }
    for (const order of completedOrders) {
      const key = order.createdAt.slice(0, 7);
      if (key in map) {
        map[key] += getOrderTotal(order);
      }
    }
    const entries = Object.entries(map);
    const max = Math.max(...entries.map(([, v]) => v), 1);
    return entries.map(([month, total]) => ({
      month,
      total,
      pct: (total / max) * 100,
    }));
  }, [completedOrders]);

  const topProducts = useMemo(() => {
    const map = new Map<string, number>();
    for (const order of completedOrders) {
      for (const item of order.items) {
        map.set(
          item.productName,
          (map.get(item.productName) ?? 0) + item.quantity,
        );
      }
    }
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, qty], i) => ({ rank: i + 1, name, qty }));
  }, [completedOrders]);

  const topMaxQty =
    topProducts.length > 0 ? Math.max(...topProducts.map((p) => p.qty)) : 1;

  const orderStatusData = useMemo(() => {
    const counts: Record<string, number> = {
      pending: 0,
      in_progress: 0,
      completed: 0,
      cancelled: 0,
    };
    for (const order of orders) {
      counts[order.status]++;
    }
    return [
      {
        status: 'pending',
        label: 'Pendentes',
        count: counts.pending,
        color: '#f59e0b',
      },
      {
        status: 'in_progress',
        label: 'Em Andamento',
        count: counts.in_progress,
        color: '#3b82f6',
      },
      {
        status: 'completed',
        label: 'Concluídos',
        count: counts.completed,
        color: '#2cba7a',
      },
      {
        status: 'cancelled',
        label: 'Cancelados',
        count: counts.cancelled,
        color: '#ef4444',
      },
    ];
  }, [orders]);

  const maxStatusCount = Math.max(...orderStatusData.map((d) => d.count), 1);

  const lowStockProducts = useMemo(
    () => products.filter((p) => p.stock <= p.minStock).slice(0, 5),
    [products],
  );

  const recentSales = useMemo(
    () =>
      [...completedOrders]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, 5),
    [completedOrders],
  );

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
      </div>

      <DashboardCards
        totalRevenue={totalRevenue}
        currentMonthSales={currentMonthOrders.length}
        avgTicket={avgTicket}
        pendingOrders={pendingOrders.length}
        lowStockCount={lowStockCount}
      />

      <div className="dashboard-grid">
        <section className="dashboard-section">
          <h2>Faturamento por Mês</h2>
          <div className="revenue-chart">
            {monthlyRevenue.map(({ month, total, pct }) => (
              <div key={month} className="revenue-chart-col">
                <div
                  className="revenue-chart-bar"
                  style={{ height: `${Math.max(pct, 2)}%` }}
                >
                  <span className="revenue-chart-tooltip">
                    {formatBRL(total)}
                  </span>
                </div>
                <span className="revenue-chart-label">
                  {formatShortMonth(month + '-01')}
                </span>
              </div>
            ))}
          </div>
        </section>

        <div className="dashboard-cols">
          <section className="dashboard-section">
            <h2>Produtos Mais Vendidos</h2>
            {topProducts.length === 0 ? (
              <p className="dashboard-empty">Nenhuma venda realizada</p>
            ) : (
              <div className="top-products">
                {topProducts.map((p) => (
                  <div key={p.name} className="top-product-row">
                    <span className="top-product-rank">{p.rank}</span>
                    <div className="top-product-info">
                      <span className="top-product-name">{p.name}</span>
                      <div className="top-product-bar-bg">
                        <div
                          className="top-product-bar"
                          style={{
                            width: `${(p.qty / topMaxQty) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                    <span className="top-product-qty">{p.qty} un</span>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="dashboard-section">
            <h2>Pedidos por Status</h2>
            <div className="status-distribution">
              {orderStatusData.map((d) => (
                <div key={d.status} className="status-row">
                  <div className="status-label">
                    <span
                      className="status-dot"
                      style={{ backgroundColor: d.color }}
                    />
                    <span>{d.label}</span>
                  </div>
                  <div className="status-bar-bg">
                    <div
                      className="status-bar"
                      style={{
                        width: `${(d.count / maxStatusCount) * 100}%`,
                        backgroundColor: d.color,
                      }}
                    />
                  </div>
                  <span className="status-count">{d.count}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="dashboard-cols">
          <section className="dashboard-section">
            <h2>Estoque Crítico</h2>
            {lowStockProducts.length === 0 ? (
              <p className="dashboard-empty">
                Nenhum produto com estoque baixo
              </p>
            ) : (
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Estoque</th>
                    <th>Mínimo</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockProducts.map((p) => (
                    <tr key={p.id} className="low-stock-row">
                      <td>{p.name}</td>
                      <td className="low-stock-value">{p.stock}</td>
                      <td>{p.minStock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>

          <section className="dashboard-section">
            <h2>Últimas Vendas</h2>
            {recentSales.length === 0 ? (
              <p className="dashboard-empty">Nenhuma venda realizada</p>
            ) : (
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Valor</th>
                    <th>Data</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSales.map((o) => (
                    <tr key={o.id}>
                      <td>{o.customerName}</td>
                      <td>{formatBRL(getOrderTotal(o))}</td>
                      <td>{formatDate(o.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
