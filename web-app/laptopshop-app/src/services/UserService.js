import gateway from "./ApiClient";
import { jwtDecode } from 'jwt-decode';

const BASE_URL = '/identity/users';

export const getInfo = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return null;

    try {
        const signedJwt = jwtDecode(token);
        const response = await gateway.get(`${BASE_URL}/${signedJwt.sub}`);
        const rs = response?.data?.result;
        if (rs) {
            localStorage.setItem('currentUser', JSON.stringify(rs));
        }
        return rs;
    } catch (error) {
        console.error(`Fail to retrieve user info: ${error?.response?.data}`);
        throw error;
    }
};

export const create = async (values) => {
    try {
        const response = await gateway.post(`${BASE_URL}/registration`, {
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            username: values.username,
            password: values.password,
            address: values.address,
            dob: values.dob || '',
            phoneNumber: values.phonenumber || '',
        });
        const token = response?.data?.result ? response.data.result?.token : null;
        if (token) {
            localStorage.setItem('access_token', token);
        }
        return response?.data?.result ?? response?.data;
    } catch (error) {
        console.error('Fail to create user:', error?.response?.data || error);
        throw error;
    }
};