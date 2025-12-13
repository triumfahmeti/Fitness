import React from "react";

export default function Pagination({
  total,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  colSpan = 4,
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIdx = (currentPage - 1) * pageSize;
  const showingFrom = total === 0 ? 0 : startIdx + 1;
  const showingTo = Math.min(startIdx + pageSize, total);

  return (
    <tr>
      <td colSpan={colSpan}>
        <div className="d-flex justify-content-between align-items-center p-2">
          <div className="text-muted">
            Showing {showingFrom}–{showingTo} of {total}
          </div>
          <div className="d-flex align-items-center gap-2">
            <select
              className="form-select form-select-sm"
              style={{ width: 140 }}
              value={pageSize}
              onChange={(e) => onPageSizeChange(parseInt(e.target.value, 10))}
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
            </select>
            <div className="btn-group">
              <button
                className="btn btn-outline-secondary btn-sm"
                disabled={currentPage <= 1}
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              >
                Prev
              </button>
              <span className="btn btn-outline-secondary btn-sm disabled">
                Page {currentPage} / {totalPages}
              </span>
              <button
                className="btn btn-outline-secondary btn-sm"
                disabled={currentPage >= totalPages}
                onClick={() =>
                  onPageChange(Math.min(totalPages, currentPage + 1))
                }
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
}
