import { Row, Col, Card, Table, Badge, Button } from 'react-bootstrap';

export default function Template() {
    const stats = [
        {
            title: 'Tổng doanh thu',
            value: '128.500.000 ₫',
            trend: '+12.5%',
            isPositive: true,
            iconBg: 'bg-primary-subtle text-primary',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.156v4.032c-1.282-.143-2.028-.795-2.22-1.713H4z"/>
                </svg>
            )
        },
        {
            title: 'Đơn hàng mới',
            value: '48',
            trend: '+8.2%',
            isPositive: true,
            iconBg: 'bg-success-subtle text-success',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5"/>
                </svg>
            )
        },
        {
            title: 'Sản phẩm kinh doanh',
            value: '124',
            trend: 'Ổn định',
            isPositive: true,
            iconBg: 'bg-warning-subtle text-warning',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M13.5 2a.5.5 0 0 1 .5.5v11a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5h11z"/>
                </svg>
            )
        },
        {
            title: 'Khách hàng',
            value: '1.250',
            trend: '+15.3%',
            isPositive: true,
            iconBg: 'bg-info-subtle text-info',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8Zm-7.978-1A4.001 4.001 0 0 1 11 11c2.65 0 4.135 1.52 4.97 3h-10.97ZM11 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
                </svg>
            )
        }
    ];

    const recentOrders = [
        { id: '#ORD-9901', customer: 'Nguyễn Văn A', product: 'MacBook Pro M3 Max', total: '45.990.000 ₫', status: 'Hoàn thành', variant: 'success' },
        { id: '#ORD-9902', customer: 'Trần Thị B', product: 'Dell XPS 15 9530', total: '38.500.000 ₫', status: 'Đang xử lý', variant: 'warning' },
        { id: '#ORD-9903', customer: 'Lê Văn C', product: 'Asus ROG Zephyrus G16', total: '42.000.000 ₫', status: 'Đã giao hàng', variant: 'info' },
        { id: '#ORD-9904', customer: 'Phạm Minh D', product: 'Lenovo ThinkPad X1 Carbon', total: '35.200.000 ₫', status: 'Chờ thanh toán', variant: 'secondary' },
    ];

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="fw-bold text-dark mb-1">Tổng Quan Hệ Thống</h4>
                    <p className="text-muted mb-0 fs-7">Báo cáo hoạt động bán hàng và thống kê thời gian thực</p>
                </div>
                <Button variant="primary" className="d-flex align-items-center gap-2 shadow-sm fs-7">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                    </svg>
                    Tạo báo cáo
                </Button>
            </div>

            {/* KPI Cards */}
            <Row className="g-3 mb-4">
                {stats.map((item, idx) => (
                    <Col key={idx} xs={12} sm={6} xl={3}>
                        <div className="stat-card d-flex align-items-center justify-content-between">
                            <div>
                                <small className="text-muted fw-medium d-block mb-1 fs-7">{item.title}</small>
                                <h4 className="fw-bold text-dark mb-2">{item.value}</h4>
                                <span className={`badge-trend ${item.isPositive ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                                    {item.trend} so với tháng trước
                                </span>
                            </div>
                            <div className={`stat-icon ${item.iconBg}`}>
                                {item.icon}
                            </div>
                        </div>
                    </Col>
                ))}
            </Row>

            {/* Table & Quick Stats */}
            <Row className="g-3">
                <Col xs={12} lg={8}>
                    <Card className="border-0 shadow-sm rounded-3">
                        <Card.Header className="bg-white border-0 py-3 d-flex justify-content-between align-items-center">
                            <h6 className="fw-bold mb-0 text-dark">Đơn hàng gần đây</h6>
                            <Button variant="link" className="p-0 text-decoration-none fs-7 fw-semibold">Xem tất cả</Button>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <Table hover responsive className="mb-0 align-middle">
                                <thead className="table-light fs-7 text-muted">
                                    <tr>
                                        <th className="ps-3">Mã đơn</th>
                                        <th>Khách hàng</th>
                                        <th>Sản phẩm</th>
                                        <th>Tổng tiền</th>
                                        <th>Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody className="fs-7">
                                    {recentOrders.map((order) => (
                                        <tr key={order.id}>
                                            <td className="ps-3 fw-bold text-primary">{order.id}</td>
                                            <td className="fw-medium text-dark">{order.customer}</td>
                                            <td>{order.product}</td>
                                            <td className="fw-semibold text-dark">{order.total}</td>
                                            <td>
                                                <Badge bg={order.variant} className="px-2 py-1 fw-normal fs-8">
                                                    {order.status}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xs={12} lg={4}>
                    <Card className="border-0 shadow-sm rounded-3 h-100">
                        <Card.Header className="bg-white border-0 py-3">
                            <h6 className="fw-bold mb-0 text-dark">Lối tắt thao tác</h6>
                        </Card.Header>
                        <Card.Body className="d-flex flex-column gap-2">
                            <Button variant="outline-primary" className="text-start p-3 rounded-3 d-flex align-items-center justify-content-between">
                                <div>
                                    <div className="fw-semibold fs-7">Thêm sản phẩm mới</div>
                                    <small className="text-muted d-block fs-8">Cập nhật kho hàng sản phẩm</small>
                                </div>
                                <span>&rarr;</span>
                            </Button>
                            <Button variant="outline-secondary" className="text-start p-3 rounded-3 d-flex align-items-center justify-content-between">
                                <div>
                                    <div className="fw-semibold fs-7">Quản lý người dùng</div>
                                    <small className="text-muted d-block fs-8">Phân quyền & danh sách tài khoản</small>
                                </div>
                                <span>&rarr;</span>
                            </Button>
                            <Button variant="outline-secondary" className="text-start p-3 rounded-3 d-flex align-items-center justify-content-between">
                                <div>
                                    <div className="fw-semibold fs-7">Cấu hình phân quyền</div>
                                    <small className="text-muted d-block fs-8">Chỉnh sửa danh sách Roles</small>
                                </div>
                                <span>&rarr;</span>
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}