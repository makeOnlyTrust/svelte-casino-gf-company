import { Request, Response } from 'express';

// Config
import * as response from '../config/response';

// Model
import PaymentMethod from '../models/paymentMethod.model';

export const getPaymentOfCurrency = async (req: Request, res: Response) => {
    const symbol = typeof req.query.symbol === 'string' ? req.query.symbol : undefined;

    try {
        const bankList: any = await PaymentMethod.find({symbol});
        
        res.status(200).json(bankList);
    } catch {
        res.status(400).json(response.ApiFailed);
    }
};