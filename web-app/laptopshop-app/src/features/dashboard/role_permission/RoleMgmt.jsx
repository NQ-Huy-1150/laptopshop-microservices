import { Button, Table, Badge, Modal, Spinner, Nav } from 'react-bootstrap';
import { useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import PermissionDashBoard from './PermissionMgmt';
import RoleModal from './RoleModal';
import { deleteRoles } from '../../../services/RoleService';

export default function RoleDashBoard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('roles');

    // State Modal Tạo / Sửa Vai Trò
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);

    // State Modal Xóa Vai Trò
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const payload = useLoaderData() || {};
    const roles = Array.isArray(payload?.roles) ? payload.roles : [];
    const permissions = Array.isArray(payload?.permissions) ? payload.permissions : [];

    const handleOpenAddModal = () => {
        setSelectedRole(null);
        setShowRoleModal(true);
    };

    const handleOpenEditModal = (role) => {
        setSelectedRole(role);
        setShowRoleModal(true);
    };

    const handleOpenDeleteModal = (role) => {
        setRoleToDelete(role);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!roleToDelete) return;
        try {
            setIsDeleting(true);
            await deleteRoles(roleToDelete.name);
            setShowDeleteModal(false);
            setRoleToDelete(null);
            navigate('.', { replace: true });
        } catch (error) {
            console.error('Lỗi khi xóa vai trò:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div>
            {/* Thanh Tab Chuyển Đổi Roles / Permissions */}
            <Nav variant="pills" activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-4 bg-white p-2 rounded shadow-sm border">
                <Nav.Item>
                    <Nav.Link eventKey="roles" className="fw-semibold px-3 py-2">
                        Vai trò ({roles.length})
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="permissions" className="fw-semibold px-3 py-2">
                        Quyền hạn ({permissions.length})
                    </Nav.Link>
                </Nav.Item>
            </Nav>

            {activeTab === 'permissions' && <PermissionDashBoard permissions={permissions} />}

            {activeTab === 'roles' && (
                <>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h4 className="fw-bold text-dark mb-1">Quản lý vai trò</h4>
                            <p className="text-muted mb-0 fs-7">
                                Tổng số: <span className="fw-semibold text-primary">{roles.length}</span> vai trò trong hệ thống
                            </p>
                        </div>
                        <Button
                            variant="primary"
                            className="d-flex align-items-center gap-2 shadow-sm fs-7"
                            onClick={handleOpenAddModal}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                            </svg>
                            Thêm vai trò
                        </Button>
                    </div>

                    <div className="bg-white rounded shadow-sm border overflow-hidden">
                        <Table responsive hover className="align-middle mb-0">
                            <thead className="bg-light text-secondary fs-7 text-uppercase">
                                <tr>
                                    <th className="py-3 ps-3" style={{ width: '160px' }}>Tên Vai Trò</th>
                                    <th className="py-3" style={{ width: '240px' }}>Mô Tả</th>
                                    <th className="py-3">Các Quyền Hạn (Permissions)</th>
                                    <th style={{ width: '120px' }} className="py-3 text-center pe-3">Thao Tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {roles.length > 0 ? (
                                    roles.map((role) => (
                                        <tr key={role.name}>
                                            <td className="ps-3 fw-bold fs-7">
                                                <Badge bg="primary" className="bg-opacity-10 text-primary border border-primary border-opacity-25 px-2 py-1 fs-7">
                                                    {role.name}
                                                </Badge>
                                            </td>
                                            <td className="text-dark fs-7">
                                                {role.description}
                                            </td>
                                            <td>
                                                <div className="d-flex flex-wrap gap-1">
                                                    {Array.isArray(role.permissions) && role.permissions.length > 0 ? (
                                                        role.permissions.map((permission, idx) => {
                                                            const permName = typeof permission === 'object' ? permission.name : permission;
                                                            return (
                                                                <Badge key={permName || idx} bg="secondary" className="bg-opacity-10 text-secondary border border-secondary border-opacity-25 fw-normal">
                                                                    {permName}
                                                                </Badge>
                                                            );
                                                        })
                                                    ) : (
                                                        <span className="text-muted fs-7 italic">Chưa gán quyền nào</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="text-center pe-3">
                                                <div className="d-flex justify-content-center gap-1">
                                                    <Button
                                                        variant="outline-primary"
                                                        size="sm"
                                                        className="p-1 px-2"
                                                        title="Chỉnh sửa vai trò"
                                                        onClick={() => handleOpenEditModal(role)}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
                                                            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
                                                        </svg>
                                                    </Button>
                                                    <Button
                                                        variant="outline-danger"
                                                        size="sm"
                                                        className="p-1 px-2"
                                                        title="Xóa vai trò"
                                                        onClick={() => handleOpenDeleteModal(role)}
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
                                        <td colSpan="4" className="text-center py-4 text-muted fs-7">
                                            Chưa có dữ liệu vai trò nào trong hệ thống.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>

                    {/* Modal Tạo / Cập Nhật Vai Trò */}
                    <RoleModal
                        show={showRoleModal}
                        handleClose={() => setShowRoleModal(false)}
                        roleData={selectedRole}
                        permissionsList={permissions}
                        onRoleSaved={() => navigate('.', { replace: true })}
                    />

                    <Modal show={showDeleteModal} onHide={() => !isDeleting && setShowDeleteModal(false)} centered size="sm">
                        <Modal.Body className="text-center px-4 pb-2">
                            <h6 className="fw-bold text-dark mb-1">Xác nhận xóa Vai trò?</h6>
                            <p className="text-muted fs-7 mb-2">
                                <span className="fw-semibold text-dark">{roleToDelete?.name}</span>
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
                                {isDeleting ? <Spinner size="sm" animation="border" /> : 'Xóa Vai Trò'}
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </>
            )}
        </div>
    );
}