import React, { useState, useEffect } from 'react';
import { Row, Col, Container, Card, Form, Button, Badge, Breadcrumb, Modal, Spinner } from 'react-bootstrap';
import { useLoaderData, useNavigate, Link } from 'react-router-dom';
import { getProductById } from '../../services/ProductService';
import { createOrder } from '../../services/OrderService';
import { updateAddress } from '../../services/UserService';

export default function Checkout() {
    const navigate = useNavigate();
    const payload = useLoaderData();
    const cartDetails = Array.isArray(payload?.cartDetails) ? payload.cartDetails : [];

    const [currentUser, setCurrentUser] = useState(null);
    const [recipientName, setRecipientName] = useState('');
    const [recipientPhone, setRecipientPhone] = useState('');
    const [shippingAddress, setShippingAddress] = useState('');
    const [initialAddress, setInitialAddress] = useState('');
    const [isSavingAddress, setIsSavingAddress] = useState(false);
    const [addressSaved, setAddressSaved] = useState(false);
    const [orderNote, setOrderNote] = useState('');
    const [email, setEmail] = useState('');

    const [paymentMethod, setPaymentMethod] = useState('COD');

    const [itemsData, setItemsData] = useState([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    useEffect(() => {
        try {
            const userStr = localStorage.getItem('currentUser');
            if (userStr) {
                const userObj = JSON.parse(userStr);
                setCurrentUser(userObj);

                const fullName = `${userObj.firstname || userObj.firstName || ''} ${userObj.lastname || userObj.lastName || ''}`.trim() || userObj.username || '';
                setRecipientName(fullName);
                setRecipientPhone(userObj.phonenumber || userObj.phoneNumber || '');

                const addr = userObj.address || userObj.adrress || '';
                setShippingAddress(addr);
                setInitialAddress(addr);

                const emailAddress = userObj.email || '';
                setEmail(emailAddress);
            }
        } catch (e) {
            console.error("Lỗi khi đọc currentUser:", e);
        }

        let isMounted = true;
        const fetchCartProducts = async () => {
            setIsLoadingProducts(true);
            try {
                const items = await Promise.all(
                    cartDetails.map(async (item) => {
                        const product = await getProductById(item.productId);
                        return {
                            ...item,
                            product: product,
                            price: product?.price || 0,
                            subtotal: (product?.price || 0) * (item.quantity || 1)
                        };
                    })
                );
                if (isMounted) {
                    setItemsData(items);
                }
            } catch (err) {
                console.error("Lỗi khi tải thông tin sản phẩm đơn hàng:", err);
            } finally {
                if (isMounted) setIsLoadingProducts(false);
            }
        };

        if (cartDetails.length > 0) {
            fetchCartProducts();
        } else {
            setIsLoadingProducts(false);
        }

        return () => {
            isMounted = false;
        };
    }, [payload]);

    const formatCurrency = (amount) => {
        if (!amount && amount !== 0) return '0 ₫';
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const totalAmount = itemsData.reduce((sum, item) => sum + (item.subtotal || 0), 0);

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        if (!shippingAddress.trim()) {
            alert('Vui lòng nhập địa chỉ giao hàng!');
            return;
        }

        try {
            setIsSubmitting(true);
            const orderPayload = {
                email,
                recipientName,
                shippingAddress,
                orderNote,
                paymentMethod,
                totalAmount
            };

            await createOrder(orderPayload);
            setShowSuccessModal(true);
        } catch (error) {
            console.error("Lỗi đặt hàng:", error);
            alert("Lỗi khi tiến hành đặt hàng !");
            setShowSuccessModal(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (cartDetails.length === 0 && !isLoadingProducts) {
        return (
            <Container fluid className="px-lg-5 py-5 text-center">
                <Card className="border-0 shadow-sm rounded-3 p-5 bg-white mx-auto" style={{ maxWidth: '550px' }}>
                    <h4 className="fw-bold text-dark mb-3">Chưa có sản phẩm để thanh toán</h4>
                    <p className="text-muted fs-7 mb-4">Vui lòng thêm sản phẩm vào giỏ hàng trước khi tiến hành đặt hàng.</p>
                    <Button variant="primary" className="fw-bold px-4" onClick={() => navigate('/')}>
                        Quay lại mua sắm
                    </Button>
                </Card>
            </Container>
        );
    }

    const handleUpdateAddress = async () => {
        const trimmed = shippingAddress.trim();
        if (!trimmed || trimmed === initialAddress || isSavingAddress) {
            return;
        }

        try {
            setIsSavingAddress(true);
            await updateAddress(trimmed);
            setInitialAddress(trimmed);
            setAddressSaved(true);
            setTimeout(() => setAddressSaved(false), 3500);
        } catch (error) {
            console.error("Lỗi khi tự động cập nhật địa chỉ:", error);
        } finally {
            setIsSavingAddress(false);
        }
    };

    return (
        <Container fluid className="px-lg-5 py-4">
            <Breadcrumb className="mb-3 fs-7">
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>Trang chủ</Breadcrumb.Item>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/cart' }}>Giỏ hàng</Breadcrumb.Item>
                <Breadcrumb.Item active>Xác nhận đơn hàng & Thanh toán</Breadcrumb.Item>
            </Breadcrumb>

            <div className="mb-4">
                <h3 className="fw-bold text-dark m-0">Xác Nhận Đơn Hàng & Thanh Toán</h3>
                <span className="text-muted fs-7">Kiểm tra thông tin sản phẩm, cập nhật địa chỉ giao hàng và hoàn tất đơn hàng</span>
            </div>

            <Form onSubmit={handlePlaceOrder}>
                <Row className="g-4">
                    <Col xs={12} lg={8}>
                        <div className="mb-4">
                            <h5 className="fw-bold text-dark mb-3">
                                Sản Phẩm Đặt Mua ({cartDetails.length} món)
                            </h5>

                            {isLoadingProducts ? (
                                <Card className="border-0 shadow-sm p-4 text-center bg-white">
                                    <Spinner animation="border" variant="primary" size="sm" />
                                    <div className="text-muted fs-7 mt-2">Đang tải danh sách sản phẩm...</div>
                                </Card>
                            ) : (
                                itemsData.map((item, idx) => (
                                    <Card key={idx} className="mb-3 border-0 shadow-sm p-3 bg-white rounded-3">
                                        <Row className="align-items-center g-3">
                                            <Col xs={4} sm={3} md={2} className="text-center">
                                                <div className="bg-light p-2 rounded-3 border d-flex align-items-center justify-content-center" style={{ height: '85px' }}>
                                                    <img
                                                        src={item.product?.mainImage || '/assets/react.svg'}
                                                        alt={item.product?.name}
                                                        className="img-fluid"
                                                        style={{ maxHeight: '75px', objectFit: 'contain' }}
                                                    />
                                                </div>
                                            </Col>

                                            <Col xs={8} sm={9} md={5}>
                                                <h6 className="fw-bold text-dark mb-1 fs-7 text-truncate-2" title={item.product?.name}>
                                                    {item.product?.name || 'Sản phẩm'}
                                                </h6>
                                                <p className="text-muted fs-8 mb-1 text-truncate" title={item.product?.specs}>
                                                    {item.product?.specs || 'Cấu hình tiêu chuẩn'}
                                                </p>
                                                <div className="d-flex align-items-center gap-2">
                                                    <Badge bg="secondary" className="fw-normal fs-8">
                                                        Số lượng: <strong>{item.quantity}</strong>
                                                    </Badge>
                                                </div>
                                            </Col>

                                            <Col xs={6} md={2} className="text-md-center">
                                                <div className="text-muted fs-8">Đơn giá</div>
                                                <span className="fw-semibold text-dark fs-7">
                                                    {formatCurrency(item.price)}
                                                </span>
                                            </Col>

                                            <Col xs={6} md={3} className="text-end">
                                                <div className="text-muted fs-8">Thành tiền</div>
                                                <span className="fw-bold text-danger fs-6">
                                                    {formatCurrency(item.subtotal)}
                                                </span>
                                            </Col>
                                        </Row>
                                    </Card>
                                ))
                            )}
                        </div>

                        <Card className="border-0 shadow-sm rounded-3 p-4 bg-white mb-4">
                            <h5 className="fw-bold text-dark border-bottom pb-3 mb-3 d-flex align-items-center gap-2">
                                Thông Tin Người Nhận & Địa Chỉ Giao Hàng
                            </h5>

                            <Row className="g-3">
                                <Col xs={12} md={6}>
                                    <Form.Group>
                                        <Form.Label className="fs-7 fw-semibold">Họ và tên người nhận</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={recipientName}
                                            onChange={(e) => setRecipientName(e.target.value)}
                                            disabled
                                            placeholder="Nhập họ tên người nhận..."
                                        />
                                    </Form.Group>
                                </Col>

                                <Col xs={12} md={6}>
                                    <Form.Group>
                                        <Form.Label className="fs-7 fw-semibold">Số điện thoại nhận hàng</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={recipientPhone}
                                            onChange={(e) => setRecipientPhone(e.target.value)}
                                            disabled
                                            placeholder="Nhập số điện thoại liên hệ..."

                                        />
                                    </Form.Group>
                                </Col>

                                <Col xs={12}>
                                    <Form.Group>
                                        <Form.Label className="fs-7 fw-semibold d-flex justify-content-between align-items-center">
                                            <span>Địa chỉ giao hàng</span>
                                            <span className="fs-8 fw-normal">
                                                {isSavingAddress && (
                                                    <span className="text-primary fw-medium">
                                                        <Spinner animation="border" size="sm" className="me-1" />
                                                        Đang lưu địa chỉ...
                                                    </span>
                                                )}
                                                {addressSaved && (
                                                    <span className="text-success fw-bold">
                                                        ✅ Đã lưu địa chỉ mới vào tài khoản!
                                                    </span>
                                                )}
                                                {!isSavingAddress && !addressSaved && (
                                                    <span className="text-muted">*(Click ra ngoài để tự động lưu)*</span>
                                                )}
                                            </span>
                                        </Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={2}
                                            value={shippingAddress}
                                            onChange={(e) => setShippingAddress(e.target.value)}
                                            onBlur={handleUpdateAddress}
                                            required
                                            placeholder="Nhập số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố..."
                                        />
                                    </Form.Group>
                                </Col>

                                <Col xs={12}>
                                    <Form.Group>
                                        <Form.Label className="fs-7 text-muted">Ghi chú cho shipper (Tùy chọn)</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={orderNote}
                                            onChange={(e) => setOrderNote(e.target.value)}
                                            placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi tới..."
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Card>

                        <Card className="border-0 shadow-sm rounded-3 p-4 bg-white mb-4">
                            <h5 className="fw-bold text-dark border-bottom pb-3 mb-3 d-flex align-items-center gap-2">
                                Chọn Phương Thức Thanh Toán
                            </h5>

                            <div className="d-flex flex-column gap-3">
                                {/* Option 1: COD */}
                                <div
                                    className={`p-3 rounded-3 border cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-primary bg-primary bg-opacity-10' : 'bg-light'}`}
                                    onClick={() => setPaymentMethod('COD')}
                                >
                                    <Form.Check
                                        type="radio"
                                        id="payment-cod"
                                        name="paymentMethod"
                                        checked={paymentMethod === 'COD'}
                                        onChange={() => setPaymentMethod('COD')}
                                        label={
                                            <div className="ms-2">
                                                <span className="fw-bold text-dark fs-6 d-block">
                                                    Thanh toán khi nhận hàng (COD)
                                                </span>
                                                <span className="text-muted fs-7">
                                                    Thanh toán tiền mặt trực tiếp cho nhân viên giao hàng khi nhận sản phẩm.
                                                </span>
                                            </div>
                                        }
                                    />
                                </div>

                                <div
                                    className={`p-3 rounded-3 border cursor-pointer transition-all ${paymentMethod === 'QR_CODE' ? 'border-primary bg-primary bg-opacity-10' : 'bg-light'}`}
                                    onClick={() => setPaymentMethod('QR_CODE')}
                                >
                                    <Form.Check
                                        type="radio"
                                        id="payment-qr"
                                        name="paymentMethod"
                                        checked={paymentMethod === 'QR_CODE'}
                                        onChange={() => setPaymentMethod('QR_CODE')}
                                        label={
                                            <div className="ms-2">
                                                <span className="fw-bold text-dark fs-6 d-block">
                                                    Quét mã QR
                                                </span>
                                                <span className="text-muted fs-7">
                                                    Thanh toán nhanh chóng bằng cách quét mã QR qua ứng dụng ngân hàng.
                                                </span>
                                            </div>
                                        }
                                    />
                                </div>
                            </div>
                        </Card>

                        <div className="d-flex justify-content-between align-items-center">
                            <Button
                                variant="outline-primary"
                                className="fw-semibold fs-7"
                                onClick={() => navigate('/cart')}
                            >
                                ← Quay lại giỏ hàng
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
                                    <span className="fw-semibold text-dark">{formatCurrency(totalAmount)}</span>
                                </div>

                                <div className="d-flex justify-content-between text-secondary fs-7 mb-2">
                                    <span>Phí giao hàng:</span>
                                    <span className="fw-semibold text-success">Miễn phí 🚚</span>
                                </div>

                                <hr className="my-3" />

                                <div className="d-flex justify-content-between align-items-baseline mb-3">
                                    <div>
                                        <span className="fw-bold text-dark fs-6">Tổng tiền thanh toán:</span>
                                        <div className="text-muted fs-8">(Đã bao gồm thuế VAT)</div>
                                    </div>
                                    <h3 className="fw-bold text-danger mb-0 fs-3">
                                        {formatCurrency(totalAmount)}
                                    </h3>
                                </div>

                                <Button
                                    type="submit"
                                    variant="danger"
                                    size="lg"
                                    className="w-100 fw-bold py-2.5 shadow-sm d-flex align-items-center justify-content-center gap-2 mt-2"
                                    disabled={isSubmitting || isLoadingProducts}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Spinner animation="border" size="sm" />
                                            Đang xử lý đơn hàng...
                                        </>
                                    ) : (
                                        <>
                                            XÁC NHẬN ĐẶT HÀNG
                                        </>
                                    )}
                                </Button>
                            </Card>

                            <Card className="border-0 shadow-sm rounded-3 p-3 bg-light fs-7 text-muted">
                                <div className="d-flex align-items-center gap-2 mb-2">
                                    <span>🚚</span>
                                    <span>Giao hàng nhanh tận nơi toàn quốc</span>
                                </div>
                                <div className="d-flex align-items-center gap-2 mb-2">
                                    <span>🛡️</span>
                                    <span>Kiểm tra hàng trước khi thanh toán</span>
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                    <span>🔄</span>
                                    <span>Bảo hành chính hãng & Đổi trả trong 30 ngày</span>
                                </div>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </Form>

            <Modal show={showSuccessModal} onHide={() => navigate('/')} centered backdrop="static">
                <Modal.Header closeButton className="bg-success text-white">
                    <Modal.Title className="fs-5 fw-bold">🎉 Đặt Hàng Thành Công!</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center py-4">
                    <div className="mb-3 fs-1">🟢</div>
                    <h5 className="fw-bold text-dark mb-2">Cảm ơn bạn đã mua sắm tại LaptopShop!</h5>
                    <p className="fs-7 text-secondary">
                        Đơn hàng sẽ được chuyển đến địa chỉ <strong className="text-dark">{shippingAddress}</strong>. Nhân viên sẽ liên hệ với bạn qua SĐT <strong className="text-dark">{recipientPhone}</strong> để xác nhận giao hàng.
                    </p>
                </Modal.Body>
                <Modal.Footer className="justify-content-center">
                    <Button variant="primary" className="fw-bold px-4" onClick={() => navigate('/')}>
                        Trở về Trang Chủ
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}
