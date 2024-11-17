import { Request, Response, NextFunction } from 'express';

// Config
import * as response from '../config/response';

// Model
import Customer from '../models/customer.model';
import jwt, { JwtPayload } from "jsonwebtoken";

// sign-up
export const emailCheck = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { email } = req.body;

    let check: any = await Customer.findOne({ email });

    if (!check) {
        next();
    } else {
        res.status(400).json(response.emailDuplicateError);
    }
};

export interface JwtGaurdRequest extends Request {
    userId?: string;
    adminId?: string;
    clientAdminId?: string;
}

// jwtGaurd
export const jwtGaurd = async (
    req: Request & {
        userId?: string,
        adminId?: string
    },
    res: Response,
    next: NextFunction
) => {
    const reqAccessToken: any = req.headers.accesstoken;
    try {
        const accessData = jwt.verify(
            reqAccessToken,
            String(process.env.ACCESS_SECRET)
        ) as JwtPayload;

        req.userId = accessData.userId;
        req.adminId = accessData.adminId;
        next();
    } catch (e) {
        res.status(400).json(response.tokenVerificationFailed);
    }
};
