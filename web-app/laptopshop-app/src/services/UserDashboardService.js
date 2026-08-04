import gateway from "./ApiClient";
const BASE_URL = '/identity/dashboard/users';

export const fetchAll = async () => {
    try {
        const response = await gateway.get(BASE_URL);
        console.log(response.data.result);
        return response?.data?.result ?? response?.data;
    } catch (error) {
        console.error('Fail to get all users for dashboard : ');
        console.error(error?.response?.data);
        throw error;

    }
}
export const update = async (payload) => {
    try {
        const response = await gateway.put(BASE_URL, payload);
        return response?.data?.result ?? response?.data;
    } catch (error) {
        console.error('Fail to update role:', error?.response?.data || error);
        throw error;
    }
}
