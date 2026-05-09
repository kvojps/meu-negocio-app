import type { Sale, Product } from "../../../shared";
import type { DashboardBucket, DashboardPeriod, SaleFormItemState } from "./ui";

export function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatDate(value?: string): string {
  if (!value) {
    return "-";
  }

  const parsedDate = new Date(value);
  return Number.isNaN(parsedDate.getTime())
    ? value
    : parsedDate.toLocaleString("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
      });
}

export function toDateTimeLocalValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function toDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function startOfLocalDay(date: Date): Date {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  return start;
}

export function endOfLocalDay(date: Date): Date {
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return end;
}

export function getCurrentWeekRange(referenceDate: Date): {
  start: Date;
  end: Date;
} {
  const start = startOfLocalDay(referenceDate);
  const dayOfWeek = start.getDay();
  const daysSinceMonday = (dayOfWeek + 6) % 7;
  start.setDate(start.getDate() - daysSinceMonday);

  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return { start, end: endOfLocalDay(end) };
}

export function getCurrentMonthRange(referenceDate: Date): {
  start: Date;
  end: Date;
} {
  const start = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    1,
  );
  const end = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth() + 1,
    0,
  );
  return { start: startOfLocalDay(start), end: endOfLocalDay(end) };
}

export function getDashboardRange(
  period: DashboardPeriod,
  customStartDate: string,
  customEndDate: string,
): { start: Date; end: Date; label: string } {
  const now = new Date();

  if (period === "week") {
    const { start, end } = getCurrentWeekRange(now);
    return { start, end, label: "Semana atual" };
  }

  if (period === "month") {
    const { start, end } = getCurrentMonthRange(now);
    return { start, end, label: "Mês atual" };
  }

  const start = customStartDate
    ? startOfLocalDay(new Date(`${customStartDate}T00:00:00`))
    : startOfLocalDay(new Date(now.getFullYear(), now.getMonth(), 1));
  const end = customEndDate
    ? endOfLocalDay(new Date(`${customEndDate}T00:00:00`))
    : endOfLocalDay(now);

  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime()) ||
    start > end
  ) {
    const fallback = getCurrentMonthRange(now);
    return { start: fallback.start, end: fallback.end, label: "Personalizado" };
  }

  return { start, end, label: "Personalizado" };
}

export function isSaleWithinRange(sale: Sale, start: Date, end: Date): boolean {
  const saleDate = new Date(sale.date);
  return saleDate >= start && saleDate <= end;
}

export function buildDashboardBuckets(
  sales: Sale[],
  start: Date,
  end: Date,
): DashboardBucket[] {
  const buckets = new Map<string, DashboardBucket>();

  for (const sale of sales) {
    const saleDate = new Date(sale.date);
    const key = saleDate.toISOString().slice(0, 10);

    if (!buckets.has(key)) {
      buckets.set(key, {
        key,
        label: formatDashboardAxisLabel(saleDate),
        saleCount: 0,
        revenue: 0,
        cost: 0,
        profit: 0,
      });
    }

    const bucket = buckets.get(key)!;
    bucket.saleCount += 1;
    bucket.revenue += sale.total_price;
    bucket.cost += sale.cost_total ?? 0;
    bucket.profit += sale.gross_profit ?? 0;
  }

  const result: DashboardBucket[] = [];
  const cursor = startOfLocalDay(start);

  while (cursor <= end) {
    const key = cursor.toISOString().slice(0, 10);
    result.push(
      buckets.get(key) ?? {
        key,
        label: formatDashboardAxisLabel(cursor),
        saleCount: 0,
        revenue: 0,
        cost: 0,
        profit: 0,
      },
    );

    cursor.setDate(cursor.getDate() + 1);
  }

  return result;
}

export function formatRangeLabel(start: Date, end: Date): string {
  return `${start.toLocaleDateString("pt-BR")} até ${end.toLocaleDateString("pt-BR")}`;
}

export function formatDashboardAxisLabel(date: Date): string {
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

export function buildSaleFormItem(products: Product[]): SaleFormItemState {
  const firstProduct = products[0];

  return {
    productId: firstProduct?.id ? String(firstProduct.id) : "",
    quantity: "1",
    unitPrice: firstProduct ? String(firstProduct.price) : "0",
    unitCost: firstProduct ? String(firstProduct.cost_price) : "0",
  };
}

export function calculateSaleTotal(items: SaleFormItemState[]): string {
  const total = items.reduce((sum, item) => {
    const quantity = Number(item.quantity);
    const unitPrice = Number(item.unitPrice);
    return (
      sum +
      (Number.isFinite(quantity) ? quantity : 0) *
        (Number.isFinite(unitPrice) ? unitPrice : 0)
    );
  }, 0);

  return total.toFixed(2);
}
