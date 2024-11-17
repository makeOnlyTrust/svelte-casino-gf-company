import { Api as axios }  from "@src/interceptors/Api.js";

const GF_API_KEY = import.meta.env.VITE_GF_API_KEY;
const GF_AFFILIATE_CODE = import.meta.env.VITE_GF_AFFILIATE_CODE;
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export const getTotalWin = async () => {
    const endPoint = SERVER_URL + `/api/info/total/win`;

    const headers = {
        'GF-API-KEY': GF_API_KEY,
        'GF-AFFILIATE-CODE': GF_AFFILIATE_CODE,
        'Content-Type': 'application/json'
    };
    const options = {
        headers: headers,
        withCredentials: true,
    };

    try {
        const res = await axios.post(endPoint, {}, options);
        if (res.status === 200) {
            return res.data;
        }

    } catch (err) {
        if (err.response && err.response.request.status == 400) {
            return 0;
        }
        return {
            data: {
                message: 'Bad Internet Connection'
            }
        };
    }
};

export const getTotalBet = async () => {
    const endPoint = SERVER_URL + `/api/info/total/bet`;

    const headers = {
        'GF-API-KEY': GF_API_KEY,
        'GF-AFFILIATE-CODE': GF_AFFILIATE_CODE,
        'Content-Type': 'application/json'
    };
    const options = {
        headers: headers,
        withCredentials: true,
    };

    try {
        const res = await axios.post(endPoint, {}, options);
        if (res.status === 200) {
            return res.data;
        }

    } catch (err) {
        if (err.response && err.response.request.status == 400) {
            return 0;
        }
        return {
            data: {
                message: 'Bad Internet Connection'
            }
        };
    }
};

export const getTotalWagered = async () => {
    const endPoint = SERVER_URL + `/api/info/total/wagered`;

    const headers = {
        'GF-API-KEY': GF_API_KEY,
        'GF-AFFILIATE-CODE': GF_AFFILIATE_CODE,
        'Content-Type': 'application/json'
    };
    const options = {
        headers: headers,
        withCredentials: true,
    };

    try {
        const res = await axios.post(endPoint, {}, options);
        if (res.status === 200) {
            return res.data;
        }

    } catch (err) {
        if (err.response && err.response.request.status == 400) {
            return 0;
        }
        return {
            data: {
                message: 'Bad Internet Connection'
            }
        };
    }
};

export const getTop = async () => {
    const endPoint = SERVER_URL + `/api/info/top`;

    const headers = {
        'GF-API-KEY': GF_API_KEY,
        'GF-AFFILIATE-CODE': GF_AFFILIATE_CODE,
        'Content-Type': 'application/json'
    };
    const options = {
        headers: headers,
        withCredentials: true,
    };

    try {
        const res = await axios.post(endPoint, {}, options);
        if (res.status === 200) {
            return res.data;
        }

    } catch (err) {
        if (err.response && err.response.request.status == 400) {
            return 0;
        }
        return {
            data: {
                message: 'Bad Internet Connection'
            }
        };
    }
};
