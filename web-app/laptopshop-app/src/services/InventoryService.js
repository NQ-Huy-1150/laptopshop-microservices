import gateway from "./ApiClient";
const BASE_URL = '/inventory/management';
export const fetchAll = async () => {
    try {
        const response = await gateway.get(BASE_URL);
        console.log(response.data.result);
        return response?.data?.result ?? response?.data;

    } catch (error) {
        console.error(`Fail to fetch inventory: ${error}`);
        return null;
    }
}