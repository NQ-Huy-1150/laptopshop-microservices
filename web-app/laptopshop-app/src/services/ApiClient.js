import axios from 'axios';

// const url = import.meta.env.VITE_API_GATEWAY + import.meta.env.VITE_API_PREFIX;
const url = 'http://localhost:8888/api/v1';

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

gateway.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        return Promise.reject(error);
    }
);

export default gateway;