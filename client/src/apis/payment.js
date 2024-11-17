import { Api as axios } from "@src/interceptors/Api.js";

const GF_API_KEY = import.meta.env.VITE_GF_API_KEY;
const GF_AFFILIATE_CODE = import.meta.env.VITE_GF_AFFILIATE_CODE;
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export const getPaymentList = async (symbol) => {
    const endPoint = SERVER_URL + `/api/payment?symbol=${ symbol }`;

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
        const res = await axios.get(endPoint, options);
        if (res.status == 200) {
            return res.data;
        }

        return {
            success: false,
            data: 'Api Error'
        };
    } catch (err) {
        if (err.response && err.response.request.status == 400)
            return {
                success: false,
                data: err.response.data
            };
        return {
            success: false,
            data: {
                message: 'Bad Internet Connection'
            }
        };
    }
};
