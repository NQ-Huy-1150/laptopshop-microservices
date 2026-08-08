import gateway from "./ApiClient";
const BASE_URL = '/order/carts'
export const addProductToCart = async (product, quantity) => {
    try {
        const response = await gateway.post(BASE_URL,
            {
                cartDetails: [
                    {
                        productId: product.id,
                        quantity: Number(quantity)
                    }
                ]
            }
        )
        console.log(response?.data?.result);

        return response?.data?.result ?? response?.data
    } catch (error) {
        console.error('Fail to add product to cart');
        console.error(error?.response?.data);
    }
}
export const getCurrentCart = async () => {
    try {
        const response = await gateway.get(BASE_URL);
        console.log(response?.data?.result);

        return response?.data?.result ?? response?.data
    } catch (error) {
        console.error('Fail to get user cart');
        console.error(error?.response?.data);
    }
}