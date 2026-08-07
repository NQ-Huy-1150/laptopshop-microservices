import axios from 'axios';

// const url = import.meta.env.VITE_API_GATEWAY + import.meta.env.VITE_API_PREFIX;
const url = 'http://localhost:8888/api/v1';
const refreshUrl = '/identity/auth/refresh';

const gateway = axios.create({
    baseURL: url,
    timeout: 5000,
});

gateway.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");

    if (config.skipAuth || config.headers.get("Authorization") === '') {
        config.headers.delete("Authorization");
    } else if (token && !config.headers.get("Authorization")) {
        config.headers.set("Authorization", `Bearer ${token}`);
    }

    return config;
});

let isRefreshing = false;
let refreshSubscribers = [];

function subscribeTokenRefresh(callback) {
    refreshSubscribers.push(callback);
}

function onRefreshed(newToken) {
    refreshSubscribers.forEach((callback) => callback(newToken));
    refreshSubscribers = [];
}

function onRefreshFailed(error) {
    refreshSubscribers.forEach((callback) => callback(null, error));
    refreshSubscribers = [];
}

gateway.interceptors.response.use(
    function (response) {
        return response;
    },
    async function (error) {
        const originalRequest = error?.config;

        if (error?.response?.status === 401) {
            const token = localStorage.getItem('access_token');
            if (!token) {
                return Promise.reject(error);
            }

            // Nếu đang có 1 request khác refresh rồi -> chờ kết quả, không gọi refresh nữa
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    subscribeTokenRefresh((newToken, err) => {
                        if (err) return reject(err);
                        originalRequest.headers.Authorization = `Bearer ${newToken}`;
                        resolve(gateway(originalRequest));
                    });
                });
            }

            isRefreshing = true;

            try {
                const refreshRes = await gateway.post(refreshUrl, {
                    token: token
                }, {
                    skipAuth: true,
                    headers: { Authorization: '' },
                    timeout: 5000,
                });

                const newToken = refreshRes?.data?.result?.token ?? null;
                const status = refreshRes?.data?.result?.status;

                if (status && newToken) {
                    localStorage.setItem('access_token', newToken);
                    onRefreshed(newToken); // đánh thức các request đang chờ

                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return gateway(originalRequest);
                }

                localStorage.removeItem('access_token');
                onRefreshFailed(error);
                return Promise.reject(error);

            } catch (refreshError) {
                const refreshStatus = refreshError?.response?.status;

                if (refreshStatus === 401 || refreshStatus === 403) {
                    localStorage.removeItem('access_token');
                } else {
                    console.error(
                        'Fail to refresh token (network/server error):',
                        refreshError?.response?.data ?? refreshError.message
                    );
                }

                onRefreshFailed(refreshError); // báo lỗi cho các request đang chờ
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default gateway;