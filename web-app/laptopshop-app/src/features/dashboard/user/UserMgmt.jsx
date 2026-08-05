import { useState, useEffect } from 'react';
import { Row, Col, Button, Table, Container, Badge, Form, InputGroup } from 'react-bootstrap';
import { useLoaderData, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import UserRoleModal from './UserRoleModal';
import CustomPagination from '../../../shared/ui/CustomPagination';

export default function UserDashBoard() {
    const navigate = useNavigate();
    const location = useLocation();
    const payload = useLoaderData() || {};

    const usersData = payload.users;
    const users = Array.isArray(usersData)
        ? usersData
        : (Array.isArray(usersData?.data)
            ? usersData.data
            : (Array.isArray(usersData?.content) ? usersData.content : []));

    const roles = Array.isArray(payload.roles) ? payload.roles : [];

    // State Tìm kiếm & Modal
    const [searchTerm, setSearchTerm] = useState('');
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    // Lọc người dùng theo từ khóa tìm kiếm (Tên, Username, Email, Địa chỉ)
    const filteredUsers = users.filter((u) => {
        const fullName = `${u?.firstname || u?.firstName || ''} ${u?.lastname || u?.lastName || ''} ${u?.lastname || u?.lastName || ''} ${u?.firstname || u?.firstName || ''}`.toLowerCase();
        const username = (u?.username || u?.userName || '').toLowerCase();
        const email = (u?.email || '').toLowerCase();
        const address = (u?.address || u?.adrress || '').toLowerCase();
        const term = searchTerm.toLowerCase().trim();

        return fullName.includes(term) || username.includes(term) || email.includes(term) || address.includes(term) || (u?.id || '').toString().toLowerCase().includes(term);
    });

    const handleOpenRoleModal = (user) => {
        setSelectedUser(user);
        setShowRoleModal(true);
    };

    // Dynamic URL Search Params cho Phân Trang
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = Number(searchParams.get('page')) || Number(payload?.users?.currentPage) || 1;
    const pageSize = Number(searchParams.get('size')) || Number(payload?.users?.pageSize) || 5;
    const totalPage = payload?.users?.totalPages || payload?.users?.totalPage || 1;
    const totalElements = payload?.users?.totalElements || users.length;

    // Tự động lùi trang nếu số trang vượt quá giới hạn sau khi xóa/cập nhật
    useEffect(() => {
        if (currentPage > totalPage && totalPage > 0) {
            setSearchParams({ page: totalPage, size: pageSize });
        }
    }, [totalPage, currentPage, pageSize, setSearchParams]);

    const handleChangePage = (newPage) => {
        if (newPage >= 1 && newPage <= totalPage) {
            setSearchParams({ page: newPage, size: pageSize });
        }
    };

    return (
        <Container fluid className="px-0">
            {/* Header Quản Lý Người Dùng */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                <div>
                    <h4 className="fw-bold text-dark mb-1">Quản lý người dùng</h4>
                    <p className="text-muted mb-0 fs-7">
                        Tổng số: <span className="fw-semibold text-primary">{users.length}</span> người dùng trong hệ thống
                    </p>
                </div>

                {/* Ô Tìm Kiếm Người Dùng */}
                <div style={{ maxWidth: '350px' }} className="w-100">
                    <InputGroup size="sm">
                        <InputGroup.Text className="bg-white border-end-0 text-muted">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                            </svg>
                        </InputGroup.Text>
                        <Form.Control
                            type="text"
                            placeholder="Tìm kiếm theo tên, email, địa chỉ..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="border-start-0 ps-0 shadow-none fs-7"
                        />
                        {searchTerm && (
                            <Button variant="outline-secondary" size="sm" onClick={() => setSearchTerm('')}>
                                ✕
                            </Button>
                        )}
                    </InputGroup>
                </div>
            </div>

            {/* Bảng Danh Sách Người Dùng */}
            <Row>
                <Col xs={12}>
                    <div className="bg-white rounded shadow-sm border overflow-hidden">
                        <Table responsive hover className="align-middle mb-0">
                            <thead className="bg-light text-secondary fs-7 text-uppercase">
                                <tr>
                                    <th style={{ width: '80px' }} className="ps-3 py-3">Mã ND</th>
                                    <th className="py-3">Username</th>
                                    <th className="py-3">Họ và Tên</th>
                                    <th className="py-3">Email</th>
                                    <th className="py-3">Địa Chỉ</th>
                                    <th className="py-3">Vai Trò (Roles)</th>
                                    <th style={{ width: '130px' }} className="py-3 text-center pe-3">Thao Tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user) => {
                                        const firstname = user?.firstname || user?.firstName || '';
                                        const lastname = user?.lastname || user?.lastName || '';
                                        const fullName = [lastname, firstname].filter(Boolean).join(' ') || [firstname, lastname].filter(Boolean).join(' ') || 'N/A';
                                        const address = user?.address || user?.adrress || 'Chưa cập nhật';
                                        const userRoles = Array.isArray(user?.roles) ? user.roles : [];

                                        return (
                                            <tr key={user.id || user.email}>
                                                <td className="ps-3 fw-semibold text-secondary fs-7">
                                                    #{typeof user.id === 'string' && user.id.length > 8 ? `${user.id.substring(0, 8)}...` : user.id}
                                                </td>
                                                <td>
                                                    <Badge bg="dark" className="bg-opacity-10 text-dark border border-dark border-opacity-25 px-2 py-1 fs-7 fw-semibold">
                                                        {user?.username || user?.userName || 'N/A'}
                                                    </Badge>
                                                </td>
                                                <td>
                                                    <div className="d-flex align-items-center gap-2">
                                                        <div
                                                            className="bg-primary bg-opacity-10 text-primary fw-bold rounded-circle d-inline-flex align-items-center justify-content-center"
                                                            style={{ width: '32px', height: '32px', fontSize: '13px' }}
                                                        >
                                                            {fullName.charAt(0).toUpperCase()}
                                                        </div>
                                                        <span className="fw-semibold text-dark fs-7">{fullName}</span>
                                                    </div>
                                                </td>
                                                <td className="text-secondary fs-7">
                                                    {user.email || 'N/A'}
                                                </td>
                                                <td className="text-secondary fs-7" style={{ maxWidth: '220px' }}>
                                                    <div className="text-truncate" title={address}>
                                                        {address}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="d-flex flex-wrap gap-1">
                                                        {userRoles.length > 0 ? (
                                                            userRoles.map((r, idx) => {
                                                                const roleName = typeof r === 'object' ? (r.name || r.id) : r;
                                                                const isNavAdmin = roleName === 'ADMIN';
                                                                return (
                                                                    <Badge
                                                                        key={roleName || idx}
                                                                        bg={isNavAdmin ? 'danger' : 'primary'}
                                                                        className={`px-2 py-1 fs-7 fw-semibold ${isNavAdmin ? '' : 'bg-opacity-10 text-primary border border-primary border-opacity-25'}`}
                                                                    >
                                                                        {roleName}
                                                                    </Badge>
                                                                );
                                                            })
                                                        ) : (
                                                            <Badge bg="secondary" className="bg-opacity-10 text-secondary border border-secondary border-opacity-25 fw-normal fs-7">
                                                                Chưa gán
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="text-center pe-3">
                                                    <Button
                                                        variant="outline-primary"
                                                        size="sm"
                                                        className="d-inline-flex align-items-center gap-1 px-2 py-1 fs-7"
                                                        title="Phân quyền vai trò"
                                                        onClick={() => handleOpenRoleModal(user)}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                                                            <path d="M8 1a2 2 0 0 1 2 2v2H6V3a2 2 0 0 1 2-2zm3 4V3a3 3 0 0 0-6 0v2a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z" />
                                                        </svg>
                                                        Phân quyền
                                                    </Button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center py-4 text-muted fs-7">
                                            {searchTerm ? 'Không tìm thấy người dùng phù hợp.' : 'Chưa có dữ liệu người dùng nào.'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                        {/* Bộ Phân Trang Thông Minh */}
                        <CustomPagination
                            currentPage={currentPage}
                            totalPages={totalPage}
                            totalElements={totalElements}
                            pageSize={pageSize}
                            onPageChange={handleChangePage}
                        />
                    </div>
                </Col>
            </Row>

            {/* Modal Phân Quyền Người Dùng */}
            <UserRoleModal
                show={showRoleModal}
                handleClose={() => setShowRoleModal(false)}
                user={selectedUser}
                availableRoles={roles}
                onUpdated={() => navigate(`${location.pathname}${location.search}`, { replace: true })}
            />
        </Container>
    );
}