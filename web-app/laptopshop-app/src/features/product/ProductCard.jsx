import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { productCache } from '../../services/ProductCache';
export default function ProductCard({ product, inventory }) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };
    const navigate = useNavigate();
    const handleViewDetail = () => {
        productCache.set(product.id, {
            product: product,
            inventory: inventory
        });
        navigate(`/products/${product.id}`)
    }

    return (
        <Card className="h-100 shadow-sm border-0 product-card position-relative overflow-hidden">

            <div className="p-3 text-center bg-light bg-opacity-50 position-relative overflow-hidden">
                <Card.Img
                    variant="top"
                    src={product.mainImage}
                    alt={product.name}
                    style={{
                        height: '180px',
                        objectFit: 'contain',
                        transition: 'transform 0.3s ease-in-out'
                    }}
                    className="product-img img-fluid"
                />
            </div>

            <Card.Body className="d-flex flex-column justify-content-between p-3">
                <div>
                    <Card.Title
                        as="h6"
                        className="fw-bold mb-2 text-dark text-truncate-2"
                        title={product.name}
                        style={{
                            height: '2.6rem',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            fontSize: '0.95rem'
                        }}
                    >
                        {product.name}
                    </Card.Title>

                    <div className="d-flex mb-3">
                        <Card.Text>{product.specs}</Card.Text>
                    </div>
                </div>

                <div>
                    <div className="d-flex text-center gap-2 mb-2">
                        <span className="text-danger fw-bold fs-6">
                            {formatCurrency(product.price)}
                        </span>
                    </div>

                    <div className="d-grid gap-1">
                        <Button variant="outline-primary" size="sm" className="fw-semibold" onClick={handleViewDetail}>
                            Xem Chi Tiết
                        </Button>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
}
