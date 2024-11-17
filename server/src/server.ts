import dotenv from 'dotenv';
import path from 'path';
import https from 'https';
import http from 'http';
import fs from 'fs';
import express, { Application, NextFunction, Request, Response } from 'express';
import cors, { CorsOptions } from 'cors';
import cookieParser from 'cookie-parser';
import cron from 'node-cron';

import { runSportOddsApi, runSportOddResultsApi } from './services/sports/index.services';

// Utils
import { initSocket } from './utils/socket';

const app: Application = express();
let server;

if (process.env.NODE_ENV === 'production') {
    dotenv.config({ path: path.resolve(__dirname, '../.env.production') });
    const sslURL = process.env.SSL_URL;
    const options = {
        key: fs.readFileSync(sslURL + '/privkey.pem'),
        cert: fs.readFileSync(sslURL + '/cert.pem'),
        ca: fs.readFileSync(sslURL + '/chain.pem'),

        requestCert: false,
        rejectUnauthorized: false
    };
    server = https.createServer(options, app);
} else {
    dotenv.config({ path: path.resolve(__dirname, '../.env.development') });
    server = http.createServer(app);
}

app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
    const contentTypes = [
        'bet',
        'win',
        'cancel',
        'charge',
        'adjust',
        'promo_win',
        'exceed_credit'
    ];
    const contentType = req.get('Content-Type') || '';

    if (
        contentTypes.includes(contentType) &&
        contentType !== 'application/json'
    ) {
        let data = '';

        req.on('data', (chunk) => {
            data += chunk;
        });

        req.on('end', () => {
            try {
                req.body = JSON.parse(data);
                next();
            } catch (err) {
                res.status(400).send('Invalid JSON');
            }
        });
    } else {
        next();
    }
});

const allowedOriginsWithCredentials: string[] = [
    'http://localhost:9002',
    'http://127.0.0.1:9002',
    'http://localhost:9001',
    'http://localhost',
    'http://127.0.0.1:9001',
    'http://localhost:10010',
    'https://demo.goodfriendsgaming.com',
    'http://localhost:5173',
    "172.105.196.204",
    "172.104.101.199",
    "172.105.217.18",
    "139.162.121.245"
];

const allowedOriginsWithoutCredentials: string[] = [
    '45.76.148.155',
    '45.77.174.118',
    '127.0.0.1',
    '45.76.185.1',
    '45.77.248.182',
    '45.76.179.104',
    '45.76.179.39',
    '45.76.160.35',
    '52.74.15.8',
    '139.180.209.126',
    'https://backoffice.honorlink.org',
    'http://localhost:9002',
    'http://localhost:9004',
    '172.105.196.204',
    "172.104.101.199",
    "172.105.217.18",
    "139.162.121.245"
];

app.use((req: Request, res: Response, next: NextFunction) => {
    const origin: string | undefined = req.header('Origin');
    let corsOptions: CorsOptions;

    if (origin) {
        if (allowedOriginsWithCredentials.includes(origin)) {
            corsOptions = {
                origin: allowedOriginsWithCredentials,
                credentials: true
            };
        } else {
            corsOptions = {
                origin: allowedOriginsWithoutCredentials,
                credentials: false
            };
        }
    } else {
        corsOptions = { origin: false, credentials: false };
    }

    cors(corsOptions)(req, res, next);
});

app.use((
    req: Request & {
        clientAdminId?: string
    },
    res: Response,
    next: NextFunction
) => {
    req.clientAdminId = req.headers.clientadminid as string;
    next();
});

// account
import accountRouter from './routes/account.routes';
app.use('/api/account', accountRouter);

//casino
import casinoRouter from './routes/casino.routes';
app.use('/api/casino', casinoRouter);

//favorite
import favoriteRouter from './routes/favorite.routes';
app.use('/api/favorite', favoriteRouter);

//info
import infoRouter from './routes/info.routes';
app.use('/api/info', infoRouter);

//minigame
import minigameRouter from './routes/minigame.routes';
app.use('/api/minigame', minigameRouter);

//payment
import paymentRouter from './routes/payment.routes';
app.use('/api/payment', paymentRouter);

//casinoBetting
import casinoBetting from './routes/casinoBetting.routes';
app.use('/api/betting', casinoBetting);

//promotion
import promotionRouter from './routes/promotion.routes';
app.use('/api/promotion', promotionRouter);

//sports
import sports from './routes/sports.routes';
app.use('/api/sports', sports);

//sports
import sportsMainLeagues from './routes/sportsMainLeagues.routes';
app.use('/api/sports', sportsMainLeagues);

//sports
import sportsBettingCards from './routes/sportsBettingCards.routes';
app.use('/api/sports', sportsBettingCards);

//sports
import sportsOddNames from './routes/sportsMainOddNames.routes';
app.use('/api/sports', sportsOddNames);

//crypto
import cryptoRouter from "./routes/crypto.routes";
app.use('/api/gfcrypto', cryptoRouter)

// deposit
import depositRouter from "./routes/deposit.routes"
app.use('/api/deposit', depositRouter)

// paymentgate
import paymentGateRouter from "./routes/pg.routes"
app.use('/api/pg', paymentGateRouter)

import { connectDB } from './utils/dbconnect';
import { minigameSchedule } from "./services/minigame";

const port: number = Number(process.env.PORT);

connectDB().then(() => {
    const server = app.listen(port, () => {
        console.log(`Server is running on PORT ${port}`);

        initSocket(server);

        console.log(' ----- Sports Odds API Running ----- ');
        runSportOddsApi();
        runSportOddResultsApi();
    });

    cron.schedule('15 * * * * *', async () => {
        await minigameSchedule(1);
    }, {
        scheduled: true,
        timezone: "Asia/Seoul"
    });
    cron.schedule('15 */2 * * * *', async () => {
        await minigameSchedule(2);
    }, {
        scheduled: true,
        timezone: "Asia/Seoul"
    });
    cron.schedule('15 */3 * * * *', async () => {
        await minigameSchedule(3);
    }, {
        scheduled: true,
        timezone: "Asia/Seoul"
    });
    cron.schedule('15 */4 * * * *', async () => {
        await minigameSchedule(4);
    }, {
        scheduled: true,
        timezone: "Asia/Seoul"
    });
    // cron.schedule('*/5 * * * * *', async () => {
    cron.schedule('15 */5 * * * *', async () => {
        await minigameSchedule(5);
    }, {
        scheduled: true,
        timezone: "Asia/Seoul"
    });
});
