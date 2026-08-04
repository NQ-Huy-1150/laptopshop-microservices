import { useState } from 'react';
import { Button, Table, Badge, Modal, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import PermissionModal from './PermissionModal';
import { deletePermissions } from '../../../services/PermissionService';

export default function PermissionDashBoard({ permissions = [] }) {
    const navigate = useNavigate();

    // State Modal Thêm Quyền Hạn
    const [showAddModal, setShowAddModal] = useState(false);

    // State Modal Xóa Quyền Hạn
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedPermission, setSelectedPermission] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleConfirmDelete = async () => {
        if (!selectedPermission) return;
        try {
            setIsDeleting(true);
            await deletePermissions(selectedPermission.name);
            setShowDeleteModal(false);
            setSelectedPermission(null);
            navigate('.', { replace: true });
        } catch (error) {
            console.error('Lỗi khi xóa quyền hạn:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="fw-bold text-dark mb-1">Quản lý quyền hạn</h4>
                    <p className="text-muted mb-0 fs-7">
                        Tổng số: <span className="fw-semibold text-primary">{permissions.length}</span> quyền hạn trong hệ thống
                    </p>
                </div>
                <Button
                    variant="primary"
                    className="d-flex align-items-center gap-2 shadow-sm fs-7"
                    onClick={() => setShowAddModal(true)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                    </svg>
                    Thêm quyền hạn
                </Button>
            </div>

            {/* Bảng Quyền Hạn */}
            <div className="bg-white rounded shadow-sm border overflow-hidden">
                <Table responsive hover className="align-middle mb-0">
                    <thead className="bg-light text-secondary fs-7 text-uppercase">
                        <tr>
                            <th className="py-3 ps-3">Tên Quyền Hạn (Permission)</th>
                            <th className="py-3">Mô Tả Chi Tiết</th>
                            <th style={{ width: '120px' }} className="py-3 text-center pe-3">Thao Tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {permissions.length > 0 ? (
                            permissions.map((permission) => (
                                <tr key={permission.name}>
                                    <td className="ps-3 fw-semibold fs-7">
                                        <Badge bg="secondary" className="bg-opacity-10 text-secondary border border-secondary border-opacity-25 px-2 py-1 fs-7">
                                            {permission.name}
                                        </Badge>
                                    </td>
                                    <td className="text-dark fs-7">
                                        {permission.description}
                                    </td>
                                    <td className="text-center pe-3">
                                        <div className="d-flex justify-content-center gap-1">
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                className="p-1 px-2"
                                                title="Xóa quyền hạn"
                                                onClick={() => {
                                                    setSelectedPermission(permission);
                                                    setShowDeleteModal(true);
                                                }}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                                                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                                                </svg>
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center py-4 text-muted fs-7">
                                    Chưa có dữ liệu quyền hạn nào trong hệ thống.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>

            <PermissionModal
                show={showAddModal}
                handleClose={() => setShowAddModal(false)}
                onPermissionCreated={() => navigate('.', { replace: true })}
            />

            <Modal show={showDeleteModal} onHide={() => !isDeleting && setShowDeleteModal(false)} centered size="sm">
                <Modal.Body className="text-center px-4 pb-2">
                    <h6 className="fw-bold text-dark mb-1">Xác nhận xóa Quyền hạn?</h6>
                    <p className="text-muted fs-7 mb-2">
                        <span className="fw-semibold text-dark">{selectedPermission?.name}</span>
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
                        {isDeleting ? <Spinner size="sm" animation="border" /> : 'Xóa Quyền Hạn'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}