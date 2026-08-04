import { Modal, Button, Form, Spinner, Badge } from 'react-bootstrap';
import { Formik } from 'formik';
import * as yup from 'yup';
import { create as createRoleApi, update as updateRoleApi } from '../../../services/RoleService';

export default function RoleModal({ show, handleClose, roleData = null, permissionsList = [], onRoleSaved }) {
    const isEditMode = !!roleData;

    const schema = yup.object().shape({
        name: yup.string().required('Tên vai trò không được để trống'),
        description: yup.string().required('Mô tả không được để trống'),
        permissions: yup.array().min(1, 'Vui lòng chọn ít nhất 1 quyền hạn cho vai trò này'),
    });

    // Parse initial permissions list into array of strings
    const getInitialPermissions = () => {
        if (!roleData || !Array.isArray(roleData.permissions)) return [];
        return roleData.permissions.map((p) => (typeof p === 'object' ? (p.name || p.id) : p));
    };

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const payload = {
                name: values.name.trim().toUpperCase(),
                description: values.description.trim(),
                permissions: values.permissions
            };

            let result = null;
            if (isEditMode) {
                result = await updateRoleApi(payload);
            } else {
                result = await createRoleApi(payload);
            }

            if (result) {
                resetForm();
                handleClose();
                if (onRoleSaved) onRoleSaved(result);
            }
        } catch (error) {
            console.error(isEditMode ? 'Lỗi khi cập nhật vai trò:' : 'Lỗi khi tạo vai trò mới:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title className="fs-6 fw-bold">
                    {isEditMode ? `Cập Nhật Vai Trò (${roleData?.name})` : 'Thêm Vai Trò (Role) Mới'}
                </Modal.Title>
            </Modal.Header>
            <Formik
                enableReinitialize
                initialValues={{
                    name: roleData?.name || '',
                    description: roleData?.description || '',
                    permissions: getInitialPermissions()
                }}
                validationSchema={schema}
                onSubmit={handleSubmit}
            >
                {({ handleSubmit, handleChange, setFieldValue, values, touched, errors, isSubmitting }) => {
                    const allPermNames = permissionsList.map((p) => (typeof p === 'object' ? p.name : p));
                    const isAllSelected = allPermNames.length > 0 && values.permissions.length === allPermNames.length;

                    const handleToggleSelectAll = () => {
                        if (isAllSelected) {
                            setFieldValue('permissions', []);
                        } else {
                            setFieldValue('permissions', allPermNames);
                        }
                    };

                    return (
                        <Form noValidate onSubmit={handleSubmit}>
                            <Modal.Body className="p-4">
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-semibold fs-7">Tên Vai trò (Role Name)</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        placeholder="Ví dụ: ADMIN, MANAGER, STAFF..."
                                        value={values.name}
                                        onChange={(e) => {
                                            e.target.value = e.target.value.toUpperCase();
                                            handleChange(e);
                                        }}
                                        disabled={isEditMode} // Không cho phép đổi tên vai trò khi cập nhật vì tên là ID
                                        isInvalid={touched.name && !!errors.name}
                                        autoFocus={!isEditMode}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                                    {isEditMode && (
                                        <Form.Text className="text-muted fs-7">
                                            Mã vai trò không thể thay đổi khi cập nhật.
                                        </Form.Text>
                                    )}
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-semibold fs-7">Mô tả vai trò</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        name="description"
                                        placeholder="Ví dụ: Quản trị viên có toàn quyền truy cập hệ thống"
                                        value={values.description}
                                        onChange={handleChange}
                                        isInvalid={touched.description && !!errors.description}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
                                </Form.Group>

                                {/* Chọn nhiều Permissions */}
                                <Form.Group className="mb-3">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <Form.Label className="fw-semibold fs-7 mb-0">
                                            Danh sách Quyền hạn ({values.permissions.length}/{allPermNames.length} đã chọn)
                                        </Form.Label>
                                        <Button
                                            variant="link"
                                            className="p-0 text-decoration-none fs-7 fw-semibold"
                                            onClick={handleToggleSelectAll}
                                        >
                                            {isAllSelected ? '✕ Bỏ chọn tất cả' : '✓ Chọn tất cả'}
                                        </Button>
                                    </div>

                                    <div
                                        className={`border rounded p-3 bg-light ${touched.permissions && errors.permissions ? 'border-danger' : ''}`}
                                        style={{ maxHeight: '220px', overflowY: 'auto' }}
                                    >
                                        {permissionsList && permissionsList.length > 0 ? (
                                            <div className="row g-2">
                                                {permissionsList.map((perm) => {
                                                    const permName = typeof perm === 'object' ? perm.name : perm;
                                                    const permDesc = typeof perm === 'object' ? perm.description : '';
                                                    const isChecked = values.permissions.includes(permName);

                                                    return (
                                                        <div className="col-md-6" key={permName}>
                                                            <div
                                                                className={`p-2 rounded border bg-white d-flex align-items-start gap-2 h-100 ${isChecked ? 'border-primary shadow-sm' : ''}`}
                                                                style={{ cursor: 'pointer' }}
                                                                onClick={() => {
                                                                    if (isChecked) {
                                                                        setFieldValue('permissions', values.permissions.filter((p) => p !== permName));
                                                                    } else {
                                                                        setFieldValue('permissions', [...values.permissions, permName]);
                                                                    }
                                                                }}
                                                            >
                                                                <Form.Check
                                                                    type="checkbox"
                                                                    id={`perm-${permName}`}
                                                                    checked={isChecked}
                                                                    onChange={() => { }} // Managed by parent onClick
                                                                    className="mt-1"
                                                                />
                                                                <div>
                                                                    <Badge bg={isChecked ? 'primary' : 'secondary'} className="mb-1">
                                                                        {permName}
                                                                    </Badge>
                                                                    {permDesc && <div className="text-muted small fs-7">{permDesc}</div>}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div className="text-center py-3 text-muted fs-7">
                                                Chưa có quyền hạn nào trong hệ thống để chọn.
                                            </div>
                                        )}
                                    </div>
                                    {touched.permissions && errors.permissions && (
                                        <div className="text-danger small mt-1">{errors.permissions}</div>
                                    )}
                                </Form.Group>
                            </Modal.Body>
                            <Modal.Footer className="border-0 pt-0 px-4 pb-4">
                                <Button variant="outline-secondary" onClick={handleClose} disabled={isSubmitting}>
                                    Hủy
                                </Button>
                                <Button variant="primary" type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <Spinner size="sm" animation="border" />
                                    ) : (
                                        isEditMode ? 'Cập Nhật Vai Trò' : 'Tạo Vai Trò'
                                    )}
                                </Button>
                            </Modal.Footer>
                        </Form>
                    );
                }}
            </Formik>
        </Modal>
    );
}
