import { useState } from 'react';
import type { Sale } from '../../../../shared';
import type { DashboardPeriod } from '../utils/ui';
import {
  formatCurrency,
  formatDate,
  formatDashboardAxisLabel,
  formatRangeLabel,
  getCurrentMonthRange,
  getDashboardRange,
  toDateInputValue
} from '../utils/formatters';
import { useDashboardMetrics } from '../hooks/useDashboardMetrics';

/* ── Metric card icons ── */
function IconCount() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M3 4a1 1 0 0 1 1-1h12a1 1 0 0 1 0 2H4a1 1 0 0 1-1-1Zm0 4a1 1 0 0 1 1-1h12a1 1 0 0 1 0 2H4a1 1 0 0 1-1-1Zm0 4a1 1 0 0 1 1-1h12a1 1 0 0 1 0 2H4a1 1 0 0 1-1-1Zm0 4a1 1 0 0 1 1-1h6a1 1 0 0 1 0 2H4a1 1 0 0 1-1-1Z" clipRule="evenodd" />
    </svg>
  );
}

function IconRevenue() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 0 1-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582ZM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 0 1-.567.267Z" />
      <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm1-13a1 1 0 1 0-2 0v.092a4.535 4.535 0 0 0-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 1 0-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 1 0 2 0v-.092a4.535 4.535 0 0 0 1.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0 0 11 9.092V7.151c.391.127.68.317.843.504a1 1 0 1 0 1.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5Z" clipRule="evenodd" />
    </svg>
  );
}

function IconCost() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M2 10a8 8 0 1 1 16 0 8 8 0 0 1-16 0Zm5-2.25A.75.75 0 0 1 7.75 7h4.5a.75.75 0 0 1 0 1.5h-4.5A.75.75 0 0 1 7 7.75Zm0 2.5a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75Zm.75 2a.75.75 0 0 0 0 1.5h2a.75.75 0 0 0 0-1.5h-2Z" clipRule="evenodd" />
    </svg>
  );
}

function IconProfit() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M12 7a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-1 9a1 1 0 0 0 1-1v-4a1 1 0 1 0-2 0v4a1 1 0 0 0 1 1Z" clipRule="evenodd" />
      <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm1-13a1 1 0 1 0-2 0v.092a4.535 4.535 0 0 0-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 1 0-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 1 0 2 0v-.092a4.535 4.535 0 0 0 1.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0 0 11 9.092V7.151c.391.127.68.317.843.504a1 1 0 1 0 1.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5Z" clipRule="evenodd" />
    </svg>
  );
}

type DashboardPageProps = {
  sales: Sale[];
  loading: boolean;
  onOpenSale: (sale: Sale) => void;
};

export function DashboardPage({ sales, loading, onOpenSale }: DashboardPageProps) {
  const currentMonthRange = getCurrentMonthRange(new Date());
  const [period, setPeriod] = useState<DashboardPeriod>('month');
  const [customStartDate, setCustomStartDate] = useState(toDateInputValue(currentMonthRange.start));
  const [customEndDate, setCustomEndDate] = useState(toDateInputValue(currentMonthRange.end));

  const range = getDashboardRange(period, customStartDate, customEndDate);
  const {
    filteredSales,
    buckets,
    totalRevenue,
    totalCost,
    totalProfit,
    averageTicket,
    peakRevenue,
    recentSales
  } = useDashboardMetrics(sales, range);
  const chartWidth = 760;
  const chartHeight = 260;
  const chartPaddingX = 32;
  const chartPaddingY = 28;
  const chartInnerWidth = chartWidth - chartPaddingX * 2;
  const chartInnerHeight = chartHeight - chartPaddingY * 2;
  const chartMinValue = Math.min(0, ...buckets.map((bucket) => Math.min(bucket.revenue, bucket.profit)));
  const chartMaxValue = Math.max(0, ...buckets.map((bucket) => Math.max(bucket.revenue, bucket.profit)));
  const chartValueRange = Math.max(chartMaxValue - chartMinValue, 1);
  const chartPoints = buckets.map((bucket, index) => {
    const x = buckets.length > 1 ? chartPaddingX + (index / (buckets.length - 1)) * chartInnerWidth : chartPaddingX + chartInnerWidth / 2;
    const revenueY = chartPaddingY + chartInnerHeight - ((bucket.revenue - chartMinValue) / chartValueRange) * chartInnerHeight;
    const profitY = chartPaddingY + chartInnerHeight - ((bucket.profit - chartMinValue) / chartValueRange) * chartInnerHeight;

    return {
      ...bucket,
      x,
      revenueY,
      profitY,
      displayLabel: formatDashboardAxisLabel(new Date(`${bucket.key}T12:00:00`))
    };
  });
  const revenueLinePath = chartPoints
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.revenueY.toFixed(2)}`)
    .join(' ');
  const profitLinePath = chartPoints
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.profitY.toFixed(2)}`)
    .join(' ');

  return (
    <section className="dashboard-stack">
      <section className="table-card dashboard-card">
        <div className="table-card-header dashboard-header">
          <div>
            <p className="section-label">Dashboard</p>
            <h3>Receitas por período</h3>
            <p>{loading ? 'Carregando...' : `${filteredSales.length} receita(s) no período selecionado`}</p>
          </div>

          <div className="dashboard-period-controls" role="group" aria-label="Selecionar período do dashboard">
            <button className={`ghost-button ${period === 'week' ? 'active-control' : ''}`} type="button" onClick={() => setPeriod('week')}>
              Semana
            </button>
            <button className={`ghost-button ${period === 'month' ? 'active-control' : ''}`} type="button" onClick={() => setPeriod('month')}>
              Mês
            </button>
            <button className={`ghost-button ${period === 'custom' ? 'active-control' : ''}`} type="button" onClick={() => setPeriod('custom')}>
              Personalizado
            </button>
          </div>
        </div>

        {period === 'custom' ? (
          <div className="dashboard-custom-range">
            <label>
              Início
              <input type="date" value={customStartDate} onChange={(event) => setCustomStartDate(event.target.value)} />
            </label>
            <label>
              Fim
              <input type="date" value={customEndDate} onChange={(event) => setCustomEndDate(event.target.value)} />
            </label>
          </div>
        ) : null}

        <p className="dashboard-range-label">{range.label}: {formatRangeLabel(range.start, range.end)}</p>

        <div className="metrics sales-metrics dashboard-metrics">
          <div className="metric-card metric-card--accent">
            <div className="metric-card-icon">
              <IconCount />
            </div>
            <span>Receitas</span>
            <strong>{loading ? '...' : filteredSales.length}</strong>
          </div>
          <div className="metric-card metric-card--info">
            <div className="metric-card-icon">
              <IconRevenue />
            </div>
            <span>Faturamento</span>
            <strong>{loading ? '...' : formatCurrency(totalRevenue)}</strong>
          </div>
          <div className="metric-card metric-card--warning">
            <div className="metric-card-icon">
              <IconCost />
            </div>
            <span>Custo</span>
            <strong>{loading ? '...' : formatCurrency(totalCost)}</strong>
          </div>
          <div className="metric-card metric-card--success">
            <div className="metric-card-icon">
              <IconProfit />
            </div>
            <span>Lucro</span>
            <strong>{loading ? '...' : formatCurrency(totalProfit)}</strong>
          </div>
        </div>

        <div className="dashboard-summary-strip">
          <div>
            <span>Ticket médio</span>
            <strong>{loading ? '...' : formatCurrency(averageTicket)}</strong>
          </div>
          <div>
            <span>Melhor dia</span>
            <strong>
              {loading || peakRevenue === 0
                ? '-'
                : buckets.reduce((best, bucket) => (bucket.revenue > best.revenue ? bucket : best), buckets[0])?.label ?? '-'}
            </strong>
          </div>
          <div>
            <span>Período</span>
            <strong>{loading ? '...' : `${range.start.toLocaleDateString('pt-BR')} - ${range.end.toLocaleDateString('pt-BR')}`}</strong>
          </div>
        </div>

        <div className="dashboard-chart-wrap">
          <div className="dashboard-chart-legend">
            <span><span className="legend-swatch revenue-swatch" />Faturamento diário</span>
            <span><span className="legend-swatch profit-swatch" />Lucro bruto</span>
          </div>

          <div className="dashboard-chart" aria-label="Receitas agregadas por dia">
            {chartPoints.length === 0 ? (
              <p className="empty-state">Nenhuma venda encontrada no período selecionado.</p>
            ) : (
              <svg className="dashboard-line-chart" viewBox={`0 0 ${chartWidth} ${chartHeight}`} role="img" aria-label="Gráfico de linha de receitas por dia">
                <line x1={chartPaddingX} y1={chartPaddingY + chartInnerHeight} x2={chartPaddingX + chartInnerWidth} y2={chartPaddingY + chartInnerHeight} className="dashboard-axis" />
                <line x1={chartPaddingX} y1={chartPaddingY} x2={chartPaddingX} y2={chartPaddingY + chartInnerHeight} className="dashboard-axis dashboard-axis-vertical" />
                {peakRevenue > 0 ? [0, 1, 2, 3].map((tick) => {
                  const tickValue = chartMinValue + (chartValueRange / 3) * tick;
                  const y = chartPaddingY + chartInnerHeight - (tick / 3) * chartInnerHeight;

                  return (
                    <g key={tick}>
                      <line x1={chartPaddingX} y1={y} x2={chartPaddingX + chartInnerWidth} y2={y} className="dashboard-grid-line" />
                      <text x={12} y={y + 4} className="dashboard-axis-label">{formatCurrency(tickValue)}</text>
                    </g>
                  );
                }) : null}
                <path d={revenueLinePath} className="dashboard-line revenue-line" />
                <path d={profitLinePath} className="dashboard-line profit-line" />
                {chartPoints.map((point) => (
                  <g key={point.key}>
                    <circle cx={point.x} cy={point.revenueY} r="5" className="dashboard-point revenue-point">
                      <title>{`${point.label}: faturamento ${formatCurrency(point.revenue)}`}</title>
                    </circle>
                    <circle cx={point.x} cy={point.profitY} r="5" className="dashboard-point profit-point">
                      <title>{`${point.label}: lucro ${formatCurrency(point.profit)}`}</title>
                    </circle>
                  </g>
                ))}
              </svg>
            )}
          </div>
        </div>
      </section>

      <section className="table-card">
        <div className="table-card-header">
          <div>
            <h3>Receitas recentes no período</h3>
            <p>{loading ? 'Carregando...' : `${recentSales.length} item(ns) exibido(s)`}</p>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Data</th>
                <th>Total</th>
                <th>Lucro</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {recentSales.length === 0 ? (
                <tr>
                  <td colSpan={5} className="empty-state">
                    Nenhuma receita para mostrar no dashboard.
                  </td>
                </tr>
              ) : (
                recentSales.map((sale) => (
                  <tr key={sale.id} onClick={() => sale.id && onOpenSale(sale)}>
                    <td>{sale.id}</td>
                    <td>{formatDate(sale.date)}</td>
                    <td>{formatCurrency(sale.total_price)}</td>
                    <td>{formatCurrency(sale.gross_profit ?? 0)}</td>
                    <td>
                      <button className="ghost-button row-action-button" type="button" onClick={(e) => { e.stopPropagation(); sale.id && onOpenSale(sale); }}>
                        Ver
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
