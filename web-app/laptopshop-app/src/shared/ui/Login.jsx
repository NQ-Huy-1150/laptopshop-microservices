import { Row, Col, Button, Form, Modal, Spinner } from "react-bootstrap";
import { Formik } from 'formik';
import * as yup from 'yup';
import { login } from "../../services/AuthenticationService";
import { useNavigate } from 'react-router-dom';

export default function LoginForm({ show, handleClose, switchToRegister, onLoginSuccess }) {
    const navigate = useNavigate();

    const schema = yup.object().shape({
        username: yup.string().required('Tên đăng nhập không được để trống'),
        password: yup.string().required('Mật khẩu không được để trống'),
    });

    return (
        <Modal
            show={show}
            onHide={handleClose}
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter" className="w-100 text-center">
                    Đăng Nhập
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Formik
                    validationSchema={schema}
                    initialValues={{
                        username: '',
                        password: '',
                    }}
                    onSubmit={async (values, { setSubmitting, setFieldError }) => {
                        try {
                            await login(values);

                            handleClose();

                            if (onLoginSuccess) {
                                onLoginSuccess();
                            }
                            navigate('/');
                        } catch (error) {
                            console.error("Login failed:", error);
                            setFieldError('password', 'Tên đăng nhập hoặc mật khẩu không chính xác');
                        } finally {
                            setSubmitting(false);
                        }
                    }}
                >
                    {({ handleSubmit, handleChange, values, touched, errors, isSubmitting }) => (
                        <Form noValidate onSubmit={handleSubmit}>
                            <Row className="mb-3">
                                <Form.Group as={Col} lg={12} className="mb-3">
                                    <Form.Label>Tên đăng nhập</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="username"
                                        value={values.username}
                                        onChange={handleChange}
                                        isInvalid={touched.username && !!errors.username}
                                        autoFocus
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group as={Col} lg={12}>
                                    <Form.Label>Mật khẩu</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        value={values.password}
                                        onChange={handleChange}
                                        isInvalid={touched.password && !!errors.password}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                                </Form.Group>
                            </Row>

                            <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
                                <span className="text-muted small">
                                    Chưa có tài khoản?{' '}
                                    <span
                                        className="text-primary text-decoration-underline"
                                        style={{ cursor: 'pointer' }}
                                        onClick={switchToRegister}
                                    >
                                        Đăng ký ngay →
                                    </span>
                                </span>
                                <div className="d-flex gap-2">
                                    <Button variant="secondary" onClick={handleClose} disabled={isSubmitting}>
                                        Hủy
                                    </Button>
                                    <Button type="submit" variant="primary" disabled={isSubmitting}>
                                        {isSubmitting ? (
                                            <>
                                                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-1" />
                                                Đang xử lý...
                                            </>
                                        ) : (
                                            'Đăng Nhập'
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </Modal.Body>
        </Modal>
    );
}