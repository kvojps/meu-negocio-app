import './styles.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="pagination">
      <button
        className="pagination-btn"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        type="button"
      >
        ‹ Anterior
      </button>

      <div className="pagination-pages">
        {pages.map((p) => (
          <button
            key={p}
            className={
              p === currentPage
                ? 'pagination-btn pagination-btn--active'
                : 'pagination-btn'
            }
            onClick={() => onPageChange(p)}
            type="button"
          >
            {p}
          </button>
        ))}
      </div>

      <button
        className="pagination-btn"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        type="button"
      >
        Próximo ›
      </button>
    </div>
  );
}
