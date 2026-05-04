type TablePaginationProps = {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
};

export function TablePagination({ currentPage, totalPages, onPrevious, onNext }: TablePaginationProps) {
  return (
    <div className="table-pagination">
      <span>
        Página {currentPage} de {totalPages || 1}
      </span>
      <div className="table-pagination-actions">
        <button className="ghost-button" type="button" onClick={onPrevious} disabled={currentPage === 1}>
          Anterior
        </button>
        <button className="ghost-button" type="button" onClick={onNext} disabled={currentPage === totalPages || totalPages === 0}>
          Próxima
        </button>
      </div>
    </div>
  );
}
