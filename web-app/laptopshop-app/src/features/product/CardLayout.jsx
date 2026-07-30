import React, { useState } from 'react';
import { Row, Col, Container, Nav } from 'react-bootstrap';
import ProductCard from './ProductCard';
import { mockProducts } from './mockProducts';

export default function CardLayout() {
    const [filterCategory, setFilterCategory] = useState('ALL');

    return (
        <Container className="my-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 pb-2 border-bottom">
                <h4 className="fw-bold text-uppercase m-0 text-primary">
                    Laptop Nổi Bật & Khuyến Mãi
                </h4>

                <Nav variant="pills" defaultActiveKey="ALL" className="mt-2 mt-md-0 small">
                    <Nav.Item>
                        <Nav.Link
                            eventKey="ALL"
                            onClick={() => setFilterCategory('ALL')}
                            className="py-1 px-3"
                        >
                            Tất cả
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link
                            eventKey="GAMING"
                            onClick={() => setFilterCategory('GAMING')}
                            className="py-1 px-3"
                        >
                            Gaming
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link
                            eventKey="MACBOOK"
                            onClick={() => setFilterCategory('MACBOOK')}
                            className="py-1 px-3"
                        >
                            MacBook
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link
                            eventKey="OFFICE"
                            onClick={() => setFilterCategory('OFFICE')}
                            className="py-1 px-3"
                        >
                            Văn Phòng / AI
                        </Nav.Link>
                    </Nav.Item>
                </Nav>
            </div>

            {/* Grid Sản Phẩm */}
            <Row className="g-3">
                {mockProducts.map((product) => (
                    <Col key={product.id} xs={12} sm={6} md={4} lg={3}>
                        <ProductCard product={product} />
                    </Col>
                ))}
            </Row>
        </Container>
    );
}
