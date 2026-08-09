import gateway from "./ApiClient";

const BASE_URL = '/order/orders';

export const createOrder = async (orderPayload) => {
    try {
        const response = await gateway.post(BASE_URL, orderPayload);
        console.log(response?.data?.result);

        return response?.data?.result ?? response?.data;
    } catch (error) {
        console.error('Lỗi khi tạo đơn hàng:', error?.response?.data || error);
        throw error;
    }
};
