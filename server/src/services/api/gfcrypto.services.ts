import axios from 'axios';

const url: string = process.env.CRYPTO_API_URL!;
const apiKey: string = process.env.CRYPTO_API_KEY!;


export const createNewWallet = async (customerId: string) => {
    const postData = {
        customerId: customerId
    };

    return new Promise((resolve, reject) => {
        axios.post(`${url}/api/gfcrypto/create-new-wallet`, postData, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        }
        })
        .then((response: any) => {
            resolve(response.data)
        })
        .catch((error: any) => {
            reject(error.response.data);
        });
    })
}

export const getCryptoList = async () => {
    return new Promise((resolve, reject) => {
        axios.post(`${url}/api/gfcrypto/get-crypto-list`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        }
        })
        .then((response: any) => {
            resolve(response.data)
        })
        .catch((error: any) => {
            reject(error.response.data);
        });
    })
}

export const getNetwork = async (currencySymbol: string|undefined) => {
    const postData = {
        currencySymbol: currencySymbol
    };

    return new Promise((resolve, reject) => {
        axios.post(`${url}/api/gfcrypto/get-network`, postData, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        }
        })
        .then((response: any) => {
            resolve(response)
        })
        .catch((error: any) => {
            reject(error.response.data);
        });
    })
}

export const getAddress = async (userId: string|undefined, network: string|undefined) => {
    const postData = {
        customerId: userId,
        network: network
    };

    return new Promise((resolve, reject) => {
        axios.post(`${url}/api/gfcrypto/get-address`, postData, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        }
        })
        .then((response: any) => {
            resolve(response)
        })
        .catch((error: any) => {
            reject(error.response.data);
        });
    })
}
