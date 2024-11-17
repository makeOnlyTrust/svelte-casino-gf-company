import { Request, Response } from 'express';
import * as response from '../config/response';
import CustomerDepositTransaction from '../models/customerDepositTransaction.model';
import PaymentMethod from '../models/paymentMethod.model';
import WithdrawalConditions from '../models/withdrawalConditions.model';

export const createDepositTransaction = async (req: Request, res: Response) => {
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
    const feePercent = paymentMethodData.deposit.feePercent 
    const feePerTransaction = paymentMethodData.deposit.feePerTransaction
    
    const fee =  (amount * (feePercent/100)) + feePerTransaction
    const bonus = 0
    const gameMoneny = amount + bonus

    const requestsAt = new Date()

    const newTransaction = new CustomerDepositTransaction({
        "adminId": adminId,
        "agentId": agentId,
        "customerId": customerId,
        "paymentMethodId": paymentMethodId,
        "orderNumber": orderNumber,
        "amount": amount,
        "bank": bank,
        "accountNumber": accountNumber,
        "name": name,
        "fee": fee,
        "gamemoney": gameMoneny,
        "bonus": bonus,
        "requestsAt": requestsAt,
        "status": "pending"
    })

    const transactionData = await newTransaction.save();

    const existingCondition = await WithdrawalConditions.findOne({
        customerId: customerId,
        currencyId: currencyId
    });

    if (!existingCondition) {
        const newWithdrawalConditions = new WithdrawalConditions({
            "customerId": customerId,
            "currencyId": currencyId,
            "totalDeposited": 0,
            "totalUsed": 0
        })

        await newWithdrawalConditions.save()
    }
    
    if(transactionData) {
        res.status(200).json(response.createDepositTransactionSuccess)
    } else {
        res.status(400).json(response.createDepositTransactionFailed)
    }
} 

export const getTransactions = async (req: Request, res: Response) => {
    const customerId = typeof req.query.customerId === 'string' ? req.query.customerId : undefined;

    const transactions = await CustomerDepositTransaction.find({ customerId })
    .populate({
      path: 'paymentMethodId',
      model: 'PaymentMethod',
      populate: {
        path: 'currencyId',
        model: 'Currency'
      }
    })
    .sort({ requestsAt: -1 });

    res.status(200).json(transactions)
}


