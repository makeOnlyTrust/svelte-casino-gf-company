import axios from 'axios';
import { getAccessToken, getRefreshToken } from "@apis/account.js";
import globalStore from "@store/globalStore.js";

const ADMIN_IDX = import.meta.env.VITE_ADMIN_IDX;
axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    config.headers['accessToken'] = accessToken;
    config.headers['clientAdminId'] = ADMIN_IDX;
    config.headers['refreshToken'] = refreshToken;
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use((response) => {
    // Do something with response data
    return response;
}, async (error) => {
    const config = error.config;
    if (error.config.doNotRetry) {
        return Promise.reject(error);
    }
    if (error.response.data.code === 4001) {
        const res1 = await getRefreshToken();
        if (res1.success) {
            config.headers['accessToken'] = res1.data.accessToken;
            config.headers['refreshToken'] = res1.data.refreshToken;
            const res2 = await getAccessToken();
            if (res2.success) {
                globalStore.toggleItem('userDetail', res2.data);
                return axios.request(config);
            }
        } else {
            globalStore.toggleItem('userDetail', null);
        }
    }

    // Do something with response error
    return Promise.reject(error);
});

export const Api = axios;
