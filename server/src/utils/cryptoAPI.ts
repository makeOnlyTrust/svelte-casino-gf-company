import axios from 'axios';

const CRYPTO_API_URL = process.env.CRYPTO_API_URL;
const CRYPTO_API_KEY = process.env.CRYPTO_API_KEY;

export const createWallet = async (userId: any) => {
    const res = await axios.post(
        CRYPTO_API_URL + '/api/gfcrypto/create-user',
        {
            customerId: userId
        },
        {
            headers: {
                'GF-API-KEY': CRYPTO_API_KEY,
                'Content-Type': 'application/json'
            },
            withCredentials: true
        }
    );

    return res;
};

export const checkNetworks = async (userId: any) => {
    const res = await axios.post(
        CRYPTO_API_URL + '/api/gfcrypto/check-networks',
        {
            customerId: userId
        },
        {
            headers: {
                'GF-API-KEY': CRYPTO_API_KEY,
                'Content-Type': 'application/json'
            },
            withCredentials: true
        }
    );

    return res;
};
