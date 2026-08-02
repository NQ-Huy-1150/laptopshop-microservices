import gateway from "./ApiClient";

const BASE_URL = '/product/products';

export const fetchAll = async () => {
    try {
        const response = await gateway.get(BASE_URL);
        console.info(response.data.result);
        return response?.data?.result ?? response?.data;
    } catch (error) {
        console.error(`Fail to fetch products: ${error}`);
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
        console.error(`Fail to create product: ${error}`);
        throw error;
    }
};