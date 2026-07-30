import { Row, Col, Button, Form, Modal } from "react-bootstrap";
import { Formik } from 'formik';
import * as yup from 'yup';

export default function RegisterForm({ show, handleClose, switchToLogin }) {
    const schema = yup.object().shape({
        firstName: yup.string().required('Họ không được để trống'),
        lastName: yup.string().required('Tên không được để trống'),
        username: yup.string().required('Tên đăng nhập không được để trống').min(6, 'Username phải tối thiểu 6 ký tự'),
        password: yup.string().required('Mật khẩu không được để trống').min(8, 'Mật khẩu tối thiểu 8 ký tự'),
        address: yup.string().required('Vui lòng nhập Địa chỉ giao hàng'),
        phonenumber: yup.string().required('Vui lòng nhập Số điện thoại').min(10, 'Số điện thoại phải gồm 10 ký tự'),
        email: yup.string()
            .required('Email không được bỏ trống')
            .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, 'Email không đúng định dạng'),
        terms: yup.bool().required().oneOf([true], 'Bạn phải đồng ý với điều khoản'),
    });

    return (
        <Modal
            show={show}
            size="lg"
            onHide={handleClose}
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter" className="w-100 text-center">
                    Đăng Ký Tài Khoản
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Formik
                    validationSchema={schema}
                    onSubmit={(values) => {
                        console.log('Form submitted:', values);
                        handleClose();
                    }}
                    initialValues={{
                        firstName: '',
                        lastName: '',
                        username: '',
                        address: '',
                        password: '',
                        email: '',
                        phonenumber: '',
                        terms: false,
                    }}
                >
                    {({ handleSubmit, handleChange, values, touched, errors }) => (
                        <Form noValidate onSubmit={handleSubmit}>
                            <Row className="mb-3">
                                <Form.Group as={Col} md="6">
                                    <Form.Label>Họ</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="firstName"
                                        value={values.firstName}
                                        onChange={handleChange}
                                        isValid={touched.firstName && !errors.firstName}
                                        isInvalid={touched.firstName && !!errors.firstName}
                                        autoFocus
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.firstName}</Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group as={Col} md="6">
                                    <Form.Label>Tên</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="lastName"
                                        value={values.lastName}
                                        onChange={handleChange}
                                        isValid={touched.lastName && !errors.lastName}
                                        isInvalid={touched.lastName && !!errors.lastName}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.lastName}</Form.Control.Feedback>
                                </Form.Group>
                            </Row>

                            <Row className="mb-3">
                                <Form.Group as={Col} md="6">
                                    <Form.Label>Tên đăng nhập</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="username"
                                        value={values.username}
                                        onChange={handleChange}
                                        isInvalid={touched.username && !!errors.username}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group as={Col} md="6">
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

                            <Row className="mb-3">
                                <Form.Group as={Col} md="12">
                                    <Form.Label>Địa chỉ giao hàng</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="address"
                                        value={values.address}
                                        onChange={handleChange}
                                        isInvalid={touched.address && !!errors.address}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>
                                </Form.Group>
                            </Row>

                            <Row className="mb-3">
                                <Form.Group as={Col} md="6">
                                    <Form.Label>Số điện thoại</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="phonenumber"
                                        value={values.phonenumber}
                                        onChange={handleChange}
                                        isInvalid={touched.phonenumber && !!errors.phonenumber}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.phonenumber}</Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group as={Col} md="6">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        placeholder="example@gmail.com"
                                        value={values.email}
                                        onChange={handleChange}
                                        isInvalid={touched.email && !!errors.email}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                                </Form.Group>
                            </Row>

                            <Form.Group className="mb-3">
                                <Form.Check
                                    name="terms"
                                    label="Đồng ý tạo tài khoản & điều khoản sử dụng"
                                    onChange={handleChange}
                                    isInvalid={touched.terms && !!errors.terms}
                                    feedback={errors.terms}
                                    feedbackType="invalid"
                                    id="terms-checkbox"
                                />
                            </Form.Group>

                            <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
                                <span className="text-muted small">
                                    Đã có tài khoản?{' '}
                                    <span
                                        className="text-primary text-decoration-underline"
                                        style={{ cursor: 'pointer' }}
                                        onClick={switchToLogin}
                                    >
                                        Đăng nhập ngay →
                                    </span>
                                </span>
                                <div className="d-flex gap-2">
                                    <Button variant="secondary" onClick={handleClose}>
                                        Hủy
                                    </Button>
                                    <Button type="submit" variant="primary">
                                        Đăng ký
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