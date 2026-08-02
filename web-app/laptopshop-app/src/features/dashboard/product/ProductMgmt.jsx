import { Row, Col, Button, Table, Container, Badge } from 'react-bootstrap';
import { useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import ProductModal from './Modal';

export default function ProductMgmtView() {
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const payload = useLoaderData() || {};
    const products = Array.isArray(payload.products) ? payload.products : [];
    const inventories = Array.isArray(payload.inventories) ? payload.inventories : [];

    const formatCurrency = (amount) => {
        if (!amount && amount !== 0) return '0 ₫';
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="fw-bold text-dark mb-1">Quản lý sản phẩm</h4>
                    <p className="text-muted mb-0 fs-7">
                        Tổng số: <span className="fw-semibold text-primary">{products.length}</span> sản phẩm
                    </p>
                </div>
                <Button onClick={handleShow} variant="primary" className="d-flex align-items-center gap-2 shadow-sm fs-7">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                    </svg>
                    Thêm sản phẩm
                </Button>
            </div>

            {/* Modal Thêm Sản Phẩm */}
            <ProductModal show={show} handleClose={handleClose} />

            <Container fluid className="px-0">
                <Row>
                    <Col xs={12}>
                        <div className="bg-white rounded shadow-sm border overflow-hidden">
                            <Table responsive hover className="align-middle mb-0">
                                <thead className="bg-light text-secondary fs-7 text-uppercase">
                                    <tr>
                                        <th style={{ width: '80px' }} className="ps-3 py-3">Mã SP</th>
                                        <th style={{ width: '70px' }}>Ảnh</th>
                                        <th className="py-3">Tên Sản Phẩm</th>
                                        <th className="py-3">Hãng</th>
                                        <th className="py-3 text-end">Giá Bán</th>
                                        <th className="py-3 text-center">Tồn Kho</th>
                                        <th className="py-3 text-center">Xuất Hàng</th>
                                        <th style={{ width: '120px' }} className="py-3 text-center pe-3">Thao Tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.length > 0 ? (
                                        products.map((product) => {
                                            const inventory = inventories.find(
                                                (inv) => String(inv.productId || inv.id) === String(product.id)
                                            );
                                            const stock = inventory ? (inventory.stock ?? inventory.quantity ?? 0) : 0;
                                            const stockIssue = inventory ? (inventory.stockIssue ?? inventory.reserved ?? 0) : 0;
                                            const mainImg = product.mainImage || product.images?.[0];

                                            return (
                                                <tr key={product.id}>
                                                    <td className="ps-3 fw-semibold text-secondary fs-7">
                                                        #{product.id}
                                                    </td>
                                                    <td>
                                                        <img
                                                            src={mainImg}
                                                            alt={product.name}
                                                            className="rounded border"
                                                            style={{ width: '45px', height: '45px', objectFit: 'contain' }}
                                                        />
                                                    </td>
                                                    <td>
                                                        <div className="fw-bold text-dark fs-7 mb-0">{product.name}</div>
                                                        <div className="text-muted small text-truncate" style={{ maxWidth: '300px' }}>
                                                            {product.specs}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <Badge bg="secondary" className="bg-opacity-10 text-secondary border border-secondary border-opacity-25">
                                                            {product.brand || 'Khác'}
                                                        </Badge>
                                                    </td>
                                                    <td className="text-end fw-bold text-danger">
                                                        {formatCurrency(product.price)}
                                                    </td>
                                                    <td className="text-center">
                                                        <Badge bg={stock > 0 ? 'success' : 'danger'} className="px-2 py-1">
                                                            {stock}
                                                        </Badge>
                                                    </td>
                                                    <td className="text-center text-muted fw-semibold fs-7">
                                                        {stockIssue}
                                                    </td>
                                                    <td className="text-center pe-3">
                                                        <div className="d-flex justify-content-center gap-1">
                                                            <Button variant="outline-primary" size="sm" className="p-1 px-2" title="Sửa">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                                                                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
                                                                </svg>
                                                            </Button>
                                                            <Button variant="outline-danger" size="sm" className="p-1 px-2" title="Xóa">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                                                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                                                                </svg>
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="8" className="text-center py-4 text-muted">
                                                Chưa có dữ liệu sản phẩm nào trong hệ thống.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}