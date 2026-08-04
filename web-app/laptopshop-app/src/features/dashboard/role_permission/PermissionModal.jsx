import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { Formik } from 'formik';
import * as yup from 'yup';
import { create as createPermissionApi } from '../../../services/PermissionService';

export default function PermissionModal({ show, handleClose, onPermissionCreated }) {
    const schema = yup.object().shape({
        name: yup.string().required('Tên quyền hạn không được để trống'),
        description: yup.string().required('Mô tả không được để trống'),
    });

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const payload = {
                name: values.name.trim().toUpperCase(),
                description: values.description.trim()
            };

            const result = await createPermissionApi(payload);
            if (result) {
                resetForm();
                handleClose();
                if (onPermissionCreated) onPermissionCreated(result);
            }
        } catch (error) {
            console.error('Lỗi khi tạo quyền hạn mới:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered size="md">
            <Modal.Header closeButton>
                <Modal.Title className="fs-6 fw-bold">Thêm Quyền Hạn Mới</Modal.Title>
            </Modal.Header>
            <Formik
                initialValues={{ name: '', description: '' }}
                validationSchema={schema}
                onSubmit={handleSubmit}
            >
                {({ handleSubmit, handleChange, values, touched, errors, isSubmitting }) => (
                    <Form noValidate onSubmit={handleSubmit}>
                        <Modal.Body className="p-4">
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold fs-7">Mã Quyền hạn (Permission Name)</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    placeholder="Ví dụ: CREATE_PRODUCT, DELETE_USER..."
                                    value={values.name}
                                    onChange={(e) => {
                                        e.target.value = e.target.value.toUpperCase();
                                        handleChange(e);
                                    }}
                                    isInvalid={touched.name && !!errors.name}
                                    autoFocus
                                />
                                <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold fs-7">Mô tả chi tiết</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="description"
                                    placeholder="Ví dụ: Cho phép người dùng tạo mới sản phẩm trong hệ thống"
                                    value={values.description}
                                    onChange={handleChange}
                                    isInvalid={touched.description && !!errors.description}
                                />
                                <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer className="border-0 pt-0 px-4 pb-4">
                            <Button variant="outline-secondary" onClick={handleClose} disabled={isSubmitting}>
                                Hủy
                            </Button>
                            <Button variant="primary" type="submit" disabled={isSubmitting}>
                                {isSubmitting ? <Spinner size="sm" animation="border" /> : 'Tạo Quyền Hạn'}
                            </Button>
                        </Modal.Footer>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
}
