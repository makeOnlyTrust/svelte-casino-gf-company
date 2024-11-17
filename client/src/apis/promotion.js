import { Api as axios } from "@src/interceptors/Api.js";
import { parseApiError } from "@apis/error-parser.js";

const GF_API_KEY = import.meta.env.VITE_GF_API_KEY;
const GF_AFFILIATE_CODE = import.meta.env.VITE_GF_AFFILIATE_CODE;
const SERVER_URL = import.meta.env.VITE_SERVER_URL;
const ADMIN_IDX = import.meta.env.VITE_ADMIN_IDX;

export const getPromotionList = async () => {
    try {
        const res = await axios.get(
            SERVER_URL + '/api/promotion/',
            {
                headers: {
                    'GF-API-KEY': GF_API_KEY,
                    'GF-AFFILIATE-CODE': GF_AFFILIATE_CODE,
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            }
        );
        if (res.status === 200) {
            return {
                success: true,
                data: res.data
            };
        }

        return {
            success: false,
            data: 'Api Error'
        };
    } catch (err) {
        parseApiError(err)
    }
};

export const getPromotionCloseList = async () => {
    try {
        const res = await axios.get(
            SERVER_URL + '/api/promotion/close',
            {
                doNotRetry: false,
                headers: {
                    'GF-API-KEY': GF_API_KEY,
                    'GF-AFFILIATE-CODE': GF_AFFILIATE_CODE,
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            }
        );
        if (res.status === 200) {
            return {
                success: true,
                data: res.data
            };
        }

        return {
            success: false,
            data: 'Api Error'
        };
    } catch (err) {
        parseApiError(err)
    }
};


// type reqPromotionDetail = {
//     id: string,
// }

export const promotionDetail = async (req, _axios ) => {
    try {
        let api;
        if (_axios) {
            api = _axios;
        } else {
            api = axios;
        }
        const res = await api.post(
            SERVER_URL + '/api/promotion/detail',
            {
                id: req.id,
            },
            {
                doNotRetry: false,
                headers: {
                    'GF-API-KEY': GF_API_KEY,
                    'GF-AFFILIATE-CODE': GF_AFFILIATE_CODE,
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            }
        );
        if (res.status === 200) {
            return {
                success: true,
                data: res.data
            };
        }

        return {
            success: false,
            data: 'Api Error'
        };
    } catch (err) {
        parseApiError(err)
    }
};
