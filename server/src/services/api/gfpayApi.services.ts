import axios from 'axios';

const url: string = process.env.GFPAY_URL!;
const apiKey: string = process.env.GFPAY_API_KEY!; 

export const getDepositUrl = async (name: string, amount: number, orderNumber: string) => {
    return new Promise((resolve, reject) => {
        axios.post(url + '/api/issuance/url', {
            apiKey: apiKey, 
            type: "temporary",
            key: orderNumber,
            amount: amount,
            clientNm: name
        },
        {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        })
        .then(res => resolve(res.data)) 
        .catch(err => reject(err));
    })
}

export const createWithdrawal = async (orderNumber:string, bankCode:string, accountNumber:string, name:string, amount:string) => {
    return new Promise((resolve, reject) => {
        axios.post(`${url}/api/userwithdrawal`, {
            apiKey: apiKey, 
            trackId: orderNumber,
            bankCode: bankCode,
            bankAcctNo: accountNumber,
            clientNm: name,
            amount: amount
        },
        {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((res) => {
            resolve(res)
        }) 
        .catch((err) => { 
            console.error(err)
            reject(err)
        });
    }) 
}