import gateway from "./ApiClient";

const BASE_URL = '/product/products';

export const fetchAll = async () => {
    try {
        const response = await gateway.get(BASE_URL);
        return response?.data?.result ?? response?.data;
    } catch (error) {
        console.error(`Fail to fetch products: ${error}`);
        return null;
    }
};

export const fetchAllWithPagination = async (page, size, isDesc) => {
    try {
        const params = {
            page: Number(page),
        };
        if (size) {
            params.size = Number(size);
        }
        if (isDesc) {
            params.isDesc = isDesc;
        }

        const response = await gateway.get(BASE_URL, { params }, {
            skipAuth: true,
            headers: {
                Authorization: ''
            }
        });
        return response?.data?.result ?? response?.data;
    } catch (error) {
        console.error(`Fail to fetch products: ${error?.response?.data}`);
        return null;
    }
};

export const createProduct = async (payload) => {
    try {
        const formData = new FormData();

        if (payload.files && payload.files.length > 0) {
            Array.from(payload.files).forEach((file) => {
                formData.append("files", file);
            });
        }

        let categoriesArray = [];
        if (Array.isArray(payload.categories)) {
            categoriesArray = payload.categories;
        } else if (payload.category) {
            categoriesArray = [payload.category];
        }

        const requestData = {
            name: payload.name,
            price: Number(payload.price),
            quantity: Number(payload.quantity),
            specs: payload.specs,
            description: payload.description,
            brand: payload.brand,
            categoryIds: categoriesArray,
        };

        formData.append('request', new Blob(
            [JSON.stringify(requestData)],
            { type: 'application/json' }
        ));

        const response = await gateway.post(BASE_URL, formData);
        return response?.data?.result ?? response?.data;

    } catch (error) {
        console.error(`Fail to create product: ${error?.response?.data}`);
        throw error;
    }
};

export const updateProduct = async (id, payload) => {
    try {
        const formData = new FormData();

        if (payload.files && payload.files.length > 0) {
            Array.from(payload.files).forEach((file) => {
                formData.append("files", file);
            });
        }

        let categoriesArray = [];
        if (Array.isArray(payload.categories)) {
            categoriesArray = payload.categories;
        } else if (payload.category) {
            categoriesArray = [payload.category];
        }

        const requestData = {
            id: id,
            name: payload.name,
            price: Number(payload.price),
            specs: payload.specs,
            description: payload.description,
            brand: payload.brand,
            categoryIds: categoriesArray,
        };

        formData.append('request', new Blob(
            [JSON.stringify(requestData)],
            { type: 'application/json' }
        ));

        const response = await gateway.put(BASE_URL, formData);
        return response?.data?.result ?? response?.data;

    } catch (error) {
        console.error(`Fail to update product ${id}: ${error.response?.data}`);
        throw error;
    }
};
export const deleteProduct = async (id) => {
    try {
        const response = await gateway.delete(`${BASE_URL}/${id}`);
        console.info('Delete successfully');
        return response?.data
    } catch (error) {
        console.log('Fail to delete product');
        console.log(error.response.data);
        throw error;
    }
}
export const getProductById = async (id) => {
    try {
        const response = await gateway.get(`${BASE_URL}/${id}`, {
            skipAuth: true,
            headers: {
                Authorization: ''
            }
        });
        return response?.data?.result ?? response?.data
    } catch (error) {
        onsole.log('Fail to fetch product');
        console.log(error.response.data);
        throw error;
    }
}