import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from '@mui/material';
import { Pagination } from '@/components/Pagination';

export interface Column<T> {
  key: (keyof T & string) | (string & {});
  label: string;
  sortable?: boolean;
  render: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  items: T[];
  totalCount: number;
  start: number;
  sort: { key: string | null; direction: 'asc' | 'desc' };
  onToggleSort?: (key: string) => void;
  renderActions?: (item: T) => React.ReactNode;
  getRowKey: (item: T) => string;
  footerLabel: string;
  emptyMessage?: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
}

export function DataTable<T>({
  columns,
  items,
  totalCount,
  start,
  sort,
  onToggleSort,
  renderActions,
  getRowKey,
  footerLabel,
  emptyMessage,
  pagination,
}: DataTableProps<T>) {
  const colSpan = columns.length + (renderActions ? 1 : 0);

  return (
    <Paper variant="outlined">
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.key}
                  sortDirection={col.sortable && sort.key === col.key ? sort.direction : false}
                >
                  {col.sortable ? (
                    <TableSortLabel
                      active={sort.key === col.key}
                      direction={sort.key === col.key ? sort.direction : 'asc'}
                      onClick={() => onToggleSort?.(col.key)}
                    >
                      {col.label}
                    </TableSortLabel>
                  ) : (
                    col.label
                  )}
                </TableCell>
              ))}
              {renderActions && <TableCell align="right">Ações</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {totalCount === 0 ? (
              <TableRow>
                <TableCell colSpan={colSpan} align="center">
                  <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                    {emptyMessage ?? 'Nenhum registro encontrado.'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={getRowKey(item)} hover>
                  {columns.map((col) => (
                    <TableCell key={col.key}>{col.render(item)}</TableCell>
                  ))}
                  {renderActions && <TableCell align="right">{renderActions(item)}</TableCell>}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box
        sx={{
          px: 2,
          py: 1.5,
          borderTop: 1,
          borderColor: 'divider',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {totalCount > 0
            ? `Mostrando ${start + 1}–${start + items.length} de ${totalCount} ${footerLabel}`
            : `Mostrando 0 de 0 ${footerLabel}`}
        </Typography>
      </Box>

      {pagination && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={pagination.onPageChange}
        />
      )}
    </Paper>
  );
}
