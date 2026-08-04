import { useState } from 'react';
import { Table, Button, Container, Card, Modal, Form, Spinner, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { create as createBrandApi, deleteBrand as deleteBrandApi } from '../../../services/BrandService';

export default function BrandMgmt({ brands = [] }) {
    const navigate = useNavigate();

    // Modal Thêm Hãng
    const [showAddModal, setShowAddModal] = useState(false);
    const [brandName, setBrandName] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    // Modal Xóa Hãng
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleCreateBrand = async (e) => {
        e.preventDefault();
        if (!brandName.trim()) return;

        try {
            setIsCreating(true);
            const created = await createBrandApi({ id: brandName.trim(), name: brandName.trim() });
            if (created) {
                setBrandName('');
                setShowAddModal(false);
                navigate('.', { replace: true });
            }
        } catch (error) {
            console.error('Lỗi khi tạo hãng:', error);
        } finally {
            setIsCreating(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (!selectedBrand) return;
        const brandId = typeof selectedBrand === 'object' ? (selectedBrand.id || selectedBrand.name) : selectedBrand;

        try {
            setIsDeleting(true);
            await deleteBrandApi(brandId);
            setShowDeleteModal(false);
            setSelectedBrand(null);
            navigate('.', { replace: true });
        } catch (error) {
            console.error('Lỗi khi xóa hãng:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Container fluid className="px-0">
            {/* Header & Button Thêm Hãng */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h5 className="fw-bold text-dark mb-0">Danh sách Hãng Sản Xuất</h5>
                    <p className="text-muted fs-7 mb-0">Quản lý các thương hiệu laptop có trong hệ thống</p>
                </div>
                <Button variant="primary" className="d-flex align-items-center gap-2 shadow-sm fs-7" onClick={() => setShowAddModal(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                    </svg>
                    Thêm Hãng Mới
                </Button>
            </div>

            {/* Bảng Hãng */}
            <div className="bg-white rounded shadow-sm border overflow-hidden">
                <Table responsive hover className="align-middle mb-0">
                    <thead className="bg-light text-secondary fs-7 text-uppercase">
                        <tr>
                            <th style={{ width: '80px' }} className="ps-4 py-3">#</th>
                            <th className="py-3">Mã Hãng / Tên Thương Hiệu</th>
                            <th style={{ width: '120px' }} className="py-3 text-center pe-4">Thao Tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {brands.length > 0 ? (
                            brands.map((b, index) => {
                                const brandId = typeof b === 'object' ? (b.id || b.name) : b;
                                const brandName = typeof b === 'object' ? (b.name || b.id) : b;

                                return (
                                    <tr key={brandId || index}>
                                        <td className="ps-4 text-muted fs-7 fw-semibold">{index + 1}</td>
                                        <td>
                                            <span className="fw-bold text-dark fs-7">{brandName}</span>
                                        </td>
                                        <td className="text-center pe-4">
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                className="p-1 px-2"
                                                title="Xóa Hãng"
                                                onClick={() => {
                                                    setSelectedBrand(b);
                                                    setShowDeleteModal(true);
                                                }}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                                                </svg>
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center py-4 text-muted">
                                    Chưa có hãng sản xuất nào.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>

            {/* Modal Thêm Hãng */}
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered size="sm">
                <Modal.Header closeButton>
                    <Modal.Title className="fs-6 fw-bold">Thêm Hãng Sản Xuất</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleCreateBrand}>
                    <Modal.Body className="p-3">
                        <Form.Group>
                            <Form.Label className="fw-semibold fs-7">Tên hãng mới</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ví dụ: ASUS, Dell, MSI..."
                                value={brandName}
                                onChange={(e) => setBrandName(e.target.value)}
                                autoFocus
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer className="border-0 pt-0">
                        <Button variant="outline-secondary" size="sm" onClick={() => setShowAddModal(false)}>Hủy</Button>
                        <Button variant="primary" size="sm" type="submit" disabled={isCreating || !brandName.trim()}>
                            {isCreating ? <Spinner size="sm" animation="border" /> : 'Tạo mới'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Modal Xóa Hãng */}
            <Modal show={showDeleteModal} onHide={() => !isDeleting && setShowDeleteModal(false)} centered size="sm">
                <Modal.Header className="border-0 pb-0">
                    <div className="w-100 text-center pt-2">
                        <div style={{
                            width: '56px', height: '56px', borderRadius: '50%',
                            background: '#fee2e2', display: 'inline-flex',
                            alignItems: 'center', justifyContent: 'center', fontSize: '28px'
                        }}>
                            🗑️
                        </div>
                    </div>
                </Modal.Header>
                <Modal.Body className="text-center px-4 pb-2">
                    <h6 className="fw-bold text-dark mb-1">Xác nhận xóa Hãng?</h6>
                    <p className="text-muted fs-7 mb-2">
                        <span className="fw-semibold text-dark">
                            {typeof selectedBrand === 'object' ? (selectedBrand?.name || selectedBrand?.id) : selectedBrand}
                        </span>
                    </p>
                    <div className="d-flex align-items-center justify-content-center gap-1 mb-2"
                        style={{ background: '#fef3c7', borderRadius: '8px', padding: '8px 12px' }}>
                        <span>⚠️</span>
                        <span className="fs-7 text-warning-emphasis fw-semibold">
                            Hành động này không thể đảo ngược!
                        </span>
                    </div>
                </Modal.Body>
                <Modal.Footer className="border-0 pt-0 d-flex gap-2 px-4 pb-4">
                    <Button variant="outline-secondary" className="flex-fill" onClick={() => setShowDeleteModal(false)} disabled={isDeleting}>Hủy</Button>
                    <Button variant="danger" className="flex-fill" onClick={handleConfirmDelete} disabled={isDeleting}>
                        {isDeleting ? <Spinner size="sm" animation="border" /> : 'Xóa Hãng'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}
