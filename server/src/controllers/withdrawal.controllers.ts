import { Request, Response } from 'express';
import * as response from '../config/response';
import {ApiFailed} from "../config/response"
import withdrawalConditions from '../models/withdrawalConditions.model'
import PaymentMethod from '../models/paymentMethod.model';
import CustomerWithdrawalTransaction from '../models/customerWithdrawalTransaction';
import { updateWallet } from '../services/wallet.services';

export const getWithdrawalConditions = async (req:Request, res:Response) => {
    const customerId = typeof req.query.customerId === 'string' ? req.query.customerId : undefined;
    const currencyId = typeof req.query.currencyId === 'string' ? req.query.currencyId : undefined;

    try {
        const withdrawalConditionsData: any = await withdrawalConditions.findOne({
            customerId: customerId,
            currencyId: currencyId
        })

        if(withdrawalConditionsData) {
            const totalBettingRequired = (withdrawalConditionsData.totalDeposited * 100) / 100;
            const requiredAdditionalBetting = totalBettingRequired - withdrawalConditionsData.totalUsed
            const percentage = (withdrawalConditionsData.totalUsed / withdrawalConditionsData.totalDeposited) * 100
            const condition = percentage >= 100 ? true : false

            res.status(200).json({
                percentage: percentage,
                requiredAdditionalBetting: requiredAdditionalBetting,
                condition: condition
            }) 
        } else {
            res.status(200).json({
                percentage: 0,
                requiredAdditionalBetting: 0,
                condition: false
            })    
        }

    } catch (error) {

        res.status(400).json(ApiFailed)   
    }
}

export const createWithdrawalTransactions = async (req:Request, res:Response) => {
    const {
        adminId, 
        agentId, 
        customerId, 
        paymentMethodId, 
        orderNumber,
        amount,
        bank,
        accountNumber,
        name,
        currencyId
    } = req.body

    const paymentMethodData :any = await PaymentMethod.findById(paymentMethodId)
    const feePercent = paymentMethodData.withdrawal.feePercent 
    const feePerTransaction = paymentMethodData.withdrawal.feePerTransaction
    
    const fee =  (amount * (feePercent/100)) + feePerTransaction
    const gameMoneny = amount

    const requestsAt = new Date()

    const newTransaction = new CustomerWithdrawalTransaction({
        "adminId": adminId,
        "agentId": agentId,
        "customerId": customerId,
        "paymentMethodId": paymentMethodId,
        "orderNumber": orderNumber,
        "amount": -amount,
        "bank": bank,
        "accountNumber": accountNumber,
        "name": name,
        "fee": fee,
        "gamemoney": gameMoneny,
        "requestsAt": requestsAt,
        "status": "pending"
    })
    const transactionData = await newTransaction.save();

    await updateWallet(customerId, -gameMoneny, currencyId)

    if(transactionData) {
        res.status(200).json(response.createDepositTransactionSuccess)
    } else {
        res.status(400).json(response.createDepositTransactionFailed)
    }
}