import {
  PendingActions,
  Receipt,
  Savings,
  ShoppingCart,
  TrendingUp,
  WarningAmber,
} from '@mui/icons-material';
import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import type { ComponentType } from 'react';

interface DashboardCardsProps {
  totalRevenue: number;
  totalProfit: number;
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

type CardColor =
  | 'primary'
  | 'success'
  | 'info'
  | 'secondary'
  | 'warning'
  | 'error';

interface StatCard {
  label: string;
  value: string;
  sub: string;
  color: CardColor;
  icon: ComponentType<{ sx?: object }>;
}

export function DashboardCards({
  totalRevenue,
  totalProfit,
  currentMonthSales,
  avgTicket,
  pendingOrders,
  lowStockCount,
}: DashboardCardsProps) {
  const cards: StatCard[] = [
    {
      label: 'Faturamento Total',
      value: formatBRL(totalRevenue),
      sub: `${currentMonthSales} venda${currentMonthSales !== 1 ? 's' : ''} no mês`,
      color: 'primary',
      icon: TrendingUp,
    },
    {
      label: 'Lucro Total',
      value: formatBRL(totalProfit),
      sub:
        totalRevenue > 0
          ? `${((totalProfit / totalRevenue) * 100).toFixed(1)}% de margem`
          : 'sem vendas',
      color: 'success',
      icon: Savings,
    },
    {
      label: 'Vendas no Mês',
      value: String(currentMonthSales),
      sub: 'pedidos concluídos',
      color: 'info',
      icon: ShoppingCart,
    },
    {
      label: 'Ticket Médio',
      value: formatBRL(avgTicket),
      sub: 'por venda',
      color: 'secondary',
      icon: Receipt,
    },
    {
      label: 'Pedidos Pendentes',
      value: String(pendingOrders),
      sub: 'aguardando processamento',
      color: 'warning',
      icon: PendingActions,
    },
    {
      label: 'Estoque Baixo',
      value: String(lowStockCount),
      sub:
        lowStockCount === 1
          ? 'produto abaixo do mínimo'
          : 'produtos abaixo do mínimo',
      color: 'error',
      icon: WarningAmber,
    },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      }}
    >
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.label} variant="outlined">
            <CardContent>
              <Stack spacing={1}>
                <Icon sx={{ color: `${card.color}.main`, fontSize: 24 }} />
                <Typography variant="h5">{card.value}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {card.label}
                </Typography>
                <Typography variant="caption" color="text.disabled">
                  {card.sub}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
}
