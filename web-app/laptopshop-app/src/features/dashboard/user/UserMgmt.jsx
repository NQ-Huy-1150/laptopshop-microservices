import { Row, Col, Button, Table, Container, Badge, Pagination, Modal, Form, InputGroup, Spinner, Card } from 'react-bootstrap';
export default function UserDashBoard() {
    return (
        <div>
            {/* Header Quản Lý Sản Phẩm */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="fw-bold text-dark mb-1">Quản lý người dùng</h4>
                    <p className="text-muted mb-0 fs-7">

                    </p>
                </div>
                <Button variant="primary" className="d-flex align-items-center gap-2 shadow-sm fs-7">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                    </svg>
                    Thêm sản phẩm
                </Button>
            </div>
        </div>
    );
}