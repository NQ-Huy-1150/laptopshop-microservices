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
        console.error(`Fail to retrieve user info: ${error}`);
        return null;
    }
};