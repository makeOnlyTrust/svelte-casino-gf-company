import { Api as axios }  from "@src/interceptors/Api.js";
import {openPopup} from '../lib/utils/common'


const SERVER_URL = import.meta.env.VITE_SERVER_URL;


/////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////// GFPAY /////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////

//GFPAY (KRW) 20240119 jinowe
const getDepositUrl = async (name, amount, orderNumber) => {
    return new Promise((resolve, reject) => {
        axios.post(SERVER_URL + '/api/pg/gfpay/issuance', {
            orderNumber: orderNumber,
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

//GFPAY (KRW) 20240122 jinowe
const GFpayWithdrawal = async (orderNumber, bankCode, accountNumber, name, amount) => {
    return new Promise((resolve, reject) => {
        axios.post(SERVER_URL + '/api/pg/gfpay/withdrawal', {
            orderNumber,
            bankCode,
            accountNumber,
            name,
            amount
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



export const deposit = async (payment, name, amount, orderNumber) => {
    if(payment === "GFpay") {
        const url = await getDepositUrl(name, amount, orderNumber)
        openPopup(url, 'My Popup', 500, 600)
    }

    return orderNumber
}

export const withdrawal = async (payment, orderNumber, bankCode, accountNumber, name, amount) => {
    if(payment === "GFpay") {
        const data = await GFpayWithdrawal(orderNumber, bankCode, accountNumber, name, amount)

        return data
    }
}
