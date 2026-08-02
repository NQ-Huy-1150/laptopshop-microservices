import { Row, Col, Container, Form, InputGroup, Button } from 'react-bootstrap';
import SideNav from './SideBar';
import { Outlet } from 'react-router-dom';
import './dashboard.css';

export default function DashBoardApp() {
    return (
        <div className="dashboard-wrapper">
            <Container fluid className="p-0">
                <Row className="g-0">
                    <Col xs={12} lg={2} xl={2}>
                        <SideNav />
                    </Col>

                    <Col xs={12} lg={10} xl={10} className="d-flex flex-column min-vh-100">
                        {/* Top Bar Header */}
                        <header className="dashboard-topbar">
                            <div className="d-flex align-items-center gap-3">
                                <h5 className="mb-0 fw-semibold text-dark">Bảng Điều Khiển</h5>
                            </div>

                            <div className="d-flex align-items-center gap-3">
                                <Form className="d-none d-md-block" style={{ width: '280px' }}>
                                    <InputGroup>
                                        <Form.Control
                                            type="search"
                                            placeholder="Tìm kiếm dữ liệu..."
                                            className="bg-light border-0 shadow-none fs-7"
                                        />
                                    </InputGroup>
                                </Form>

                                <Button variant="light" className="rounded-circle p-2 d-flex align-items-center justify-content-center text-muted border-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z"/>
                                    </svg>
                                </Button>

                                <div className="vr d-none d-md-block my-1"></div>

                                <div className="d-flex align-items-center gap-2">
                                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold fs-7" style={{ width: 36, height: 36 }}>
                                        A
                                    </div>
                                    <div className="d-none d-md-block">
                                        <div className="fw-semibold fs-7 lh-1">Admin</div>
                                        <small className="text-muted fs-8">Quản trị viên</small>
                                    </div>
                                </div>
                            </div>
                        </header>

                        {/* Main Content Area */}
                        <main className="dashboard-content flex-grow-1">
                            <Outlet />
                        </main>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}