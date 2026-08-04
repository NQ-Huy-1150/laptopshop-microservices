import gateway from "./ApiClient";
const BASE_URL = '/identity/roles'

export const create = async (payload) => {
    try {
        const response = await gateway.post(BASE_URL, payload);
        return response?.data?.result ?? response?.data;
    } catch (error) {
        console.error('Fail to create role : ');
        console.error(error?.response?.data);
        throw error;

    }
}
export const fetchAll = async () => {
    try {
        const response = await gateway.get(BASE_URL);
        console.log(response.data.result);
        return response?.data?.result ?? response?.data;
    } catch (error) {
        console.error('Fail to create get all roles : ');
        console.error(error?.response?.data);
        throw error;

    }
}
export const deleteRoles = async (id) => {
    try {
        const response = await gateway.delete(`${BASE_URL}/${id}`);
        console.info('Delete successfully');
        return response?.data
    } catch (error) {
        console.log('Fail to delete role');
        console.log(error.response.data);
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