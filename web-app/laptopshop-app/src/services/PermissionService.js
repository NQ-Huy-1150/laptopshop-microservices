import gateway from "./ApiClient";
const BASE_URL = '/identity/permissions'

export const create = async (payload) => {
    try {
        const response = await gateway.post(BASE_URL, payload);
        return response?.data?.result ?? response?.data;
    } catch (error) {
        console.error('Fail to create permissions : ');
        console.error(error?.response?.data);
        throw error;

    }
}
export const fetchAll = async () => {
    try {
        const response = await gateway.get(BASE_URL);
        return response?.data?.result ?? response?.data;
    } catch (error) {
        console.error('Fail to create permissions : ');
        console.error(error?.response?.data);
        throw error;

    }
}
export const deletePermissions = async (id) => {
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