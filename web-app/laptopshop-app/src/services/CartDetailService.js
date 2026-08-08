import gateway from "./ApiClient";
const BASE_URL = '/order/details';

export const deleteProductFromCart = async (cartDetailId) => {
    try {
        const response = await gateway.delete(`${BASE_URL}/${cartDetailId}`);
        return response?.data?.result ?? response?.data;
    } catch (error) {
        console.error('Fail to delete product from cart', error?.response?.data || error);
        throw error;
    }
};

export const updateProductQuantityFromCart = async (cartDetailId, quantity) => {
    try {
        const response = await gateway.put(BASE_URL, {
            id: cartDetailId,
            quantity: quantity
        });
        return response?.data?.result ?? response?.data;
    } catch (error) {
        console.error('Fail to update product quantity from cart', error?.response?.data || error);
        throw error;
    }
};