import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Container, Card, Form, InputGroup, Breadcrumb, Toast, ToastContainer } from 'react-bootstrap';
import { useLoaderData, useNavigate, Link } from 'react-router-dom';
import CartDetailCard from './CartDetail';

export default function Cart() {
    const payload = useLoaderData();
    const navigate = useNavigate();


    const [cartDetails, setCartDetails] = useState([]);
    const [itemMap, setItemMap] = useState({});
    const [voucherCode, setVoucherCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [showToast, setShowToast] = useState(false);
    const [toastMsg, setToastMsg] = useState('');

    useEffect(() => {
        const details = Array.isArray(payload?.cartDetails) ? payload.cartDetails : [];
        setCartDetails(details);
    }, [payload]);

    const handleItemUpdate = (id, price, quantity) => {
        setItemMap(prev => ({
            ...prev,
            [id]: { price, quantity, subtotal: price * quantity }
        }));
    };

    const handleItemDelete = (id) => {
        setCartDetails(prev => prev.filter(item => item.id !== id));
        setItemMap(prev => {
            const nextMap = { ...prev };
            delete nextMap[id];
            return nextMap;
        });
        setToastMsg('Đã xóa sản phẩm khỏi giỏ hàng.');
        setShowToast(true);
    };

    const rawTotalPrice = Object.values(itemMap).reduce((sum, item) => sum + (item.subtotal || 0), 0);
    const finalTotalPrice = Math.max(0, rawTotalPrice - discount);

    const formatCurrency = (amount) => {
        if (!amount && amount !== 0) return '0 ₫';
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const handleApplyVoucher = (e) => {
        e.preventDefault();
        if (!voucherCode.trim()) return;

        if (voucherCode.trim().toUpperCase() === 'LAPTOPSHOP') {
            const discAmount = 500000;
            setDiscount(discAmount);
            setToastMsg('Áp dụng mã LAPTOPSHOP thành công! Giảm 500.000 ₫');
        } else {
            setToastMsg('Mã giảm giá không hợp lệ hoặc đã hết hạn.');
        }
        setShowToast(true);
    };

    const handleCheckout = () => {
        setToastMsg('Đang khởi tạo đơn hàng & chuyển hướng sang trang Đặt Hàng...');
        setShowToast(true);
        // Có thể navigate sang /checkout hoặc trigger API order tại đây
    };

    if (!payload || cartDetails.length === 0) {
        return (
            <Container fluid className="px-lg-5 py-5 text-center">
                <Card className="border-0 shadow-sm rounded-3 p-5 bg-white max-w-md mx-auto" style={{ maxWidth: '600px' }}>
                    <div className="mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" fill="currentColor" className="text-muted" viewBox="0 0 16 16">
                            <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 13H4a.5.5 0 0 1-.491-.408L1.01 2H.5a.5.5 0 0 1-.5-.5zM3.102 5l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                        </svg>
                    </div>
                    <h4 className="fw-bold text-dark mb-2">Giỏ hàng của bạn đang trống</h4>
                    <p className="text-muted fs-7 mb-4">Hãy chọn thêm sản phẩm chất lượng để tiếp tục mua sắm nhé!</p>
                    <div>
                        <Button variant="primary" size="lg" className="px-4 fw-bold shadow-sm" onClick={() => navigate('/')}>
                            Quay lại trang chủ
                        </Button>
                    </div>
                </Card>
            </Container>
        );
    }

    return (
        <Container fluid className="px-lg-5 py-4">
            <Breadcrumb className="mb-3 fs-7">
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>Trang chủ</Breadcrumb.Item>
                <Breadcrumb.Item active>Giỏ hàng của tôi</Breadcrumb.Item>
            </Breadcrumb>

            <div className="mb-4">
                <h3 className="fw-bold text-dark m-0">🛒 Giỏ Hàng Của Bạn</h3>
                <span className="text-muted fs-7">Bạn đang có <strong>{cartDetails.length}</strong> loại sản phẩm trong giỏ</span>
            </div>

            <Row className="g-4">
                <Col xs={12} lg={8}>
                    <div className="mb-3">
                        {cartDetails.map(cartDetail => (
                            <CartDetailCard
                                key={cartDetail.id}
                                cartDetail={cartDetail}
                                onItemUpdate={handleItemUpdate}
                                onItemDelete={handleItemDelete}
                            />
                        ))}
                    </div>

                    <div className="d-flex justify-content-between align-items-center mt-3">
                        <Button
                            variant="outline-primary"
                            className="fw-semibold d-flex align-items-center gap-2 fs-7"
                            onClick={() => navigate('/')}
                        >
                            ← Tiếp tục xem sản phẩm khác
                        </Button>
                    </div>
                </Col>

                <Col xs={12} lg={4}>
                    <div className="position-sticky" style={{ top: '20px' }}>
                        <Card className="border-0 shadow-sm rounded-3 p-4 bg-white mb-3">
                            <h5 className="fw-bold text-dark border-bottom pb-3 mb-3">
                                Tóm Tắt Đơn Hàng
                            </h5>

                            <div className="d-flex justify-content-between text-secondary fs-7 mb-2">
                                <span>Tạm tính ({cartDetails.length} sản phẩm):</span>
                                <span className="fw-semibold text-dark">{formatCurrency(rawTotalPrice)}</span>
                            </div>

                            <div className="d-flex justify-content-between text-secondary fs-7 mb-2">
                                <span>Phí vận chuyển:</span>
                                <span className="fw-semibold text-success">Miễn phí 🚚</span>
                            </div>

                            {discount > 0 && (
                                <div className="d-flex justify-content-between text-danger fs-7 mb-2">
                                    <span>Giảm giá Voucher:</span>
                                    <span className="fw-bold">-{formatCurrency(discount)}</span>
                                </div>
                            )}

                            <Form onSubmit={handleApplyVoucher} className="my-3">
                                <Form.Label className="fs-8 fw-bold text-uppercase text-muted">Mã Khuyến Mãi / Voucher</Form.Label>
                                <InputGroup size="sm">
                                    <Form.Control
                                        placeholder="Nhập LAPTOPSHOP..."
                                        value={voucherCode}
                                        onChange={(e) => setVoucherCode(e.target.value)}
                                    />
                                    <Button variant="outline-primary" type="submit" className="fw-semibold">
                                        Áp dụng
                                    </Button>
                                </InputGroup>
                            </Form>

                            <hr className="my-3" />

                            <div className="d-flex justify-content-between align-items-baseline mb-3">
                                <div>
                                    <span className="fw-bold text-dark fs-6">Tổng tiền thanh toán:</span>
                                    <div className="text-muted fs-8">(Đã bao gồm VAT)</div>
                                </div>
                                <h3 className="fw-bold text-danger mb-0 fs-3">
                                    {formatCurrency(finalTotalPrice)}
                                </h3>
                            </div>

                            <Button
                                variant="danger"
                                size="lg"
                                className="w-100 fw-bold py-2.5 shadow-sm d-flex align-items-center justify-content-center gap-2"
                                onClick={handleCheckout}
                            >
                                TIẾN HÀNH ĐẶT HÀNG
                            </Button>
                        </Card>

                        <Card className="border-0 shadow-sm rounded-3 p-3 bg-light fs-7 text-muted">
                            <div className="d-flex align-items-center gap-2 mb-2">
                                <span>🚚</span>
                                <span>Giao hàng nhanh toàn quốc</span>
                            </div>
                            <div className="d-flex align-items-center gap-2 mb-2">
                                <span>🛡️</span>
                                <span>Kiểm tra hàng trước khi thanh toán</span>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                                <span>🔄</span>
                                <span>Đổi trả dễ dàng trong vòng 30 ngày</span>
                            </div>
                        </Card>
                    </div>
                </Col>
            </Row>

            {/* Notification Toast */}
            <ToastContainer position="top-end" className="p-3 position-fixed top-0 end-0" style={{ zIndex: 9999, marginTop: '65px' }}>
                <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide bg="dark">
                    <Toast.Header>
                        <strong className="me-auto text-primary">Giỏ hàng</strong>
                        <small>Vừa xong</small>
                    </Toast.Header>
                    <Toast.Body className="text-white fs-7">{toastMsg}</Toast.Body>
                </Toast>
            </ToastContainer>
        </Container>
    );
}