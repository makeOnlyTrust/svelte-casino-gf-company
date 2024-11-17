import { Request, Response } from 'express';
import { getDepositUrl, createWithdrawal } from "../services/api/gfpayApi.services"

// Config
import * as response from '../config/response';

// Model
import CustomerDepositTransaction from '../models/customerDepositTransaction.model';
import PaymentMethod from '../models/paymentMethod.model';
import Customer from '../models/customer.model';
import WithdrawalConditions from '../models/withdrawalConditions.model'


// Services
import { updateWallet } from '../services/wallet.services';

/////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////// GFPAY /////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////

export const GFpayIssuanceUrl = async (req: Request, res: Response) => {  
    const {name, amount, orderNumber} = req.body  
    try {
        const data: any = await getDepositUrl(name, amount, orderNumber)
        
        res.status(200).json(data.url)
    } catch (error) {
        res.status(400).json(response.ApiFailed)
    }

}

export const GFpayDepositCallback = async (req: Request, res: Response) => {
    const { apiKey , key } = req.body

    if(apiKey !== process.env.GFPAY_API_KEY) {
        res.status(400).json(response.gfpayCallbackFailed)
        return
    } 
            
    const transactionData: any = await CustomerDepositTransaction.findOneAndUpdate(
        { orderNumber: key },
        { $set: { status: 'success' }, $currentDate: { responseAt: true } },
        { new: true }
    )

    const paymentMethodData: any = await PaymentMethod.findOne({ _id: transactionData.paymentMethodId})

    await WithdrawalConditions.updateOne(
        { 
            customerId: transactionData.customerId, 
            currencyId: paymentMethodData.currencyId
        },
        {
            $inc: { totalDeposited: transactionData.gamemoney }
        }
    );
    
    await updateWallet( transactionData.customerId, transactionData.gamemoney ,paymentMethodData.currencyId )

    if(transactionData) {
        res.status(200).json(response.gfpayCallbackSuccess)
    } else {
        res.status(404).json(response.gfpayCallbackFailed)
    }
}

export const GFpayWithdrawalRequest = async (req: Request, res: Response) => {
    const {orderNumber, bankCode, accountNumber, name, amount} = req.body

    try {
        const data: any = await createWithdrawal(orderNumber, bankCode, accountNumber, name, amount)
        res.status(200).json(data)
    } catch (error) {
        res.status(400).json(response.ApiFailed)
    }
}

export const GFpayWithdrawalCallback = async (req: Request, res: Response) => {
    const { apiKey , key } = req.body

    if(apiKey !== process.env.GFPAY_API_KEY) {
        res.status(400).json(response.gfpayCallbackFailed)
        return
    } 
            
    const transactionData: any = await CustomerDepositTransaction.findOneAndUpdate(
        { orderNumber: key },
        { $set: { status: 'success' }, $currentDate: { responseAt: true } },
        { new: true }
    )

    if(transactionData) {
        res.status(200).json(response.gfpayCallbackSuccess)
    } else {
        res.status(404).json(response.gfpayCallbackFailed)
    }
}