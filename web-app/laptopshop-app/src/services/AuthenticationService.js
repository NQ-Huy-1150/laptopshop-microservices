import gateway from "./ApiClient";

const BASE_URL = '/identity/auth';

export const login = (payload) => {
    return gateway.post(`${BASE_URL}/login`, payload)
        .then(response => {
            const result = response.data?.result;
            const token = typeof result === 'object' ? result?.token : result;
            if (token) {
                localStorage.setItem('access_token', token);
            }
            return response;
        })
        .catch(error => {
            console.error("Login error:", error);
            throw error;
        });
};

export const logout = async () => {
    const token = localStorage.getItem('access_token');
    if (token) {
        try {
            // Truyền cờ skipAuth: true và headers Authorization rỗng
            // để ApiClient interceptor KHÔNG tự động chèn Bearer token vào Header
            await gateway.post(
                `${BASE_URL}/logout`,
                { token: token },
                {
                    skipAuth: true,
                    headers: {
                        Authorization: ''
                    }
                }
            );
        } catch (error) {
            console.error("Logout request error:", error);
        } finally {
            localStorage.removeItem('access_token');
        }
    } else {
        localStorage.removeItem('access_token');
    }
};

export function isLogin() {
    return localStorage.getItem('access_token') !== null;
}
