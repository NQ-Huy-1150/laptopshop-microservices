import gateway from "./ApiClient";

const BASE_URL = '/inventory/management';

export const fetchAll = async () => {
    try {
        const response = await gateway.get(BASE_URL);
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