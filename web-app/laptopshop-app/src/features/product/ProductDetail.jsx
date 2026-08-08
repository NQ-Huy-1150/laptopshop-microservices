import React, { useState } from 'react';
import { useLoaderData, useNavigate, Link } from 'react-router-dom';
import { Row, Col, Container, Badge, Button, Card, Tab, Tabs, Form, Breadcrumb, Toast, ToastContainer } from 'react-bootstrap';
import { addProductToCart } from '../../services/CartService';
import { isLogin } from '../../services/AuthenticationService';

export default function ProductDetailApp() {
    const navigate = useNavigate();
    const payload = useLoaderData() || {};
    const product = payload?.product ?? null;
    const inventory = payload?.inventory ?? null;

    const imagesList = Array.isArray(product?.images) && product.images.length > 0
        ? product.images
        : (product?.mainImage ? [product.mainImage] : ['/assets/react.svg']);

    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastVariant, setToastVariant] = useState('dark');

    const stock = Number(inventory?.stock ?? 0);
    const isAvailable = stock > 0;

    const formatCurrency = (amount) => {
        if (!amount && amount !== 0) return '0 ₫';
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const handleQuantityChange = (delta) => {
        setQuantity(prev => {
            const nextQty = prev + delta;
            if (nextQty < 1) return 1;
            if (nextQty > stock) return stock;
            return nextQty;
        });
    };

    const handleAddToCart = async () => {
        if (!isLogin()) {
            setToastVariant('warning');
            setToastMessage('Vui lòng đăng nhập sử dụng tính năng này !');
            setShowToast(true);
            return;
        }

        try {
            await addProductToCart(product, quantity);
            setToastVariant('success');
            setToastMessage(`🛒 Đã thêm ${quantity} x ${product?.name} vào giỏ hàng thành công!`);
            setShowToast(true);
        } catch (error) {
            console.error("Lỗi khi thêm vào giỏ hàng:", error);
            setToastVariant('danger');
            setToastMessage('Có lỗi xảy ra khi thêm vào giỏ hàng.');
            setShowToast(true);
        }
    };

    const handleBuyNow = async () => {
        if (!isLogin()) {
            setToastVariant('warning');
            setToastMessage('Vui lòng đăng nhập sử dụng tính năng này !');
            setShowToast(true);
            return;
        }

        try {
            await addProductToCart(product, quantity);
            navigate('/cart');
        } catch (error) {
            console.error("Lỗi mua ngay:", error);
        }
    };

    if (!product) {
        return (
            <Container className="my-5 text-center py-5">
                <h4 className="text-muted">Không tìm thấy thông tin sản phẩm này.</h4>
                <Button variant="primary" className="mt-3" onClick={() => navigate('/')}>
                    Quay lại trang chủ
                </Button>
            </Container>
        );
    }

    return (
        <Container fluid className="px-lg-5 py-4">
            <Breadcrumb className="mb-3 fs-7">
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>
                    Trang chủ
                </Breadcrumb.Item>
                <Breadcrumb.Item active>Chi tiết sản phẩm</Breadcrumb.Item>
                <Breadcrumb.Item active>{product.name}</Breadcrumb.Item>
            </Breadcrumb>

            <Row className="g-4 mb-5">
                <Col xs={12} lg={7}>
                    <Card className="border-0 shadow-sm rounded-3 p-3 bg-white mb-3">
                        <div
                            className="position-relative d-flex justify-content-center align-items-center bg-light rounded-3 overflow-hidden"
                            style={{ height: '420px' }}
                        >
                            <img
                                src={imagesList[selectedImageIndex] || imagesList[0]}
                                alt={product.name}
                                className="img-fluid"
                                style={{ maxHeight: '380px', objectFit: 'contain' }}
                            />
                            <Badge
                                bg={isAvailable ? 'success' : 'danger'}
                                className="position-absolute top-0 start-0 m-3 px-3 py-2 fs-7 shadow-sm"
                            >
                                {isAvailable ? `🟢 Còn hàng (${stock} sp)` : '🔴 Hết hàng'}
                            </Badge>
                        </div>

                        {imagesList.length > 1 && (
                            <div className="d-flex gap-2 mt-3 overflow-auto pb-2 justify-content-center">
                                {imagesList.map((imgUrl, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => setSelectedImageIndex(idx)}
                                        className={`rounded-2 p-1 border cursor-pointer transition-all ${idx === selectedImageIndex ? 'border-primary border-2 shadow-sm' : 'border-light bg-light opacity-75'}`}
                                        style={{ width: '75px', height: '75px', cursor: 'pointer' }}
                                    >
                                        <img
                                            src={imgUrl}
                                            alt={`thumbnail-${idx}`}
                                            className="w-100 h-100"
                                            style={{ objectFit: 'cover', borderRadius: '4px' }}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>

                    <Card className="border-0 shadow-sm rounded-3 p-3 bg-white">
                        <h6 className="fw-bold text-dark mb-3">🛡️ Quyền lợi & Chính sách mua hàng</h6>
                        <Row className="g-3 fs-7 text-muted">
                            <Col xs={6} md={3} className="d-flex align-items-center gap-2">
                                <span className="fs-5">🚚</span>
                                <div>Giao hàng miễn phí toàn quốc</div>
                            </Col>
                            <Col xs={6} md={3} className="d-flex align-items-center gap-2">
                                <span className="fs-5">🔰</span>
                                <div>Bảo hành chính hãng 24 tháng</div>
                            </Col>
                            <Col xs={6} md={3} className="d-flex align-items-center gap-2">
                                <span className="fs-5">🔄</span>
                                <div>1 đổi 1 trong 30 ngày lỗi NSX</div>
                            </Col>
                            <Col xs={6} md={3} className="d-flex align-items-center gap-2">
                                <span className="fs-5">🎁</span>
                                <div>Tặng Balo Laptop & Chuột cao cấp</div>
                            </Col>
                        </Row>
                    </Card>
                </Col>

                <Col xs={12} lg={5}>
                    <div className="bg-white p-4 rounded-3 shadow-sm h-100 d-flex flex-column justify-content-between">
                        <div>
                            <div className="mb-2 d-flex align-items-center gap-2">
                                <Badge bg="primary" className="px-2.5 py-1.5 fw-semibold fs-8 text-uppercase">
                                    Laptop Chính Hãng
                                </Badge>
                                {product.brandName && (
                                    <Badge bg="secondary" className="px-2.5 py-1.5 fw-semibold fs-8">
                                        {product.brandName}
                                    </Badge>
                                )}
                            </div>

                            <h2 className="fw-bold text-dark mb-2 fs-3">
                                {product.name}
                            </h2>

                            {product.specs && (
                                <div className="p-3 bg-light rounded-3 mb-3 border">
                                    <div className="text-uppercase text-muted fs-8 fw-bold mb-1">Cấu hình</div>
                                    <p className="mb-0 text-secondary fs-7 fw-medium lh-base">
                                        {product.specs}
                                    </p>
                                </div>
                            )}

                            <div className="p-3 rounded-3 bg-danger bg-opacity-10 border border-danger border-opacity-25 mb-4">
                                <div className="text-muted fs-8">Giá ưu đãi đặc biệt</div>
                                <div className="d-flex align-items-baseline gap-2">
                                    <h2 className="fw-bold text-danger mb-0 fs-2">
                                        {formatCurrency(product.price)}
                                    </h2>
                                    <span className="text-muted fs-7">(Đã bao gồm VAT)</span>
                                </div>
                            </div>

                            {isAvailable && (
                                <div className="mb-4">
                                    <label className="fw-semibold text-dark fs-7 mb-2 d-block">
                                        Số lượng mua:
                                    </label>
                                    <div className="d-flex align-items-center gap-2">
                                        <div className="input-group" style={{ width: '130px' }}>
                                            <Button
                                                variant="outline-secondary"
                                                size="sm"
                                                onClick={() => handleQuantityChange(-1)}
                                                disabled={quantity <= 1}
                                            >
                                                -
                                            </Button>
                                            <Form.Control
                                                className="text-center fw-bold fs-6"
                                                value={quantity}
                                                readOnly
                                            />
                                            <Button
                                                variant="outline-secondary"
                                                size="sm"
                                                onClick={() => handleQuantityChange(1)}
                                                disabled={quantity >= stock}
                                            >
                                                +
                                            </Button>
                                        </div>
                                        <span className="text-muted fs-7">
                                            (Còn lại <strong className="text-dark">{stock}</strong> sản phẩm trong kho)
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="pt-3 border-top mt-3">
                            {isAvailable ? (
                                <div className="d-grid gap-2">
                                    <Button
                                        variant="primary"
                                        size="lg"
                                        className="fw-bold py-2.5 d-flex align-items-center justify-content-center gap-2 shadow-sm"
                                        onClick={handleAddToCart}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 13H4a.5.5 0 0 1-.491-.408L1.01 2H.5a.5.5 0 0 1-.5-.5zM3.102 5l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                                        </svg>
                                        Thêm Vào Giỏ Hàng
                                    </Button>

                                    <Button
                                        variant="danger"
                                        size="lg"
                                        className="fw-bold py-2.5 shadow-sm"
                                        onClick={handleBuyNow}
                                    >
                                        ⚡ Mua Ngay (Giao Hàng Tận Nơi)
                                    </Button>
                                </div>
                            ) : (
                                <Button variant="secondary" size="lg" disabled className="w-100 py-2.5 fw-bold">
                                    Sản Phẩm Tạm Hết Hàng
                                </Button>
                            )}

                            <Button
                                variant="link"
                                className="w-100 text-muted fs-7 mt-2 text-decoration-none"
                                onClick={() => navigate(-1)}
                            >
                                ← Quay lại danh sách sản phẩm
                            </Button>
                        </div>
                    </div>
                </Col>
            </Row>

            <Row className="mb-5">
                <Col xs={12}>
                    <Card className="border-0 shadow-sm rounded-3 bg-white p-4">
                        <Tabs defaultActiveKey="description" id="product-detail-tabs" className="mb-4">
                            <Tab eventKey="description" title="Mô Tả Chi Tiết">
                                <div className="p-2 text-secondary fs-7 lh-lg">
                                    {product.description ? (
                                        <div style={{ whitespace: 'pre-line' }}>{product.description}</div>
                                    ) : (
                                        <p>
                                            Sản phẩm <strong>{product.name}</strong> được trang bị cấu hình vượt trội ({product.specs}), mang lại trải nghiệm đỉnh cao cho cả công việc và giải trí. Thiết kế hiện đại, mỏng nhẹ đẳng cấp cùng chế độ bảo hành uy tín 24 tháng chính hãng.
                                        </p>
                                    )}
                                </div>
                            </Tab>

                            <Tab eventKey="specs" title="Thông Số Kỹ Thuật">
                                <div className="p-2">
                                    <table className="table table-striped table-hover align-middle fs-7 mb-0">
                                        <tbody>
                                            <tr>
                                                <th style={{ width: '30%' }}>Tên Sản Phẩm</th>
                                                <td>{product.name}</td>
                                            </tr>
                                            <tr>
                                                <th>Cấu Hình Chi Tiết</th>
                                                <td>{product.specs || 'N/A'}</td>
                                            </tr>
                                            <tr>
                                                <th>Tình Trạng Kho</th>
                                                <td>{isAvailable ? `Còn hàng (${stock} sản phẩm)` : 'Hết hàng'}</td>
                                            </tr>
                                            <tr>
                                                <th>Bảo Hành</th>
                                                <td>24 Tháng Chính Hãng</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </Tab>

                            <Tab eventKey="warranty" title="Chính Sách Bảo Hành & Đổi Trả">
                                <div className="p-3 text-secondary fs-7 lh-lg">
                                    <h6 className="fw-bold text-dark mb-2">Chính sách bảo hành tại LaptopShop:</h6>
                                    <ul>
                                        <li>Bảo hành 24 tháng chính hãng áp dụng trên toàn quốc.</li>
                                        <li>1 đổi 1 trong vòng 30 ngày đầu tiên nếu sản phẩm phát sinh lỗi từ nhà sản xuất.</li>
                                        <li>Hỗ trợ cài đặt phần mềm và vệ sinh laptop miễn phí trọn đời sản phẩm.</li>
                                    </ul>
                                </div>
                            </Tab>
                        </Tabs>
                    </Card>
                </Col>
            </Row>

            {/* Notification Toast */}
            <ToastContainer position="top-end" className="p-3 position-fixed top-0 end-0" style={{ zIndex: 9999, marginTop: '65px' }}>
                <Toast show={showToast} onClose={() => setShowToast(false)} delay={3500} autohide bg={toastVariant}>
                    <Toast.Header>
                        <strong className="me-auto text-primary">Thông báo</strong>
                        <small>Vừa xong</small>
                    </Toast.Header>
                    <Toast.Body className={`fs-7 fw-semibold ${toastVariant === 'warning' ? 'text-dark' : 'text-white'}`}>
                        {toastMessage}
                    </Toast.Body>
                </Toast>
            </ToastContainer>
        </Container>
    );
}