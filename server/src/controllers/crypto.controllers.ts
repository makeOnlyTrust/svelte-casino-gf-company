import { Request, Response } from 'express';
import { getNetwork, getAddress } from "../services/api/gfcrypto.services"
import { ApiFailed } from "../config/response"
import * as response from "../config/response";
import CryptoRate from "../models/cryptoRate.model";
import { JwtGaurdRequest } from "../middlewares/account.middlewares";

export const getNetWork = async (req: Request, res: Response) => {
    const symbol = typeof req.query.symbol === 'string' ? req.query.symbol : undefined;

    try {
        const network: any = await getNetwork(symbol)

        if (network.status === 200) {
            res.status(200).json(network.data)
        } else {
            res.status(400).json(ApiFailed)
        }
    } catch (_) {
        res.status(400).json(ApiFailed)
    }
};

export const getAddressByNetwork = async (req: JwtGaurdRequest, res: Response) => {
    const userId = req.userId;
    const network = typeof req.query.network === 'string' ? req.query.network : undefined;

    try {
        const address: any = await getAddress(userId, network)
        if (address.status === 200) {
            res.status(200).json(address.data)
        } else {
            res.status(400).json(ApiFailed)
        }
    } catch (error) {
        res.status(400).json(ApiFailed)
    }

}
export const getCryptoRate = async (req: Request, res: Response) => {
    const currencySymbol = req.query.currencySymbol;

    try {
        const data = await CryptoRate.findOne(
            {
                symbol: currencySymbol,
            }
        );
        if (!data || !data.krw) {
            res.status(400).json(response.getTypesFailed);
            return;
        }
        res.status(200).json({
            rate: data.krw
        });
    } catch {
        res.status(400).json(response.getVendorsFailed);
    }

}
