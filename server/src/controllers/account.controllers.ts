import { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

// Config
import * as response from '../config/response';
import * as setting from '../config/setting.config';

// Utils
import * as utils from '../utils/library';
import { createNewWallet } from "../services/api/gfcrypto.services"
import * as nodemailer from '../utils/nodemailer';

// Model
import Wallet from '../models/wallet.model';
import AuthCode from '../models/authCode.model';
import Customer from '../models/customer.model';
import Currency from '../models/currency.model';
import AgentCode from '../models/agent.model';
import CryptoNetwork from '../models/cryptoNetwork.model';

// Services
import { smsSend } from "../services/api/smsApi.services"
import { ObjectId } from "mongodb";
import { JwtGaurdRequest } from "../middlewares/account.middlewares";

// common
export const sendEmail = async (req: Request, res: Response) => {
    const { email } = req.body;
    const authCode: string = utils.generateRandomCode(5);

    try {
        const newAuthCode = new AuthCode({
            code: authCode,
            regDate: new Date(),
            isUsed: false
        });
        await newAuthCode.save();

        await nodemailer.sendEmail(
            email,
            `Please enter your verification code. ${authCode}`
        );
        res.status(200).json(response.emailSendSuccess);
    } catch (error) {
        res.status(400).json(response.emailFailedSend);
    }
};

export const sendPhone = async (req: Request, res: Response) => {
    const { phone } = req.body;
    const authCode: string = utils.generateRandomCode(5);

    const newAuthCode = new AuthCode({
        code: authCode,
        regDate: new Date(),
        isUsed: false
    });
    await newAuthCode.save();

    const smsRes: any = await smsSend(phone, `Please enter verification code: ${authCode}`)

    if (smsRes.data.http_code === 200) {
        res.status(200).json(response.smsSendSuccess);
    } else {
        res.status(400).json(response.smsFailedSend);
    }
};

export const emailCheck = async (req: Request, res: Response) => {
    const { authCode, email } = req.body;

    try {
        const check = await AuthCode.findOne({
            code: authCode,
            regDate: {
                $gte: new Date(
                    new Date().getTime() -
                    setting.EMAIL_VERIFICATION_TIME * 60000
                )
            },
            isUsed: false
        });

        if (check) {
            await AuthCode.updateOne(
                {
                    code: authCode,
                    isUsed: false
                },
                {
                    $set: {
                        isUsed: true
                    }
                }
            );

            await Customer.updateOne(
                {
                    email
                },
                {
                    $set: {
                        'info.verify.email': true
                    }
                }
            );

            res.status(200).json(response.authCodeValidationSuccess);
        } else {
            res.status(400).json(response.authCodeValidationInvalid);
        }
    } catch {
        res.status(400).json(response.authCodeValidationFailed);
    }
};

export const phoneCheck = async (req: Request, res: Response) => {
    const { authCode, email, name, phone } = req.body;

    try {
        const check = await AuthCode.findOne({
            code: authCode,
            regDate: {
                $gte: new Date(
                    new Date().getTime() -
                    setting.EMAIL_VERIFICATION_TIME * 60000
                )
            },
            isUsed: false
        });

        if (check) {
            await AuthCode.updateOne(
                {
                    code: authCode,
                    isUsed: false
                },
                {
                    $set: {
                        isUsed: true
                    }
                }
            );

            await Customer.updateOne(
                { email },
                {
                    $set: {
                        'info.verify.phoneNumber': true,
                        'info.phoneNumber': phone.replace("+82", "0"),
                        'info.name': name
                    }
                }
            );

            res.status(200).json(response.authCodeValidationSuccess);
        } else {
            res.status(400).json(response.authCodeValidationInvalid);
        }
    } catch {
        res.status(400).json(response.authCodeValidationFailed);
    }
};

export const agentCodeAdd = async (req: Request, res: Response) => {
    const { email, agentCode } = req.body;

    try {
        const check = await AgentCode.findOne({
            code: agentCode
        });

        if (check) {
            await Customer.findOneAndUpdate(
                { email: email },
                { $set: { 'info.agentId': check._id } },
                { new: true }
            );

            res.status(200).json(response.agentAddedSuccess);
        } else {
            res.status(400).json(response.agentCodeValidationInvalid);
        }
    } catch {
        res.status(400).json(response.agentCodeValidationFailed);
    }
};

export const socialSignUp = async (req: Request, res: Response) => {
    const { admin_idx, email, password } = req.body;

    try {

        const currencyList = await Currency.find({});
        const wallet = currencyList.map((currency: any) => {
            return {
                currencyId: currency._id,
                balance: 0
            };
        });

        const newWallet = new Wallet({
            wallet,
            casino: {
                casinoBalance: 0,
                currencyId: currencyList.length > 0 ? currencyList[0]._id : null
            }
        });
        const newWalletData = await newWallet.save();

        const nick: string = `user${utils.generateRandomNumber(10)}`;

        const newCustomer = new Customer({
            adminId: admin_idx,
            email,
            password: utils.hashWithSHA256(password),
            nickname: nick,
            createAt: new Date(),
            walletId: newWalletData._id,
            isAdmin: false
        });

        let userData = await newCustomer.save();
        if (userData) {
            // create wallet
            await createNewWallet(userData._id.toString());
            res.status(200).json(response.signUpSuccess);
        } else {
            res.status(400).json(response.signUpFailed);
        }
    } catch {
        res.status(400).json(response.signUpFailed);
    }
};

// sign-in
export const signIn = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        let data: any = await Customer.findOne({
            email,
            password: utils.hashWithSHA256(password)
        });

        if (data) {
            const accessToken = jwt.sign(
                {
                    userId: data._id,
                    adminId: data.adminId
                },
                String(process.env.ACCESS_SECRET),
                { expiresIn: '1m', issuer: data.email }
            );
            const refreshToken = jwt.sign(
                {
                    userId: data._id,
                    adminId: data.adminId
                },
                String(process.env.REFRESH_SECRET),
                { expiresIn: '1h', issuer: data.email }
            );

            res.cookie('accessToken', accessToken, {
                secure: process.env.NODE_ENV === 'production' ? true : false,
                httpOnly: process.env.NODE_ENV === 'production' ? true : false,
                sameSite:
                    process.env.NODE_ENV === 'production' ? 'strict' : 'lax'
            });
            res.cookie('refreshToken', refreshToken, {
                secure: process.env.NODE_ENV === 'production' ? true : false,
                httpOnly: process.env.NODE_ENV === 'production' ? true : false,
                sameSite:
                    process.env.NODE_ENV === 'production' ? 'strict' : 'lax'
            });

            await Customer.updateOne(
                { email },
                {
                    $set: {
                        lastLogin: new Date()
                    }
                }
            );
            res.status(200).json(
                Object.assign(
                    response.signInSuccess,
                    {
                        accessToken,
                        refreshToken
                    }
                )
            );
        } else {
            res.status(400).json(response.memberValidationInvalid);
        }
    } catch {
        res.status(400).json(response.signInFailed);
    }
};

export const refresh = async (req: Request, res: Response) => {
    try {
        const token = req.headers.refreshtoken as string;
        const data = jwt.verify(
            token,
            String(process.env.REFRESH_SECRET)
        ) as JwtPayload;

        let userData: any = await Customer.findOne({
            _id: new ObjectId(data.userId),
        });
        if (!userData) {
            res.status(400).json(response.memberValidationInvalid);
            return;
        }
        const accessToken = jwt.sign(
            {
                userId: userData._id,
                adminId: userData.adminId
            },
            String(process.env.ACCESS_SECRET),
            { expiresIn: '1m', issuer: userData.email }
        );
        const refreshToken = jwt.sign(
            {
                userId: userData._id,
                adminId: userData.adminId
            },
            String(process.env.REFRESH_SECRET),
            { expiresIn: '1h', issuer: userData.email }
        );

        res.cookie('accessToken', accessToken, {
            secure: process.env.NODE_ENV === 'production' ? true : false,
            httpOnly: process.env.NODE_ENV === 'production' ? true : false,
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax'
        });
        res.cookie('refreshToken', refreshToken, {
            secure: process.env.NODE_ENV === 'production' ? true : false,
            httpOnly: process.env.NODE_ENV === 'production' ? true : false,
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax'
        });
        res.status(200).json(
            Object.assign(
                response.tokenRecreate,
                {
                    accessToken,
                    refreshToken
                }
            )
        );
    } catch (error) {
        res.status(400).json(response.tokenVerificationFailed);
    }
};

export const signInSuccess = async (req: Request, res: Response) => {
    try {
        const token = req.headers.accesstoken as string;
        const data = jwt.verify(
            token,
            String(process.env.ACCESS_SECRET)
        ) as JwtPayload;
        let userData: any = await Customer.aggregate([
            {
                $match: {
                    $and: [
                        {
                            _id: {
                                $eq: new ObjectId(data.userId)
                            },
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: 'wallets',
                    localField: 'walletId',
                    foreignField: '_id',
                    as: 'wallets'
                }
            },
            {
                $unwind: '$wallets'
            },
            {
                $addFields: {
                    currentCurrecnyId: '$wallets.casino.currencyId'
                }
            },
            {
                $lookup: {
                    from: 'currencies',
                    localField: 'currentCurrecnyId',
                    foreignField: '_id',
                    as: 'currency'
                }
            },
            {
                $unwind: '$currency'
            },
            {
                $addFields: {
                    currentCurrecnySymbol: '$currency.currencySymbol',
                    currentCurrecnyImage: '$currency.image'
                }
            }
        ]);

        if (userData.length === 0) {
            res.status(400).json(response.memberValidationInvalid);
            return;
        }
        const { password, createAt, lastLogin, ...others } = userData[0];
        res.status(200).json(others);
    } catch (error) {
        res.status(400).json(response.tokenVerificationFailed);
    }
};

// sign-out
export const signOut = (req: Request, res: Response) => {
    try {
        res.cookie('accessToken', '');
        res.cookie('refreshToken', '');
        res.status(200).json(response.signOutSuccess);
    } catch (error) {
        res.status(400).json(response.signOutSuccess);
    }
};

// profile
export const changeProfileImage = async (req: Request, res: Response) => {
    const { customerIdx, profileImage } = req.body;

    try {
        await Customer.updateOne(
            { _id: customerIdx },
            {
                $set: {
                    profileImage
                }
            }
        );
        res.status(200).json(response.profileImageChangeSuccess);
    } catch {
        res.status(400).json(response.profileImageChangeFailed);
    }
};

export const changeNick = async (req: Request, res: Response) => {
    const { customerIdx, nick } = req.body;

    try {
        const temp = await Customer.findOne(
            {
                _id: new ObjectId(customerIdx)
            },
            {
                adminId: 1,
                _id: 0
            }
        );
        if (!temp || !temp.adminId) {
            res.status(400).json(response.nickChangeFailed);
            return;
        }
        const duplicateNickName = await Customer.find(
            {
                nickname: nick,
                adminId: temp.adminId,
                _id: {
                    $nin: [new ObjectId(customerIdx)]
                }
            }
        )

        if (duplicateNickName.length !== 0) {
            res.status(400).json(response.nickAlreadyTaken);
        } else {
            await Customer.updateOne(
                { _id: customerIdx },
                {
                    $set: {
                        nickname: nick
                    }
                }
            );
            res.status(200).json(response.nickChangeSuccess);
        }
    } catch {
        res.status(400).json(response.nickChangeFailed);
    }
};

export const getWallet = async (req: JwtGaurdRequest, res: Response) => {
    const userId = req.userId;

    try {
        const data = await Customer.aggregate([
            {
                $match: {
                    $and: [
                        {
                            _id: {
                                $eq: new ObjectId(userId)
                            }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: 'wallets',
                    localField: 'walletId',
                    foreignField: '_id',
                    pipeline: [
                        {
                            $unwind: '$wallet'
                        },
                        {
                            $lookup: {
                                from: 'currencies',
                                localField: 'wallet.currencyId',
                                foreignField: '_id',
                                as: 'currencies'
                            }
                        },
                        {
                            $unwind: '$currencies'
                        }
                    ],

                    as: 'wallets'
                }
            },
            {
                $unwind: '$wallets'
            },
            {
                $addFields: {
                    currentId: '$wallets.casino.currencyId'
                }
            }
        ]);

        if (data.length === 0) {
            res.status(400).json(response.userNameInvalid);
            return;
        } else
            res.status(200).json({
                wallet: data
            });
    } catch {
        res.status(400).json(response.getWalletFailed);
    }
};
export const getNetwork = async (req: Request, res: Response) => {
    const { currencyId } = req.body;
    try {
        const data = await CryptoNetwork.findOne({ currencyId });
        if (data) {
            res.status(200).json(data);
        } else {
            res.status(200).json({});
        }
    } catch {
        res.status(400).json(response.getWalletFailed);
    }
};
