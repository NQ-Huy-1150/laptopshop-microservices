import { Row, Col, Button, Form, Modal, Spinner, InputGroup, Badge } from "react-bootstrap";
import { useState, useEffect } from "react";
import { Formik } from 'formik';
import * as yup from 'yup';
import { create as createBrandApi, fetchAll as fetchAllBrandsApi } from "../../../services/BrandService";
import { create as createCategoryApi, fetchAll as fetchAllCategoriesApi } from "../../../services/CategoryService";
import { createProduct, updateProduct } from "../../../services/ProductService";

export default function ProductModal({ show, handleClose, productData, onSubmitProduct }) {
    const [brandList, setBrandList] = useState([]);
    const [categoryList, setCategoryList] = useState([]);

    // Trạng thái thêm nhanh Hãng mới
    const [isAddingBrand, setIsAddingBrand] = useState(false);
    const [newBrandName, setNewBrandName] = useState('');
    const [isSavingBrand, setIsSavingBrand] = useState(false);

    // Trạng thái thêm nhanh Phân loại mới
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [newCategoryId, setNewCategoryId] = useState('');
    const [newCategoryDesc, setNewCategoryDesc] = useState('');
    const [isSavingCategory, setIsSavingCategory] = useState(false);

    useEffect(() => {
        const loadInitialData = async () => {
            if (show) {
                const brands = await fetchAllBrandsApi();
                if (Array.isArray(brands)) setBrandList(brands);

                const categories = await fetchAllCategoriesApi();
                if (Array.isArray(categories)) setCategoryList(categories);
            }
        };
        loadInitialData();
    }, [show]);

    const isEditMode = !!productData;

    const schema = yup.object().shape({
        name: yup.string().required('Tên sản phẩm không được để trống'),
        price: yup.number().typeError('Giá phải là số').required('Vui lòng nhập giá').min(1, 'Giá sản phẩm không được bé hơn 1'),
        // Chỉ bắt buộc nhập quantity khi Thêm mới, không cần khi Cập nhật (do modal kho đảm nhận)
        quantity: isEditMode
            ? yup.number().typeError('Số lượng phải là số').nullable()
            : yup.number().typeError('Số lượng phải là số').required('Vui lòng nhập số lượng').min(1, 'Số lượng tối thiểu phải là 1'),
        specs: yup.string().required('Cấu hình không được để trống'),
        description: yup.string().required('Mô tả chi tiết không được để trống'),
        brand: yup.string().required('Hãng sản xuất không được bỏ trống'),
        categories: yup.array().min(1, 'Vui lòng chọn ít nhất 1 phân loại'),
    });

    return (
        <Modal
            show={show}
            onHide={handleClose}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter" className="w-100 text-center fw-bold">
                    {isEditMode ? `Cập Nhật Sản Phẩm #${productData?.id}` : 'Thêm Mới Sản Phẩm'}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Formik
                    enableReinitialize
                    validationSchema={schema}
                    initialValues={{
                        name: productData?.name || '',
                        price: productData?.price || '',
                        quantity: productData?.quantity ?? productData?.stock ?? '',
                        specs: productData?.specs || '',
                        description: productData?.description || '',
                        brand: productData?.brandId || '',
                        categories: Array.isArray(productData?.categoryIds)
                            ? productData.categoryIds
                            : (productData?.categoryIds ? [productData.categoryIds] : []),
                        files: [],
                    }}
                    onSubmit={async (values, { setSubmitting, resetForm }) => {
                        try {
                            if (onSubmitProduct) {
                                await onSubmitProduct(values, productData);
                            } else if (isEditMode && productData?.id) {
                                await updateProduct(productData.id, values);
                            } else {
                                await createProduct(values);
                            }
                            resetForm();
                            handleClose();
                        } catch (error) {
                            console.error("Lỗi khi xử lý sản phẩm:", error);
                        } finally {
                            setSubmitting(false);
                        }
                    }}
                >
                    {({ handleSubmit, handleChange, values, touched, errors, isSubmitting, setFieldValue }) => (
                        <Form noValidate onSubmit={handleSubmit}>
                            {/* Tên sản phẩm & Giá */}
                            <Row className="mb-3">
                                <Form.Group as={Col} md="6">
                                    <Form.Label className="fw-semibold">Tên sản phẩm</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        placeholder="Ví dụ: Laptop ASUS ROG Strix G16"
                                        value={values.name}
                                        onChange={handleChange}
                                        isInvalid={touched.name && !!errors.name}
                                        autoFocus
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group as={Col} md="6">
                                    <Form.Label className="fw-semibold">Giá (VNĐ)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="price"
                                        placeholder="Ví dụ: 25000000"
                                        value={values.price}
                                        onChange={handleChange}
                                        isInvalid={touched.price && !!errors.price}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.price}</Form.Control.Feedback>
                                </Form.Group>
                            </Row>

                            {/* Cấu hình & Số lượng (Số lượng ẩn khi Cập nhật) */}
                            <Row className="mb-3">
                                <Form.Group as={Col} md={isEditMode ? '12' : '8'}>
                                    <Form.Label className="fw-semibold">Thông số cấu hình vắn tắt</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="specs"
                                        placeholder="Ví dụ: i7 14700HX, 16GB RAM, 1TB SSD, RTX 4060"
                                        value={values.specs}
                                        onChange={handleChange}
                                        isInvalid={touched.specs && !!errors.specs}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.specs}</Form.Control.Feedback>
                                </Form.Group>

                                {/* Ẩn ô Số lượng khi đang Cập nhật vì modal kho đảm nhận riêng */}
                                {!isEditMode && (
                                    <Form.Group as={Col} md="4">
                                        <Form.Label className="fw-semibold">Số lượng nhập kho</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="quantity"
                                            placeholder="Ví dụ: 10"
                                            value={values.quantity}
                                            onChange={handleChange}
                                            isInvalid={touched.quantity && !!errors.quantity}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.quantity}</Form.Control.Feedback>
                                    </Form.Group>
                                )}
                            </Row>

                            {/* Hãng sản xuất (Brand) & Phân loại (Categories - Multi Select) */}
                            <Row className="mb-3">
                                {/* Cột Hãng Sản Xuất */}
                                <Form.Group as={Col} md="6">
                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                        <Form.Label className="fw-semibold mb-0">Hãng sản xuất</Form.Label>
                                        <Button
                                            variant="link"
                                            className="p-0 text-decoration-none fs-7 fw-semibold"
                                            onClick={() => setIsAddingBrand(!isAddingBrand)}
                                        >
                                            {isAddingBrand ? '✕ Đóng' : '+ Thêm hãng mới'}
                                        </Button>
                                    </div>

                                    {/* Khung thêm nhanh Hãng mới */}
                                    {isAddingBrand ? (
                                        <InputGroup className="mb-2">
                                            <Form.Control
                                                type="text"
                                                placeholder="Tên hãng mới (VD: MSI)"
                                                value={newBrandName}
                                                onChange={(e) => setNewBrandName(e.target.value)}
                                                disabled={isSavingBrand}
                                            />
                                            <Button
                                                variant="success"
                                                disabled={isSavingBrand || !newBrandName.trim()}
                                                onClick={async () => {
                                                    if (!newBrandName.trim()) return;
                                                    setIsSavingBrand(true);
                                                    const created = await createBrandApi({ id: newBrandName.trim(), name: newBrandName.trim() });
                                                    if (created) {
                                                        const updatedList = await fetchAllBrandsApi();
                                                        if (Array.isArray(updatedList)) setBrandList(updatedList);
                                                        setFieldValue('brand', newBrandName.trim());
                                                        setNewBrandName('');
                                                        setIsAddingBrand(false);
                                                    }
                                                    setIsSavingBrand(false);
                                                }}
                                            >
                                                {isSavingBrand ? <Spinner animation="border" size="sm" /> : 'Lưu'}
                                            </Button>
                                        </InputGroup>
                                    ) : (
                                        <Form.Select
                                            name="brand"
                                            value={values.brand}
                                            onChange={handleChange}
                                            isInvalid={touched.brand && !!errors.brand}
                                        >
                                            <option value="">-- Chọn Hãng --</option>
                                            {brandList && brandList.map((b) => {
                                                const brandVal = typeof b === 'object' ? (b.id || b.name) : b;
                                                const brandName = typeof b === 'object' ? (b.name || b.id) : b;
                                                return (
                                                    <option key={brandVal} value={brandVal}>
                                                        {brandName}
                                                    </option>
                                                );
                                            })}
                                        </Form.Select>
                                    )}
                                    <Form.Control.Feedback type="invalid" className="d-block">
                                        {errors.brand}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                {/* Cột Phân Loại (Categories - Chọn nhiều / List<String>) */}
                                <Form.Group as={Col} md="6">
                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                        <Form.Label className="fw-semibold mb-0">Phân loại (Cho phép chọn nhiều)</Form.Label>
                                        <Button
                                            variant="link"
                                            className="p-0 text-decoration-none fs-7 fw-semibold"
                                            onClick={() => setIsAddingCategory(!isAddingCategory)}
                                        >
                                            {isAddingCategory ? '✕ Đóng' : '+ Thêm loại mới'}
                                        </Button>
                                    </div>

                                    {/* Khung thêm nhanh Phân loại mới */}
                                    {isAddingCategory ? (
                                        <div className="border rounded p-2 bg-light mb-2">
                                            <InputGroup size="sm" className="mb-2">
                                                <InputGroup.Text>Mã (ID)</InputGroup.Text>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="VD: GAMING"
                                                    value={newCategoryId}
                                                    onChange={(e) => setNewCategoryId(e.target.value.toUpperCase())}
                                                    disabled={isSavingCategory}
                                                />
                                            </InputGroup>
                                            <InputGroup size="sm" className="mb-2">
                                                <InputGroup.Text>Mô tả</InputGroup.Text>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="VD: Laptop Gaming"
                                                    value={newCategoryDesc}
                                                    onChange={(e) => setNewCategoryDesc(e.target.value)}
                                                    disabled={isSavingCategory}
                                                />
                                            </InputGroup>
                                            <Button
                                                variant="success"
                                                size="sm"
                                                className="w-100"
                                                disabled={isSavingCategory || !newCategoryId.trim() || !newCategoryDesc.trim()}
                                                onClick={async () => {
                                                    if (!newCategoryId.trim() || !newCategoryDesc.trim()) return;
                                                    setIsSavingCategory(true);
                                                    const payload = { name: newCategoryId.trim(), description: newCategoryDesc.trim() };
                                                    const created = await createCategoryApi(payload);
                                                    if (created) {
                                                        const updatedList = await fetchAllCategoriesApi();
                                                        if (Array.isArray(updatedList)) setCategoryList(updatedList);
                                                        const currentCats = values.categories || [];
                                                        if (!currentCats.includes(newCategoryId.trim())) {
                                                            setFieldValue('categories', [...currentCats, newCategoryId.trim()]);
                                                        }
                                                        setNewCategoryId('');
                                                        setNewCategoryDesc('');
                                                        setIsAddingCategory(false);
                                                    }
                                                    setIsSavingCategory(false);
                                                }}
                                            >
                                                {isSavingCategory ? <Spinner animation="border" size="sm" /> : 'Lưu Phân Loại'}
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="border rounded p-2 bg-white" style={{ maxHeight: '120px', overflowY: 'auto' }}>
                                            {categoryList && categoryList.length > 0 ? (
                                                categoryList.map((cate) => {
                                                    const cateId = typeof cate === 'object' ? cate.id : cate;
                                                    const cateDesc = typeof cate === 'object' ? (cate.description || cate.id) : cate;
                                                    const isChecked = values.categories.includes(cateId);

                                                    return (
                                                        <Form.Check
                                                            key={cateId}
                                                            type="checkbox"
                                                            id={`cat-${cateId}`}
                                                            label={`${cateDesc} (${cateId})`}
                                                            checked={isChecked}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    setFieldValue('categories', [...values.categories, cateId]);
                                                                } else {
                                                                    setFieldValue(
                                                                        'categories',
                                                                        values.categories.filter((c) => c !== cateId)
                                                                    );
                                                                }
                                                            }}
                                                        />
                                                    );
                                                })
                                            ) : (
                                                <span className="text-muted small">Đang tải danh sách phân loại...</span>
                                            )}
                                        </div>
                                    )}
                                    <Form.Control.Feedback type="invalid" className="d-block">
                                        {errors.categories}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Row>

                            {/* Up Multiple Ảnh Sản Phẩm */}
                            <Row className="mb-3">
                                <Form.Group as={Col} md="12">
                                    <Form.Label className="fw-semibold">
                                        Hình ảnh sản phẩm (Upload Multiple Files)
                                    </Form.Label>
                                    <Form.Control
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={(e) => {
                                            const selectedFiles = Array.from(e.target.files);
                                            setFieldValue('files', selectedFiles);
                                        }}
                                    />
                                    <Form.Text className="text-muted">
                                        {isEditMode ? 'Để trống nếu không muốn thay đổi/tải lên ảnh mới.' :
                                            'Có thể chọn nhiều hình ảnh cùng lúc. Ảnh bìa đặt tên theo quy tắc : main.jpg / main.webp ...'}
                                    </Form.Text>

                                    {values.files && values.files.length > 0 && (
                                        <div className="mt-2 d-flex flex-wrap gap-2 align-items-center">
                                            <Badge bg="info" className="p-2">
                                                Đã chọn {values.files.length} tệp ảnh mới
                                            </Badge>
                                            {values.files.map((file, idx) => (
                                                <Badge key={idx} bg="light" text="dark" className="border">
                                                    📷 {file.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </Form.Group>
                            </Row>

                            {/* Mô tả chi tiết */}
                            <Row className="mb-3">
                                <Form.Group as={Col} md="12">
                                    <Form.Label className="fw-semibold">Mô tả chi tiết</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        name="description"
                                        placeholder="Nhập mô tả thông tin sản phẩm..."
                                        value={values.description}
                                        onChange={handleChange}
                                        isInvalid={touched.description && !!errors.description}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
                                </Form.Group>
                            </Row>

                            {/* Nút hành động */}
                            <div className="d-flex justify-content-end gap-2 mt-4 pt-2 border-top">
                                <Button variant="secondary" onClick={handleClose} disabled={isSubmitting}>
                                    Hủy
                                </Button>
                                <Button type="submit" variant="primary" disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <>
                                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-1" />
                                            Đang lưu...
                                        </>
                                    ) : (
                                        isEditMode ? 'Lưu Cập Nhật' : 'Thêm Sản Phẩm'
                                    )}
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </Modal.Body>
        </Modal>
    );
}