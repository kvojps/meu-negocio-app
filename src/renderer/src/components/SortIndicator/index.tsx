interface SortIndicatorProps {
  direction: 'asc' | 'desc' | null;
}

export function SortIndicator({ direction }: SortIndicatorProps) {
  if (!direction) return null;
  return (
    <span style={{ marginLeft: 4 }}>{direction === 'asc' ? '▲' : '▼'}</span>
  );
}
