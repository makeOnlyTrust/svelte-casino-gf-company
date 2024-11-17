import { Api as axios }  from "@src/interceptors/Api.js";

const GF_API_KEY = import.meta.env.VITE_GF_API_KEY;
const GF_AFFILIATE_CODE = import.meta.env.VITE_GF_AFFILIATE_CODE;
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export const getMinigameLists = async (userId, type, vendor) => {
    const endPoint = SERVER_URL + `/api/minigame/list?userId=${userId}&type=${type}&vendor=${vendor}`;

    const headers = {
        'GF-API-KEY': GF_API_KEY,
        'GF-AFFILIATE-CODE': GF_AFFILIATE_CODE,
        'Content-Type': 'application/json'
    };
    const options = {
        headers: headers,
        withCredentials: true
    };

    try {
        const res = await axios.get(endPoint, {}, options);
        if (res.status == 200) {
            return res.data;
        }

        if (err.response && err.response.request.status == 400) {
            return err.response.data;
        }
    } catch {
        return {
            data: {
                message: 'Bad Internet Connection'
            }
        };
    }
};

export const getMinigameInfo = async (idx, userId) => {
    const endPoint = SERVER_URL + `/api/minigame/info?idx=${idx}&userId=${userId}`;

    const headers = {
        'GF-API-KEY': GF_API_KEY,
        'GF-AFFILIATE-CODE': GF_AFFILIATE_CODE,
        'Content-Type': 'application/json'
    };
    const options = {
        headers: headers,
        withCredentials: true
    };

    try {
        const res = await axios.get(endPoint, {}, options);
        if (res.status == 200) {
            return res.data;
        }

        if (err.response && err.response.request.status == 400) {
            return err.response.data;
        }
    } catch {
        return {
            data: {
                message: 'Bad Internet Connection'
            }
        };
    }
};


export const getMinigameVendors = async () => {
    const endPoint = SERVER_URL + '/api/minigame/vendor';

    const headers = {
        'GF-API-KEY': GF_API_KEY,
        'GF-AFFILIATE-CODE': GF_AFFILIATE_CODE,
        'Content-Type': 'application/json'
    };
    const options = {
        headers: headers,
        withCredentials: true
    };

    try {
        const res = await axios.get(endPoint, {}, options);
        if (res.status == 200) {
            return res.data;
        }

    } catch (err) {
        if (err.response && err.response.request.status == 400) {
            return err.response.data;
        }
        return {
            data: {
                message: 'Bad Internet Connection'
            }
        };
    }
};


export const postMinigameBet = async (
    userId,
    gameId,
    amount,
    refererId,
    bet
) => {
    const endPoint = SERVER_URL + '/api/minigame/bet';

    const headers = {
        'GF-API-KEY': GF_API_KEY,
        'GF-AFFILIATE-CODE': GF_AFFILIATE_CODE,
        'Content-Type': 'application/json'
    };
    const options = {
        headers: headers,
        withCredentials: true
    };

    try {
        const res = await axios.post(endPoint, {
            userId,
            gameId,
            amount,
            refererId,
            bet
        }, options);
        if (res.status === 200) {
            return {
                success: true,
                data: res.data,
            };
        }

    } catch (err) {
        if (err.response && err.response.request.status == 400) {
            return {
                success: false,
                msg: err.response.data
            };
        }
        return {
            data: {
                message: 'Bad Internet Connection'
            }
        };
    }
};

export const postMinigameBetRate = async ({
    gameId,
    bet
}) => {
    const endPoint = SERVER_URL + '/api/minigame/bet/rate';

    const headers = {
        'GF-API-KEY': GF_API_KEY,
        'GF-AFFILIATE-CODE': GF_AFFILIATE_CODE,
        'Content-Type': 'application/json'
    };
    const options = {
        headers: headers,
        withCredentials: true
    };

    try {
        const res = await axios.post(endPoint, {
            gameId,
            bet
        }, options);
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

export const getMinigameBetHistory = async () => {
    const endPoint = SERVER_URL + `/api/minigame/bet/history`;

    const headers = {
        'GF-API-KEY': GF_API_KEY,
        'GF-AFFILIATE-CODE': GF_AFFILIATE_CODE,
        'Content-Type': 'application/json'
    };
    const options = {
        headers: headers,
        withCredentials: true
    };

    try {
        const res = await axios.get(endPoint, {}, options);
        if (res.status == 200) {
            return res.data;
        }

        if (err.response && err.response.request.status == 400) {
            return err.response.data;
        }
    } catch {
        return {
            data: {
                message: 'Bad Internet Connection'
            }
        };
    }
};
