import { Receipt, Savings, ShoppingCart, TrendingUp } from '@mui/icons-material';
import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import type { ComponentType } from 'react';
import { useMemo } from 'react';
import type { Order } from '@shared/types/order';
import { getOrderProfit, getOrderTotal } from '@shared/types/order';

interface SalesCardsProps {
  completedOrders: Order[];
}

function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

type CardColor = 'primary' | 'success' | 'info' | 'secondary';

interface StatCard {
  label: string;
  value: string;
  sub: string;
  color: CardColor;
  icon: ComponentType<{ sx?: object }>;
}

export function SalesCards({ completedOrders }: SalesCardsProps) {
  const cards: StatCard[] = useMemo(() => {
    const totalRevenue = completedOrders.reduce((sum, o) => sum + getOrderTotal(o), 0);
    const totalProfit = completedOrders.reduce((sum, o) => sum + getOrderProfit(o), 0);
    const totalSales = completedOrders.length;
    const avgTicket = totalSales > 0 ? totalRevenue / totalSales : 0;

    return [
      {
        label: 'Total Vendido',
        value: formatBRL(totalRevenue),
        sub: `${totalSales} venda${totalSales !== 1 ? 's' : ''}`,
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
        label: 'Quantidade de Vendas',
        value: String(totalSales),
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
    ];
  }, [completedOrders]);

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
