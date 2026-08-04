import { useState } from 'react';
import { Table, Button, Container, Modal, Form, Spinner, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { create as createCategoryApi, deleteCategory as deleteCategoryApi } from '../../../services/CategoryService';

export default function CategoryMgmt({ categories = [] }) {
    const navigate = useNavigate();

    // Modal Thêm Phân Loại
    const [showAddModal, setShowAddModal] = useState(false);
    const [catId, setCatId] = useState('');
    const [catDesc, setCatDesc] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    // Modal Xóa Phân Loại
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCat, setSelectedCat] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleCreateCategory = async (e) => {
        e.preventDefault();
        if (!catId.trim() || !catDesc.trim()) return;

        try {
            setIsCreating(true);
            const payload = { name: catId.trim().toUpperCase(), description: catDesc.trim() };
            const created = await createCategoryApi(payload);
            if (created) {
                setCatId('');
                setCatDesc('');
                setShowAddModal(false);
                navigate('.', { replace: true });
            }
        } catch (error) {
            console.error('Lỗi khi tạo phân loại:', error);
        } finally {
            setIsCreating(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (!selectedCat) return;
        const idToDelete = typeof selectedCat === 'object' ? (selectedCat.id || selectedCat.name) : selectedCat;

        try {
            setIsDeleting(true);
            await deleteCategoryApi(idToDelete);
            setShowDeleteModal(false);
            setSelectedCat(null);
            navigate('.', { replace: true });
        } catch (error) {
            console.error('Lỗi khi xóa phân loại:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Container fluid className="px-0">
            {/* Header & Button Thêm Phân Loại */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h5 className="fw-bold text-dark mb-0">Danh sách Phân Loại Sản Phẩm</h5>
                    <p className="text-muted fs-7 mb-0">Quản lý các danh mục/dòng laptop (Ví dụ: GAMING, OFFICE, GRAPHIC...)</p>
                </div>
                <Button variant="primary" className="d-flex align-items-center gap-2 shadow-sm fs-7" onClick={() => setShowAddModal(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                    </svg>
                    Thêm Phân Loại Mới
                </Button>
            </div>

            {/* Bảng Phân Loại */}
            <div className="bg-white rounded shadow-sm border overflow-hidden">
                <Table responsive hover className="align-middle mb-0">
                    <thead className="bg-light text-secondary fs-7 text-uppercase">
                        <tr>
                            <th style={{ width: '80px' }} className="ps-4 py-3">#</th>
                            <th style={{ width: '220px' }} className="py-3">Mã Phân Loại</th>
                            <th className="py-3">Mô Tả Danh Mục</th>
                            <th style={{ width: '120px' }} className="py-3 text-center pe-4">Thao Tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.length > 0 ? (
                            categories.map((c, index) => {
                                const idVal = typeof c === 'object' ? (c.id || c.name) : c;
                                const nameVal = typeof c === 'object' ? (c.name || c.id) : c;
                                const descVal = typeof c === 'object' ? (c.description || '-') : '-';

                                return (
                                    <tr key={idVal || index}>
                                        <td className="ps-4 text-muted fs-7 fw-semibold">{index + 1}</td>
                                        <td>
                                            <Badge bg="primary" className="bg-opacity-10 text-primary border border-primary border-opacity-25 px-2 py-1 fs-7">
                                                {nameVal}
                                            </Badge>
                                        </td>
                                        <td>
                                            <span className="text-dark fs-7">{descVal}</span>
                                        </td>
                                        <td className="text-center pe-4">
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                className="p-1 px-2"
                                                title="Xóa Phân Loại"
                                                onClick={() => {
                                                    setSelectedCat(c);
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
                                <td colSpan="4" className="text-center py-4 text-muted">
                                    Chưa có phân loại sản phẩm nào.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>

            {/* Modal Thêm Phân Loại */}
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered size="sm">
                <Modal.Header closeButton>
                    <Modal.Title className="fs-6 fw-bold">Thêm Phân Loại Mới</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleCreateCategory}>
                    <Modal.Body className="p-3">
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold fs-7">Mã phân loại (ID)</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ví dụ: GAMING, OFFICE..."
                                value={catId}
                                onChange={(e) => setCatId(e.target.value.toUpperCase())}
                                autoFocus
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label className="fw-semibold fs-7">Mô tả phân loại</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ví dụ: Laptop chơi game cấu hình cao"
                                value={catDesc}
                                onChange={(e) => setCatDesc(e.target.value)}
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer className="border-0 pt-0">
                        <Button variant="outline-secondary" size="sm" onClick={() => setShowAddModal(false)}>Hủy</Button>
                        <Button variant="primary" size="sm" type="submit" disabled={isCreating || !catId.trim() || !catDesc.trim()}>
                            {isCreating ? <Spinner size="sm" animation="border" /> : 'Tạo mới'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Modal Xóa Phân Loại */}
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
                    <h6 className="fw-bold text-dark mb-1">Xác nhận xóa Phân Loại?</h6>
                    <p className="text-muted fs-7 mb-2">
                        <span className="fw-semibold text-dark">
                            {typeof selectedCat === 'object' ? (selectedCat?.name || selectedCat?.id) : selectedCat}
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
                        {isDeleting ? <Spinner size="sm" animation="border" /> : 'Xóa Phân Loại'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}
