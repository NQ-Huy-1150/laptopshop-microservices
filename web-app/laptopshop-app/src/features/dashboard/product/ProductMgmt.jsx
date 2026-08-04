import { Row, Col, Button, Table, Container, Badge, Pagination, Modal, Form, InputGroup, Spinner, Card, Nav } from 'react-bootstrap';
import { useState } from 'react';
import { useLoaderData, useSearchParams, useNavigate } from 'react-router-dom';
import ProductModal from './Modal';
import BrandMgmt from './BrandMgmt';
import CategoryMgmt from './CategoryMgmt';
import { updateStock } from '../../../services/InventoryService';
import { deleteProduct } from '../../../services/ProductService';

export default function ProductMgmtView() {
    const navigate = useNavigate();

    // Modal Thêm Mới / Chỉnh Sửa Sản Phẩm
    const [showProductModal, setShowProductModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const [showOptionModal, setShowOptionModal] = useState(false);

    const [showStockModal, setShowStockModal] = useState(false);
    const [currentStock, setCurrentStock] = useState(0);
    const [adjustmentType, setAdjustmentType] = useState('ADD');
    const [adjustmentQty, setAdjustmentQty] = useState(1);
    const [adjustmentReason, setAdjustmentReason] = useState('');
    const [isUpdatingStock, setIsUpdatingStock] = useState(false);

    // Modal Xác nhận Xóa Sản Phẩm
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Tab quản lý (products | brands | categories)
    const [activeTab, setActiveTab] = useState('products');

    // Dynamic URL Search Params cho Phân Trang
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = Number(searchParams.get("page")) || 1;
    const pageSize = Number(searchParams.get("size")) || 5;

    // Lấy dữ liệu từ loader
    const payload = useLoaderData() || {};
    const productData = payload.products;

    const products = Array.isArray(productData)
        ? productData
        : (Array.isArray(productData?.data)
            ? productData.data
            : (Array.isArray(productData?.content) ? productData.content : []));

    const totalPages = productData?.totalPages ?? productData?.totalPage ?? 1;
    const totalElements = productData?.totalElements ?? productData?.totalItems ?? products.length;
    const inventories = Array.isArray(payload.inventories) ? payload.inventories : [];
    const brands = Array.isArray(payload.brands) ? payload.brands : [];
    const categories = Array.isArray(payload.categories) ? payload.categories : [];

    const handleOpenAddModal = () => {
        setSelectedProduct(null);
        setShowProductModal(true);
    };

    const handleOpenOptionModal = (product) => {
        setSelectedProduct(product);
        setShowOptionModal(true);
    };

    const handleOpenStockModal = () => {
        setShowOptionModal(false);
        const inv = inventories.find((i) => String(i.productId || i.id) === String(selectedProduct?.id));
        const stockVal = inv ? (inv.stock ?? inv.quantity ?? 0) : 0;
        setCurrentStock(stockVal);
        setAdjustmentType('ADD');
        setAdjustmentQty(1);
        setAdjustmentReason('');
        setShowStockModal(true);
    };

    const handleOpenEditProductModal = () => {
        setShowOptionModal(false);
        setShowProductModal(true);
    };

    // Tính toán số kho dự kiến sau khi điều chỉnh
    const qtyNum = Number(adjustmentQty) || 0;
    let previewStock = currentStock;
    if (adjustmentType === 'ADD') {
        previewStock = currentStock + qtyNum;
    } else if (adjustmentType === 'SUBTRACT') {
        previewStock = Math.max(0, currentStock - qtyNum);
    } else if (adjustmentType === 'OVERRIDE') {
        previewStock = Math.max(0, qtyNum);
    }

    const handleSaveStock = async () => {
        if (!selectedProduct) return;
        try {
            setIsUpdatingStock(true);

            const stockPayload = {
                productId: selectedProduct.id,
                quantity: Number(adjustmentQty),
                updateType: adjustmentType,
                description: adjustmentReason || ''
            };

            await updateStock(stockPayload);
            setShowStockModal(false);
            navigate('.', { replace: true });
        } catch (error) {
            console.error("Lỗi khi điều chỉnh tồn kho:", error);
        } finally {
            setIsUpdatingStock(false);
        }
    };

    const handleOpenDeleteModal = (product) => {
        setSelectedProduct(product);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedProduct) return;
        try {
            setIsDeleting(true);
            await deleteProduct(selectedProduct.id);
            setShowDeleteModal(false);
            navigate('.', { replace: true });
        } catch (error) {
            console.error("Lỗi khi xóa sản phẩm:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    // Chuyển trang động
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setSearchParams({ page: newPage, size: pageSize });
        }
    };

    const formatCurrency = (amount) => {
        if (!amount && amount !== 0) return '0 ₫';
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };


    return (
        <div>
            {/* Thanh Tab Chuyển Đổi Quản Lý */}
            <Nav variant="pills" activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-4 bg-white p-2 rounded shadow-sm border">
                <Nav.Item>
                    <Nav.Link eventKey="products" className="fw-semibold px-3 py-2">
                        Sản Phẩm ({totalElements})
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="brands" className="fw-semibold px-3 py-2">
                        Hãng Sản Xuất ({brands.length})
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="categories" className="fw-semibold px-3 py-2">
                        Phân Loại ({categories.length})
                    </Nav.Link>
                </Nav.Item>
            </Nav>

            {/* Nội dung Tab Hãng */}
            {activeTab === 'brands' && <BrandMgmt brands={brands} />}

            {/* Nội dung Tab Phân Loại */}
            {activeTab === 'categories' && <CategoryMgmt categories={categories} />}

            {/* Nội dung Tab Sản Phẩm */}
            {activeTab === 'products' && (
                <>
                    {/* Header Quản Lý Sản Phẩm */}
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h4 className="fw-bold text-dark mb-1">Quản lý sản phẩm</h4>
                            <p className="text-muted mb-0 fs-7">
                                Tổng số: <span className="fw-semibold text-primary">{totalElements}</span> sản phẩm (Trang {currentPage}/{totalPages})
                            </p>
                        </div>
                        <Button onClick={handleOpenAddModal} variant="primary" className="d-flex align-items-center gap-2 shadow-sm fs-7">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                            </svg>
                            Thêm sản phẩm
                        </Button>
                    </div>

                    {/* 1. Modal Thêm mới / Cập nhật Sản phẩm (Dùng chung) */}
                    <ProductModal
                        show={showProductModal}
                        handleClose={() => {
                            setShowProductModal(false);
                            setSelectedProduct(null);
                            navigate('.', { replace: true });
                        }}
                        productData={selectedProduct}
                    />

                    {/* 2. Modal Lựa chọn Thao tác (Option Modal) */}
                    <Modal show={showOptionModal} onHide={() => setShowOptionModal(false)} centered>
                        <Modal.Header closeButton>
                            <Modal.Title className="fs-6 fw-bold">
                                Tùy Chọn Chỉnh Sửa #{selectedProduct?.id}
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="p-4 text-center">
                            <h6 className="fw-bold mb-1">{selectedProduct?.name}</h6>
                            <p className="text-muted fs-7 mb-4">Vui lòng chọn loại thao tác bạn muốn thực hiện:</p>

                            <div className="d-grid gap-3">
                                <Button
                                    variant="outline-primary"
                                    size="lg"
                                    className="p-3 text-start d-flex align-items-center gap-3 border-2 shadow-sm"
                                    onClick={handleOpenStockModal}
                                >
                                    <span className="fs-3">📦</span>
                                    <div>
                                        <div className="fw-bold">Điều chỉnh Tồn kho (Update Stock)</div>
                                        <div className="fs-7 text-muted">Nhập thêm, giảm hỏng hóc hoặc kiểm kê lại số lượng kho</div>
                                    </div>
                                </Button>

                                <Button
                                    variant="outline-success"
                                    size="lg"
                                    className="p-3 text-start d-flex align-items-center gap-3 border-2 shadow-sm"
                                    onClick={handleOpenEditProductModal}
                                >
                                    <span className="fs-3">📝</span>
                                    <div>
                                        <div className="fw-bold">Cập nhật Thông tin Sản phẩm (Update Product)</div>
                                        <div className="fs-7 text-muted">Sửa tên, giá, cấu hình, hãng, phân loại, mô tả, ảnh</div>
                                    </div>
                                </Button>
                            </div>
                        </Modal.Body>
                    </Modal>

                    {/* 3. Modal Điều Chỉnh Tồn Kho */}
                    <Modal show={showStockModal} onHide={() => setShowStockModal(false)} centered>
                        <Modal.Header closeButton className="bg-light">
                            <Modal.Title className="fs-6 fw-bold">
                                📦 Điều Chỉnh Tồn Kho
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="p-4">
                            {/* Thẻ thông tin sản phẩm */}
                            <Card className="bg-light border-0 mb-3 p-3">
                                <div className="fw-bold text-dark fs-6 mb-1">{selectedProduct?.name}</div>
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="text-muted fs-7">Mã sản phẩm: #{selectedProduct?.id}</span>
                                    <span className="fs-7">
                                        Tồn kho hiện tại: <Badge bg="secondary" className="fs-7">{currentStock} sản phẩm</Badge>
                                    </span>
                                </div>
                            </Card>

                            <Form>
                                {/* Chọn Loại Điều Chỉnh (ADD | SUBTRACT | OVERRIDE) */}
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-semibold text-secondary fs-7 uppercase">Loại điều chỉnh:</Form.Label>
                                    <div className="d-flex flex-column gap-2 mt-1">
                                        <Form.Check
                                            type="radio"
                                            id="type-add"
                                            name="updateType"
                                            label="Nhập thêm hàng (ADD)"
                                            checked={adjustmentType === 'ADD'}
                                            onChange={() => setAdjustmentType('ADD')}
                                            className="fw-semibold text-success fs-7"
                                        />
                                        <Form.Check
                                            type="radio"
                                            id="type-subtract"
                                            name="updateType"
                                            label="Giảm (hỏng / thất thoát) (SUBTRACT)"
                                            checked={adjustmentType === 'SUBTRACT'}
                                            onChange={() => setAdjustmentType('SUBTRACT')}
                                            className="fw-semibold text-danger fs-7"
                                        />
                                        <Form.Check
                                            type="radio"
                                            id="type-override"
                                            name="updateType"
                                            label="Kiểm kê lại (OVERRIDE)"
                                            checked={adjustmentType === 'OVERRIDE'}
                                            onChange={() => setAdjustmentType('OVERRIDE')}
                                            className="fw-semibold text-primary fs-7"
                                        />
                                    </div>
                                </Form.Group>

                                {/* Ô nhập số lượng */}
                                <Row className="mb-3">
                                    <Form.Group as={Col} md="6">
                                        <Form.Label className="fw-semibold">Số lượng</Form.Label>
                                        <InputGroup>
                                            <Form.Control
                                                type="number"
                                                min="1"
                                                value={adjustmentQty}
                                                onChange={(e) => setAdjustmentQty(e.target.value)}
                                                placeholder="Nhập số lượng..."
                                            />
                                            <InputGroup.Text>chiếc</InputGroup.Text>
                                        </InputGroup>
                                    </Form.Group>

                                    {/* Xem trước tồn kho sau khi đổi */}
                                    <Form.Group as={Col} md="6" className="d-flex flex-column justify-content-end">
                                        <div className="p-2 border rounded bg-white text-center">
                                            <div className="fs-7 text-muted">Tồn kho dự kiến sau đổi</div>
                                            <div className="fw-bold fs-5 text-primary">{previewStock} sản phẩm</div>
                                        </div>
                                    </Form.Group>
                                </Row>

                                {/* Lý do điều chỉnh */}
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-semibold">Lý do điều chỉnh (description)</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        value={adjustmentReason}
                                        onChange={(e) => setAdjustmentReason(e.target.value)}
                                        placeholder="Ví dụ: Nhập kho đợt 2, Hàng vỡ móp do vận chuyển, Kiểm kê cuối tháng..."
                                    />
                                </Form.Group>
                            </Form>

                            {/* Nút hành động */}
                            <div className="d-flex justify-content-end gap-2 mt-4 pt-2 border-top">
                                <Button variant="secondary" onClick={() => setShowStockModal(false)} disabled={isUpdatingStock}>
                                    Hủy
                                </Button>
                                <Button variant="primary" onClick={handleSaveStock} disabled={isUpdatingStock || qtyNum < 0}>
                                    {isUpdatingStock ? (
                                        <>
                                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-1" />
                                            Đang lưu...
                                        </>
                                    ) : (
                                        'Xác nhận'
                                    )}
                                </Button>
                            </div>
                        </Modal.Body>
                    </Modal>

                    {/* 4. Modal Xác Nhận Xóa Sản Phẩm */}
                    <Modal show={showDeleteModal} onHide={() => !isDeleting && setShowDeleteModal(false)} centered size="sm">
                        <Modal.Header className="border-0 pb-0">
                        </Modal.Header>
                        <Modal.Body className="text-center px-4 pb-2">
                            <h6 className="fw-bold text-dark mb-1">Xác nhận xóa sản phẩm?</h6>
                            <p className="text-muted fs-7 mb-2">
                                <span className="fw-semibold text-dark">{selectedProduct?.name}</span>
                            </p>
                            <div className="d-flex align-items-center justify-content-center gap-1 mb-3"
                                style={{ background: '#fef3c7', borderRadius: '8px', padding: '8px 12px' }}>
                                <span>⚠️</span>
                                <span className="fs-7 text-warning-emphasis fw-semibold">
                                    Hành động này không thể đảo ngược!
                                </span>
                            </div>
                            <p className="text-muted" style={{ fontSize: '12px' }}>
                                Sau khi xóa, trạng thái của sản phẩm sẽ không thể thay đổi, sản phẩm cũng sẽ bị ẩn khỏi trang chủ.
                            </p>
                        </Modal.Body>
                        <Modal.Footer className="border-0 pt-0 d-flex gap-2 px-4 pb-4">
                            <Button
                                variant="outline-secondary"
                                className="flex-fill"
                                onClick={() => setShowDeleteModal(false)}
                                disabled={isDeleting}
                            >
                                Hủy
                            </Button>
                            <Button
                                variant="danger"
                                className="flex-fill"
                                onClick={handleConfirmDelete}
                                disabled={isDeleting}
                            >
                                {isDeleting ? (
                                    <><Spinner as="span" animation="border" size="sm" className="me-1" />Đang xóa...</>
                                ) : (
                                    'Xóa sản phẩm'
                                )}
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    {/* Bảng Danh Sách Sản Phẩm */}
                    <Container fluid className="px-0">
                        <Row>
                            <Col xs={12}>
                                <div className="bg-white rounded shadow-sm border overflow-hidden">
                                    <Table responsive hover className="align-middle mb-0">
                                        <thead className="bg-light text-secondary fs-7 text-uppercase">
                                            <tr>
                                                <th style={{ width: '80px' }} className="ps-3 py-3">Mã SP</th>
                                                <th style={{ width: '70px' }} className="py-3">Ảnh</th>
                                                <th className="py-3">Tên Sản Phẩm</th>
                                                <th className="py-3">Hãng</th>
                                                <th className="py-3 text-end">Giá Bán</th>
                                                <th className="py-3 text-center">Tồn Kho</th>
                                                <th className="py-3 text-center">Xuất Hàng</th>
                                                <th className="py-3 text-center">Trạng Thái</th>
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
                                                    const mainImg = product.mainImage || product.images?.[0] || 'https://via.placeholder.com/50';

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
                                                                    {product.brandId || 'Khác'}
                                                                </Badge>
                                                            </td>
                                                            <td className="fw-bold text-danger text-end">
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
                                                            <td className="text-center">
                                                                {product.status === 'ACTIVE'
                                                                    ? <Badge bg="success">Hoạt động</Badge>
                                                                    : product.status === 'INACTIVE'
                                                                        ? <Badge bg="danger">Ngừng bán</Badge>
                                                                        : <Badge bg="secondary">{product.status ?? 'N/A'}</Badge>
                                                                }
                                                            </td>
                                                            <td className="text-center pe-3">
                                                                <div className="d-flex justify-content-center gap-1">
                                                                    <Button
                                                                        variant="outline-primary"
                                                                        size="sm"
                                                                        className="p-1 px-2"
                                                                        title="Chỉnh sửa"
                                                                        onClick={() => handleOpenOptionModal(product)}
                                                                    >
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                                                                            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
                                                                        </svg>
                                                                    </Button>
                                                                    <Button variant="outline-danger" size="sm" className="p-1 px-2" title="Xóa"
                                                                        onClick={() => handleOpenDeleteModal(product)}
                                                                    >
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                                                                            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
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

                                    {/* Bộ Phân Trang React-Bootstrap Động */}
                                    {totalPages > 1 && (
                                        <div className="d-flex justify-content-between align-items-center p-3 border-top bg-light">
                                            <div className="text-muted fs-7">
                                                Hiển thị trang <span className="fw-semibold">{currentPage}</span> / {totalPages}
                                            </div>
                                            <Pagination className="mb-0">
                                                <Pagination.First
                                                    disabled={currentPage === 1}
                                                    onClick={() => handlePageChange(1)}
                                                />
                                                <Pagination.Prev
                                                    disabled={currentPage === 1}
                                                    onClick={() => handlePageChange(currentPage - 1)}
                                                />

                                                {[...Array(totalPages)].map((_, idx) => {
                                                    const pageNum = idx + 1;
                                                    return (
                                                        <Pagination.Item
                                                            key={pageNum}
                                                            active={pageNum === currentPage}
                                                            onClick={() => handlePageChange(pageNum)}
                                                        >
                                                            {pageNum}
                                                        </Pagination.Item>
                                                    );
                                                })}

                                                <Pagination.Next
                                                    disabled={currentPage === totalPages}
                                                    onClick={() => handlePageChange(currentPage + 1)}
                                                />
                                                <Pagination.Last
                                                    disabled={currentPage === totalPages}
                                                    onClick={() => handlePageChange(totalPages)}
                                                />
                                            </Pagination>
                                        </div>
                                    )}
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </>
            )}
        </div>
    );
}