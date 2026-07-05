import { DashboardIcon } from '@components/Icons';
import { PageHeader } from '@components/PageHeader';
import { useOrders } from '@hooks/orders/useOrders';
import { useProducts } from '@hooks/products/useProducts';
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
  Tooltip,
  Typography,
} from '@mui/material';
import {
  ORDER_STATUS_COLOR,
  ORDER_STATUS_LABELS,
  getOrderProfit,
  getOrderTotal,
} from '@shared/types/order';
import type { OrderStatus } from '@shared/types/order';
import { useMemo } from 'react';
import { OrderFilters } from '../orders/components/OrderFilters';
import { DashboardCards } from './components/DashboardCards';

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

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
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

export function DashboardPage() {
  const { products } = useProducts();
  const { filtered: orders, filters, setFilters } = useOrders();

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

  const totalProfit = useMemo(
    () => completedOrders.reduce((s, o) => s + getOrderProfit(o), 0),
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
    const entries = Object.entries(revenueMap);
    const max = Math.max(...entries.map(([, v]) => v), 1);
    return entries.map(([month, total]) => ({
      month,
      total,
      profit: profitMap[month],
      pct: (total / max) * 100,
      profitPct: (profitMap[month] / max) * 100,
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
    <Stack spacing={2}>
      <PageHeader
        icon={<DashboardIcon />}
        title="Dashboard"
        subtitle="Visão geral do seu negócio"
      />

      <OrderFilters
        filters={filters}
        onChange={setFilters}
        hideSearch
        hideStatusFilter
        showDateFilter
      />

      <DashboardCards
        totalRevenue={totalRevenue}
        totalProfit={totalProfit}
        currentMonthSales={currentMonthOrders.length}
        avgTicket={avgTicket}
        pendingOrders={pendingOrders.length}
        lowStockCount={lowStockCount}
      />

      <SectionCard title="Faturamento e Lucro por Mês">
        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                bgcolor: 'primary.main',
              }}
            />
            <Typography variant="caption" color="text.secondary">
              Faturamento
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                bgcolor: 'success.main',
              }}
            />
            <Typography variant="caption" color="text.secondary">
              Lucro
            </Typography>
          </Stack>
        </Stack>
        <Stack
          direction="row"
          spacing={2}
          alignItems="flex-end"
          sx={{ height: 180 }}
        >
          {monthlyRevenue.map(({ month, total, profit, pct, profitPct }) => (
            <Stack
              key={month}
              alignItems="center"
              spacing={1}
              sx={{ flex: 1, height: '100%' }}
            >
              <Stack
                direction="row"
                spacing={0.5}
                alignItems="flex-end"
                sx={{ flex: 1, width: '100%' }}
              >
                <Tooltip title={formatBRL(total)}>
                  <Box
                    sx={{
                      flex: 1,
                      height: `${Math.max(pct, 2)}%`,
                      bgcolor: 'primary.main',
                      borderRadius: '4px 4px 0 0',
                    }}
                  />
                </Tooltip>
                <Tooltip title={formatBRL(profit)}>
                  <Box
                    sx={{
                      flex: 1,
                      height: `${Math.max(profitPct, 2)}%`,
                      bgcolor: 'success.main',
                      borderRadius: '4px 4px 0 0',
                    }}
                  />
                </Tooltip>
              </Stack>
              <Typography variant="caption" color="text.secondary">
                {formatShortMonth(month + '-01')}
              </Typography>
            </Stack>
          ))}
        </Stack>
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
            <Stack spacing={1.5}>
              {topProducts.map((p) => (
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1.5}
                  key={p.name}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ width: 16 }}
                  >
                    {p.rank}
                  </Typography>
                  <Stack sx={{ flex: 1 }} spacing={0.5}>
                    <Typography variant="body2" noWrap>
                      {p.name}
                    </Typography>
                    <Box
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        bgcolor: 'action.hover',
                      }}
                    >
                      <Box
                        sx={{
                          height: '100%',
                          borderRadius: 3,
                          width: `${(p.qty / topMaxQty) * 100}%`,
                          bgcolor: 'primary.main',
                        }}
                      />
                    </Box>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {p.qty} un
                  </Typography>
                </Stack>
              ))}
            </Stack>
          )}
        </SectionCard>

        <SectionCard title="Pedidos por Status">
          <Stack spacing={1.5}>
            {orderStatusData.map((d) => (
              <Stack
                direction="row"
                alignItems="center"
                spacing={1.5}
                key={d.status}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{ width: 140 }}
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: `${d.color}.main`,
                    }}
                  />
                  <Typography variant="body2">{d.label}</Typography>
                </Stack>
                <Box
                  sx={{
                    flex: 1,
                    height: 6,
                    borderRadius: 3,
                    bgcolor: 'action.hover',
                  }}
                >
                  <Box
                    sx={{
                      height: '100%',
                      borderRadius: 3,
                      width: `${(d.count / maxStatusCount) * 100}%`,
                      bgcolor: `${d.color}.main`,
                    }}
                  />
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ width: 24, textAlign: 'right' }}
                >
                  {d.count}
                </Typography>
              </Stack>
            ))}
          </Stack>
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
                      <TableCell sx={{ color: 'error.main', fontWeight: 600 }}>
                        {p.stock}
                      </TableCell>
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
