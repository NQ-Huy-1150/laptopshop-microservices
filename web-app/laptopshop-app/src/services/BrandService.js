import { data } from "react-router-dom";
import gateway from "./ApiClient";

const BASE_URL = '/product/brands';

export const create = async (payload) => {
    try {
        const response = await gateway.post(BASE_URL, payload);
        return response?.data?.result ?? response?.data;
    } catch (error) {
        console.error(`Fail to create brand:`);
        console.error(error.response.data);
        return null;
    }
};

export const fetchAll = async () => {
    try {
        const response = await gateway.get(BASE_URL);
        return response?.data?.result ?? response?.data;
    } catch (error) {
        console.error(`Fail to fetch all brands: `);
        console.error(error.response.data);
        return null;
    }
};

export const deleteBrand = async (id) => {
    try {
        const response = await gateway.delete(`${BASE_URL}/${id}`);
        console.log('Delete successfully');
        return response?.data;
    } catch (error) {
        console.error(`Fail to delete brand ${id}: ${error}`);
        return null;
    }
};