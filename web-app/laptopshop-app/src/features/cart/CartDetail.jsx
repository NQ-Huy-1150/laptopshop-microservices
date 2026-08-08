import React, { useState, useEffect } from "react";
import { Row, Col, Badge, Button, Form, Card, Spinner } from "react-bootstrap";
import { getProductById } from "../../services/ProductService";
import { getInventoryById } from "../../services/InventoryService";
import { updateProductQuantityFromCart, deleteProductFromCart } from "../../services/CartDetailService";

export default function CartDetailCard({ cartDetail, onItemUpdate, onItemDelete }) {
    const [quantity, setQuantity] = useState(Number(cartDetail.quantity || 1));
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [payload, setPayload] = useState({
        product: null,
        inventory: null
    });

    const product = payload.product;
    const inventory = payload.inventory;
    const stock = Number(inventory?.stock ?? 99);

    useEffect(() => {
        let isMounted = true;
        setQuantity(Number(cartDetail.quantity || 1));

        const getData = async () => {
            try {
                const productData = await getProductById(cartDetail.productId);
                const inventoryData = await getInventoryById(cartDetail.productId);
                if (isMounted && productData) {
                    setPayload({
                        product: productData,
                        inventory: inventoryData
                    });
                    // Báo giá về parent Cart để tính tổng tiền
                    if (onItemUpdate) {
                        onItemUpdate(cartDetail.id, productData.price, Number(cartDetail.quantity || 1));
                    }
                }
            } catch (err) {
                console.error("Lỗi khi tải thông tin sản phẩm giỏ hàng:", err);
            }
        };

        getData();

        return () => {
            isMounted = false;
        };
    }, [cartDetail]);

    const formatCurrency = (amount) => {
        if (!amount && amount !== 0) return '0 ₫';
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const handleQuantityChange = async (delta) => {
        const nextQty = quantity + delta;
        if (nextQty < 1 || nextQty > stock || isUpdating) return;

        try {
            setIsUpdating(true);
            setQuantity(nextQty);

            await updateProductQuantityFromCart(cartDetail.id, nextQty);

            // Báo lại parent
            if (product && onItemUpdate) {
                onItemUpdate(cartDetail.id, product.price, nextQty);
            }
        } catch (error) {
            console.error("Lỗi cập nhật số lượng:", error);
            setQuantity(quantity);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDelete = async () => {
        if (isDeleting) return;
        try {
            setIsDeleting(true);
            await deleteProductFromCart(cartDetail.id);
            if (onItemDelete) {
                onItemDelete(cartDetail.id);
            }
        } catch (error) {
            console.error("Lỗi xóa sản phẩm khỏi giỏ:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    if (!product) {
        return (
            <Card className="mb-3 border-0 shadow-sm p-3 bg-white">
                <div className="d-flex align-items-center gap-3">
                    <Spinner animation="border" size="sm" variant="primary" />
                    <span className="text-muted fs-7">Đang tải thông tin sản phẩm...</span>
                </div>
            </Card>
        );
    }

    const itemSubtotal = (product.price || 0) * quantity;

    return (
        <Card className="mb-3 border-0 shadow-sm p-3 bg-white rounded-3">
            <Row className="align-items-center g-3">
                <Col xs={4} sm={3} md={2} className="text-center">
                    <div className="bg-light p-2 rounded-3 border d-flex align-items-center justify-content-center" style={{ height: '90px' }}>
                        <img
                            src={product.mainImage || '/assets/react.svg'}
                            alt={product.name}
                            className="img-fluid"
                            style={{ maxHeight: '80px', objectFit: 'contain' }}
                        />
                    </div>
                </Col>

                <Col xs={8} sm={9} md={4}>
                    <h6 className="fw-bold text-dark mb-1 fs-7 text-truncate-2" title={product.name}>
                        {product.name}
                    </h6>
                    <p className="text-muted fs-8 mb-1 text-truncate" title={product.specs}>
                        {product.specs || 'Cấu hình tiêu chuẩn'}
                    </p>
                    <div className="d-flex align-items-center gap-2">
                        <Badge bg="light" text="dark" className="border fw-normal fs-8">
                            Chính hãng
                        </Badge>
                        <span className="text-danger fw-semibold fs-7 d-md-none">
                            {formatCurrency(product.price)}
                        </span>
                    </div>
                </Col>

                <Col xs={7} sm={6} md={3}>
                    <div className="d-none d-md-block text-muted fs-8 mb-1">
                        Đơn giá: <span className="fw-semibold text-dark">{formatCurrency(product.price)}</span>
                    </div>
                    <div className="d-flex align-items-center gap-1">
                        <div className="input-group input-group-sm" style={{ width: '110px' }}>
                            <Button
                                variant="outline-secondary"
                                onClick={() => handleQuantityChange(-1)}
                                disabled={quantity <= 1 || isUpdating}
                            >
                                -
                            </Button>
                            <Form.Control
                                className="text-center fw-bold fs-7 px-1"
                                value={quantity}
                                readOnly
                            />
                            <Button
                                variant="outline-secondary"
                                onClick={() => handleQuantityChange(1)}
                                disabled={quantity >= stock || isUpdating}
                            >
                                +
                            </Button>
                        </div>
                    </div>
                    <div className="text-muted fs-8 mt-1">
                        Kho: <strong className="text-dark">{stock}</strong>
                    </div>
                </Col>

                <Col xs={5} sm={6} md={3} className="text-end d-flex align-items-center justify-content-end gap-3">
                    <div>
                        <div className="text-muted fs-8 d-none d-md-block">Thành tiền</div>
                        <span className="fw-bold text-danger fs-6">
                            {formatCurrency(itemSubtotal)}
                        </span>
                    </div>

                    <Button
                        variant="outline-danger"
                        size="sm"
                        className="rounded-circle p-2 d-flex align-items-center justify-content-center"
                        style={{ width: '32px', height: '32px' }}
                        title="Xóa sản phẩm khỏi giỏ"
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <Spinner animation="border" size="sm" />
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                            </svg>
                        )}
                    </Button>
                </Col>
            </Row>
        </Card>
    );
}