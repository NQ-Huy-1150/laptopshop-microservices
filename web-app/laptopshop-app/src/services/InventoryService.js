import gateway from "./ApiClient";

const BASE_URL = '/inventory/management';

export const fetchAll = async () => {
    try {
        const response = await gateway.get(BASE_URL, {
            skipAuth: true,
            headers: {
                Authorization: ''
            }
        });
        return response?.data?.result ?? response?.data;
    } catch (error) {
        console.error(`Fail to fetch inventory: ${error}`);
        return null;
    }
};

export const updateStock = async (payload) => {
    try {
        const response = await gateway.put(`${BASE_URL}/stocks`, payload);
        return response?.data?.result ?? response?.data;
    } catch (error) {
        console.error(`Fail to update stock: ${error}`);
        throw error;
    }
};
export const getInventoryById = async (id) => {
    try {
        const response = await gateway.get(`${BASE_URL}/${id}`, {
            skipAuth: true,
            headers: {
                Authorization: ''
            }
        });
        return response?.data?.result ?? response?.data
    } catch (error) {
        console.log('Fail to fetch inventory');
        console.log(error.response.data);
        throw error;
    }
}