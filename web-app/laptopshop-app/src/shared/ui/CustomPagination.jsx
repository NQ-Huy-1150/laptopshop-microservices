import { Pagination } from 'react-bootstrap';

export default function CustomPagination({
    currentPage = 1,
    totalPages = 1,
    totalElements = 0,
    pageSize = 5,
    onPageChange
}) {
    if (totalPages <= 1 && totalElements <= pageSize) return null;

    const getPageNumbers = () => {
        const delta = 1; // Số lượng trang hiển thị xung quanh trang hiện tại
        const range = [];
        const pagesWithEllipsis = [];

        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 ||
                i === totalPages ||
                (i >= currentPage - delta && i <= currentPage + delta)
            ) {
                range.push(i);
            }
        }

        let prevPage;
        for (let i of range) {
            if (prevPage) {
                if (i - prevPage === 2) {
                    pagesWithEllipsis.push(prevPage + 1);
                } else if (i - prevPage !== 1) {
                    pagesWithEllipsis.push('...');
                }
            }
            pagesWithEllipsis.push(i);
            prevPage = i;
        }

        return pagesWithEllipsis;
    };

    const pages = getPageNumbers();

    return (
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center p-3 border-top bg-light gap-2">
            <div className="text-muted fs-7">
                Hiển thị trang <span className="fw-semibold text-dark">{currentPage}</span> / {totalPages} (Tổng <span className="fw-semibold text-primary">{totalElements}</span> bản ghi)
            </div>

            <Pagination className="mb-0 fs-7">
                <Pagination.First
                    disabled={currentPage <= 1}
                    onClick={() => onPageChange(1)}
                />
                <Pagination.Prev
                    disabled={currentPage <= 1}
                    onClick={() => onPageChange(currentPage - 1)}
                />

                {pages.map((p, index) => {
                    if (p === '...') {
                        return <Pagination.Ellipsis key={`ellipsis-${index}`} disabled />;
                    }
                    return (
                        <Pagination.Item
                            key={p}
                            active={p === currentPage}
                            onClick={() => onPageChange(p)}
                        >
                            {p}
                        </Pagination.Item>
                    );
                })}

                <Pagination.Next
                    disabled={currentPage >= totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                />
                <Pagination.Last
                    disabled={currentPage >= totalPages}
                    onClick={() => onPageChange(totalPages)}
                />
            </Pagination>
        </div>
    );
}
