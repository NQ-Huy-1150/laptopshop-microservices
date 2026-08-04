import gateway from "./ApiClient";

const BASE_URL = '/product/categories';

export const create = async (payload) => {
    try {
        console.info(payload);
        const response = await gateway.post(BASE_URL, payload);
        return response?.data?.result ?? response?.data;
    } catch (error) {
        console.error(`Fail to create category: ${error}`);
        return null;
    }
};

export const fetchAll = async () => {
    try {
        const response = await gateway.get(BASE_URL);
        return response?.data?.result ?? response?.data;
    } catch (error) {
        console.error(`Fail to fetch all categories: ${error}`);
        return null;
    }
};

export const deleteCategory = async (id) => {
    try {
        const response = await gateway.delete(`${BASE_URL}/${id}`);
        console.log('Delete category successfully');
        return response?.data;
    } catch (error) {
        console.error(`Fail to delete category ${id}: ${error}`);
        return null;
    }
};