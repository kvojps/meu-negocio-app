import { useMemo } from 'react';
import type { Sale } from '../../../shared';
import type { DashboardBucket } from '../utils/ui';
import { buildDashboardBuckets, isSaleWithinRange } from '../utils/formatters';

type DashboardRange = { start: Date; end: Date };

type UseDashboardMetricsResult = {
  filteredSales: Sale[];
  buckets: DashboardBucket[];
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  averageTicket: number;
  peakRevenue: number;
  recentSales: Sale[];
};

export function useDashboardMetrics(
  sales: Sale[],
  range: DashboardRange
): UseDashboardMetricsResult {
  // Usar .getTime() como dependência evita re-cálculos desnecessários causados
  // por novas referências de Date com o mesmo valor a cada render.
  const startMs = range.start.getTime();
  const endMs = range.end.getTime();

  return useMemo(() => {
    const filteredSales = sales.filter((sale) =>
      isSaleWithinRange(sale, range.start, range.end)
    );
    const buckets = buildDashboardBuckets(filteredSales, range.start, range.end);

    const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.total_price, 0);
    const totalCost = filteredSales.reduce((sum, sale) => sum + (sale.cost_total ?? 0), 0);
    const totalProfit = filteredSales.reduce((sum, sale) => sum + (sale.gross_profit ?? 0), 0);
    const averageTicket = filteredSales.length > 0 ? totalRevenue / filteredSales.length : 0;
    const peakRevenue = buckets.reduce(
      (maxValue, bucket) => Math.max(maxValue, bucket.revenue),
      0
    );
    const recentSales = filteredSales.slice(0, 6);

    return {
      filteredSales,
      buckets,
      totalRevenue,
      totalCost,
      totalProfit,
      averageTicket,
      peakRevenue,
      recentSales
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sales, startMs, endMs]);
}
