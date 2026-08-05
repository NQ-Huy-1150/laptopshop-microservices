import { useState, useEffect } from 'react';
import { Modal, Button, Form, Spinner, Card, Badge } from 'react-bootstrap';
import { update as updateRoleUserApi } from '../../../services/UserDashboardService';

export default function UserRoleModal({ show, handleClose, user, availableRoles = [], onUpdated }) {
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (user && Array.isArray(user.roles)) {
            const initialRoles = user.roles.map((r) => (typeof r === 'object' ? (r.name || r.id) : r));
            setSelectedRoles(initialRoles);
        } else {
            setSelectedRoles([]);
        }
        setErrorMessage('');
    }, [user, show]);

    const allRoleNames = availableRoles.map((r) => (typeof r === 'object' ? (r.name || r.id) : r));
    const isAllSelected = allRoleNames.length > 0 && selectedRoles.length === allRoleNames.length;

    const handleToggleSelectAll = () => {
        if (isAllSelected) {
            setSelectedRoles([]);
        } else {
            setSelectedRoles(allRoleNames);
        }
    };

    const handleToggleRole = (roleName) => {
        if (selectedRoles.includes(roleName)) {
            setSelectedRoles(selectedRoles.filter((r) => r !== roleName));
        } else {
            setSelectedRoles([...selectedRoles, roleName]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;

        try {
            setIsSubmitting(true);
            setErrorMessage('');

            // Payload theo đúng yêu cầu backend: { id, roles: ["ROLE_1", "ROLE_2"] }
            const payload = {
                id: user.id,
                roles: selectedRoles
            };

            const result = await updateRoleUserApi(payload);
            if (result !== null) {
                handleClose();
                if (onUpdated) onUpdated(result);
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật vai trò người dùng:', error);
            setErrorMessage(error?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật vai trò');
        } finally {
            setIsSubmitting(false);
        }
    };

    const fullName = [user?.lastname, user?.firstname].filter(Boolean).join(' ') || [user?.firstname, user?.lastname].filter(Boolean).join(' ') || 'Người dùng';

    return (
        <Modal show={show} onHide={() => !isSubmitting && handleClose()} centered size="md">
            <Modal.Header closeButton={!isSubmitting}>
                <Modal.Title className="fs-6 fw-bold">Phân Quyền Người Dùng</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body className="p-4">
                    {/* Thẻ thông tin tóm tắt người dùng */}
                    <Card className="bg-light border-0 mb-3 p-3">
                        <div className="d-flex align-items-center gap-3">
                            <div
                                className="bg-primary bg-opacity-10 text-primary fw-bold rounded-circle d-flex align-items-center justify-content-center"
                                style={{ width: '48px', height: '48px', fontSize: '18px' }}
                            >
                                {fullName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <div className="d-flex align-items-center gap-2">
                                    <div className="fw-bold text-dark fs-6">{fullName}</div>
                                    <Badge bg="dark" className="bg-opacity-10 text-dark border border-dark border-opacity-25 fs-7">
                                        @{user?.username || user?.userName || 'N/A'}
                                    </Badge>
                                </div>
                                <div className="text-muted fs-7">{user?.email || 'Chưa có email'}</div>
                                {user?.address || user?.adrress ? (
                                    <div className="text-muted fs-7 mt-1">
                                        📍 {user?.address || user?.adrress}
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </Card>

                    {errorMessage && (
                        <div className="alert alert-danger py-2 px-3 fs-7 mb-3">
                            {errorMessage}
                        </div>
                    )}

                    {/* Danh sách các vai trò để chọn */}
                    <div className="mb-2 d-flex justify-content-between align-items-center">
                        <Form.Label className="fw-semibold fs-7 mb-0">
                            Danh sách Vai Trò ({selectedRoles.length}/{allRoleNames.length} đã chọn)
                        </Form.Label>
                        <Button
                            variant="link"
                            className="p-0 text-decoration-none fs-7 fw-semibold"
                            onClick={handleToggleSelectAll}
                            disabled={isSubmitting}
                        >
                            {isAllSelected ? '✕ Bỏ chọn tất cả' : '✓ Chọn tất cả'}
                        </Button>
                    </div>

                    <div
                        className="border rounded p-3 bg-white"
                        style={{ maxHeight: '240px', overflowY: 'auto' }}
                    >
                        {availableRoles && availableRoles.length > 0 ? (
                            <div className="d-flex flex-column gap-2">
                                {availableRoles.map((role) => {
                                    const roleName = typeof role === 'object' ? (role.name || role.id) : role;
                                    const roleDesc = typeof role === 'object' ? role.description : '';
                                    const isChecked = selectedRoles.includes(roleName);

                                    return (
                                        <div
                                            key={roleName}
                                            className={`p-2 rounded border bg-white d-flex align-items-start gap-2 ${isChecked ? 'border-primary shadow-sm bg-primary bg-opacity-10' : ''}`}
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => handleToggleRole(roleName)}
                                        >
                                            <Form.Check
                                                type="checkbox"
                                                id={`user-role-${roleName}`}
                                                checked={isChecked}
                                                onChange={() => { }} // Rehandled by parent div onClick
                                                className="mt-1"
                                                disabled={isSubmitting}
                                            />
                                            <div className="flex-grow-1">
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <Badge bg={isChecked ? 'primary' : 'secondary'} className="px-2 py-1 fs-7">
                                                        {roleName}
                                                    </Badge>
                                                </div>
                                                {roleDesc && <div className="text-muted small fs-7 mt-1">{roleDesc}</div>}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-3 text-muted fs-7">
                                Chưa có vai trò nào trong hệ thống.
                            </div>
                        )}
                    </div>
                </Modal.Body>
                <Modal.Footer className="border-0 pt-0 px-4 pb-4">
                    <Button variant="outline-secondary" onClick={handleClose} disabled={isSubmitting}>
                        Hủy
                    </Button>
                    <Button variant="primary" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <><Spinner as="span" animation="border" size="sm" className="me-1" />Đang lưu...</>
                        ) : (
                            'Lưu Vai Trò'
                        )}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}
