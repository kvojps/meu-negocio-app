import {
  Box,
  Card,
  CardContent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  ORDER_STATUS_COLOR,
  ORDER_STATUS_LABELS,
  getOrderProfit,
  getOrderTotal,
} from '@shared/types/order';
import type { OrderStatus } from '@shared/types/order';
import { DashboardIcon } from '@/components/Icons';
import { PageHeader } from '@/components/PageHeader';
import { useOrders } from '@/hooks/orders/useOrders';
import { useProducts } from '@/hooks/products/useProducts';
import { DashboardCards } from './components/DashboardCards';
import { MonthRangeFilter } from './components/MonthRangeFilter';

function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

function formatBRLCompact(value: number): string {
  if (Math.abs(value) >= 1000) {
    return `R$ ${(value / 1000).toFixed(1).replace('.0', '')}k`;
  }
  return `R$ ${value}`;
}

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(dateStr));
}

function formatShortMonth(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
}

function calcTrend(current: number, previous: number): number | undefined {
  if (previous <= 0) return undefined;
  return ((current - previous) / previous) * 100;
}

const HORIZONTAL_CHART_HEIGHT = 220;
const MAX_TOP_PRODUCTS = 5;
const TICK_LEFT_PADDING = 4;
const TICK_BAR_GAP = 8;

let measureCanvas: HTMLCanvasElement | null = null;
function measureTextWidth(text: string): number {
  measureCanvas ??= document.createElement('canvas');
  const ctx = measureCanvas.getContext('2d');
  if (!ctx) return text.length * 7;
  ctx.font = '12px Inter, Roboto, Helvetica, Arial, sans-serif';
  return ctx.measureText(text).width;
}

function getYAxisWidth(labels: string[]): number {
  if (labels.length === 0) return 0;
  const maxTextWidth = Math.max(...labels.map(measureTextWidth));
  return Math.ceil(TICK_LEFT_PADDING + maxTextWidth + TICK_BAR_GAP);
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {title}
        </Typography>
        {children}
      </CardContent>
    </Card>
  );
}

function renderLeftAlignedTick(
  props: { y?: number | string; payload?: { value: string } },
  fill: string,
) {
  const { y, payload } = props;
  return (
    <text x={TICK_LEFT_PADDING} y={y} dy={4} textAnchor="start" fontSize={12} fill={fill}>
      {payload?.value}
    </text>
  );
}

export function DashboardPage() {
  const theme = useTheme();
  const { products } = useProducts();
  const { orders: allOrders, filtered: orders, filters, setFilters } = useOrders();

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const completedOrders = useMemo(() => orders.filter((o) => o.status === 'completed'), [orders]);
  const pendingOrders = useMemo(() => orders.filter((o) => o.status === 'pending'), [orders]);

  const totalRevenue = useMemo(
    () => completedOrders.reduce((s, o) => s + getOrderTotal(o), 0),
    [completedOrders],
  );

  const totalProfit = useMemo(
    () => completedOrders.reduce((s, o) => s + getOrderProfit(o), 0),
    [completedOrders],
  );

  const currentMonthOrders = useMemo(
    () => completedOrders.filter((o) => new Date(o.createdAt) >= startOfMonth),
    [completedOrders],
  );

  const prevMonthOrders = useMemo(
    () =>
      completedOrders.filter((o) => {
        const d = new Date(o.createdAt);
        return d >= startOfPrevMonth && d < startOfMonth;
      }),
    [completedOrders],
  );

  const avgTicket = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;

  const currentMonthRevenue = useMemo(
    () => currentMonthOrders.reduce((s, o) => s + getOrderTotal(o), 0),
    [currentMonthOrders],
  );
  const currentMonthProfit = useMemo(
    () => currentMonthOrders.reduce((s, o) => s + getOrderProfit(o), 0),
    [currentMonthOrders],
  );
  const currentMonthAvgTicket =
    currentMonthOrders.length > 0 ? currentMonthRevenue / currentMonthOrders.length : 0;

  const prevMonthRevenue = useMemo(
    () => prevMonthOrders.reduce((s, o) => s + getOrderTotal(o), 0),
    [prevMonthOrders],
  );
  const prevMonthProfit = useMemo(
    () => prevMonthOrders.reduce((s, o) => s + getOrderProfit(o), 0),
    [prevMonthOrders],
  );
  const prevMonthAvgTicket =
    prevMonthOrders.length > 0 ? prevMonthRevenue / prevMonthOrders.length : 0;

  const revenueTrend = calcTrend(currentMonthRevenue, prevMonthRevenue);
  const profitTrend = calcTrend(currentMonthProfit, prevMonthProfit);
  const avgTicketTrend = calcTrend(currentMonthAvgTicket, prevMonthAvgTicket);

  const lowStockCount = useMemo(
    () => products.filter((p) => p.stock <= p.minStock).length,
    [products],
  );

  const monthlyRevenue = useMemo(() => {
    const revenueMap: Record<string, number> = {};
    const profitMap: Record<string, number> = {};
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toISOString().slice(0, 7);
      revenueMap[key] = 0;
      profitMap[key] = 0;
    }
    for (const order of completedOrders) {
      const key = order.createdAt.slice(0, 7);
      if (key in revenueMap) {
        revenueMap[key] += getOrderTotal(order);
        profitMap[key] += getOrderProfit(order);
      }
    }
    return Object.entries(revenueMap).map(([month, total]) => ({
      month,
      monthLabel: formatShortMonth(`${month}-01`),
      total,
      profit: profitMap[month],
    }));
  }, [completedOrders]);

  const topProducts = useMemo(() => {
    const map = new Map<string, number>();
    for (const order of completedOrders) {
      for (const item of order.items) {
        map.set(item.productName, (map.get(item.productName) ?? 0) + item.quantity);
      }
    }
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, MAX_TOP_PRODUCTS)
      .map(([name, qty], i) => ({ rank: i + 1, name: `${i + 1}. ${name}`, qty }));
  }, [completedOrders]);

  // Padded to a fixed number of rows so a short list still renders top-aligned
  // instead of Recharts centering the few real bars across the full height.
  const topProductsChartData = useMemo(() => {
    const padded = [...topProducts];
    while (padded.length < MAX_TOP_PRODUCTS) {
      padded.push({ rank: padded.length + 1, name: '', qty: 0 });
    }
    return padded;
  }, [topProducts]);

  const orderStatusData = useMemo(() => {
    const counts: Record<OrderStatus, number> = {
      pending: 0,
      in_progress: 0,
      completed: 0,
      cancelled: 0,
    };
    for (const order of orders) {
      counts[order.status]++;
    }
    return (Object.keys(counts) as OrderStatus[]).map((status) => ({
      status,
      label: ORDER_STATUS_LABELS[status],
      count: counts[status],
      color: ORDER_STATUS_COLOR[status],
    }));
  }, [orders]);

  const productYAxisWidth = useMemo(
    () => getYAxisWidth(topProducts.map((p) => p.name)),
    [topProducts],
  );
  const statusYAxisWidth = useMemo(
    () => getYAxisWidth(orderStatusData.map((d) => d.label)),
    [orderStatusData],
  );

  const lowStockProducts = useMemo(
    () => products.filter((p) => p.stock <= p.minStock).slice(0, 5),
    [products],
  );

  const recentSales = useMemo(
    () =>
      [...completedOrders]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5),
    [completedOrders],
  );

  return (
    <Stack spacing={2}>
      <PageHeader
        icon={<DashboardIcon />}
        title="Dashboard"
        subtitle="Visão geral do seu negócio"
      />

      <MonthRangeFilter orders={allOrders} filters={filters} onChange={setFilters} />

      <DashboardCards
        totalRevenue={totalRevenue}
        totalProfit={totalProfit}
        currentMonthSales={currentMonthOrders.length}
        avgTicket={avgTicket}
        pendingOrders={pendingOrders.length}
        lowStockCount={lowStockCount}
        revenueTrend={revenueTrend}
        profitTrend={profitTrend}
        avgTicketTrend={avgTicketTrend}
      />

      <SectionCard title="Faturamento e Lucro por Mês">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={monthlyRevenue} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
            <XAxis
              dataKey="monthLabel"
              tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
              axisLine={{ stroke: theme.palette.divider }}
              tickLine={false}
            />
            <YAxis
              tickFormatter={formatBRLCompact}
              tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={64}
            />
            <RechartsTooltip
              formatter={(value, name) => [
                formatBRL(Number(value)),
                name === 'total' ? 'Faturamento' : 'Lucro',
              ]}
              contentStyle={{
                background: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 8,
              }}
              labelStyle={{ color: theme.palette.text.primary }}
              itemStyle={{ color: theme.palette.text.primary }}
              cursor={{ fill: theme.palette.action.hover }}
            />
            <Legend
              formatter={(value) => (value === 'total' ? 'Faturamento' : 'Lucro')}
              wrapperStyle={{ fontSize: 12, color: theme.palette.text.secondary }}
            />
            <Bar dataKey="total" name="total" fill={theme.palette.primary.main} radius={[4, 4, 0, 0]} />
            <Bar dataKey="profit" name="profit" fill={theme.palette.success.main} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </SectionCard>

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
        }}
      >
        <SectionCard title="Produtos Mais Vendidos">
          {topProducts.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              Nenhuma venda realizada
            </Typography>
          ) : (
            <ResponsiveContainer width="100%" height={HORIZONTAL_CHART_HEIGHT}>
              <BarChart
                data={topProductsChartData}
                layout="vertical"
                margin={{ top: 0, right: 24, left: 0, bottom: 0 }}
                barCategoryGap="30%"
              >
                <XAxis type="number" hide domain={[0, 'dataMax']} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={productYAxisWidth}
                  tick={(props) => renderLeftAlignedTick(props, theme.palette.text.secondary)}
                  axisLine={false}
                  tickLine={false}
                />
                <RechartsTooltip
                  formatter={(value) => [`${Number(value)} un`, 'Quantidade']}
                  contentStyle={{
                    background: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 8,
                  }}
                  labelStyle={{ color: theme.palette.text.primary }}
                  itemStyle={{ color: theme.palette.text.primary }}
                  cursor={{ fill: theme.palette.action.hover }}
                />
                <Bar dataKey="qty" fill={theme.palette.primary.main} radius={[0, 4, 4, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </SectionCard>

        <SectionCard title="Pedidos por Status">
          <ResponsiveContainer width="100%" height={HORIZONTAL_CHART_HEIGHT}>
            <BarChart
              data={orderStatusData}
              layout="vertical"
              margin={{ top: 0, right: 24, left: 0, bottom: 0 }}
              barCategoryGap="30%"
            >
              <XAxis type="number" hide allowDecimals={false} domain={[0, 'dataMax']} />
              <YAxis
                type="category"
                dataKey="label"
                width={statusYAxisWidth}
                tick={(props) => renderLeftAlignedTick(props, theme.palette.text.secondary)}
                axisLine={false}
                tickLine={false}
              />
              <RechartsTooltip
                formatter={(value) => [Number(value), 'Pedidos']}
                contentStyle={{
                  background: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 8,
                }}
                labelStyle={{ color: theme.palette.text.primary }}
                itemStyle={{ color: theme.palette.text.primary }}
                cursor={{ fill: theme.palette.action.hover }}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={16}>
                {orderStatusData.map((d) => (
                  <Cell key={d.status} fill={theme.palette[d.color].main} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
        }}
      >
        <SectionCard title="Estoque Crítico">
          {lowStockProducts.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              Nenhum produto com estoque baixo
            </Typography>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Produto</TableCell>
                    <TableCell>Estoque</TableCell>
                    <TableCell>Mínimo</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lowStockProducts.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>{p.name}</TableCell>
                      <TableCell sx={{ color: 'error.main', fontWeight: 600 }}>{p.stock}</TableCell>
                      <TableCell>{p.minStock}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </SectionCard>

        <SectionCard title="Últimas Vendas">
          {recentSales.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              Nenhuma venda realizada
            </Typography>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Cliente</TableCell>
                    <TableCell>Valor</TableCell>
                    <TableCell>Data</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentSales.map((o) => (
                    <TableRow key={o.id}>
                      <TableCell>{o.customerName}</TableCell>
                      <TableCell>{formatBRL(getOrderTotal(o))}</TableCell>
                      <TableCell>{formatDate(o.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </SectionCard>
      </Box>
    </Stack>
  );
}
