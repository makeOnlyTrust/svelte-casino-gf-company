import MinigameBetting from "../../models/minigameBetting.model";
import MinigameList from "../../models/minigameList.model";
import MinigameResult from "../../models/minigameResult.model";
import { dateFormat } from "../../utils/dateFormat";
import { updateWallet } from "../wallet.services";
import Customer from "../../models/customer.model";
import { getSocketIO } from "../../utils/socket";

export const getMinigameIndex = (date: Date, interval: number) => {
    let hour = date.getUTCHours() + 9 > 24 ? date.getUTCHours() + 9 - 24 : date.getUTCHours() + 9;
    const min = date.getMinutes();
    if (hour === 24 && min > 0) {
        hour = 0;
    }
    return Math.floor((hour * 60 + min) / interval) + 1;
}

export const minigameSchedule = async (interval: number) => {
    try {
        const list = await MinigameList.find({ interval });
        const socket = getSocketIO();

        // console.log(list.map(e => e.gameId));
        await Promise.all(
            list.map(async e => {
                const category = e.category;
                const betList = await MinigameBetting.find({
                    "details.gameId": e.gameId,
                    "transactions.txType": "bet",
                    isChecked: false,
                    checkedId: null
                });

                await Promise.all(
                    betList.map(async el => {
                        if (!el.transactions || !el.details || !el.currencyId || !el.customerId) {
                            return;
                        }
                        const multiplier = el.details.multiplier;
                        const bet = el.details.bet;

                        const date = new Date(Number(el.transactions.id));
                        const _dateFormat = dateFormat(date);
                        const index = getMinigameIndex(date, interval);
                        // console.log(e.gameId)
                        // console.log(_dateFormat)
                        // console.log(index.toString())
                        const result = await MinigameResult.findOne({
                            gameId: e.gameId,
                            date: {
                                "$eq": _dateFormat
                            },
                            index: index.toString()
                        })
                        switch (category) {
                            case "powerball":
                                // console.log(bet)
                                const powerBall = result!.result.powerBall;
                                const regularBall = result!.result.regularBall;
                                // console.log(powerBall)
                                // console.log(regularBall)
                                // console.log(multiplier)
                                // powerBall: { number: '1', section: 'A', odd: true, over: false },
                                // regularBall: {
                                //     number: '18 , 25 , 23 , 17 , 16',
                                //         sum: '99',
                                //         section: 'F',
                                //         odd: true,
                                //         over: true,
                                //         size: '대'
                                // }

                                let resultAmount = 0;

                                if (bet.section === regularBall.section) {
                                    resultAmount = Number(el.details.amount) * Number(multiplier);
                                    // console.log('wowowow')
                                } else if (bet.BigMiddleSmall === regularBall.size) {
                                    resultAmount = Number(el.details.amount) * Number(multiplier);
                                    // console.log('wowowow1')
                                } else if (bet.POddEven === (powerBall.odd ? 'odd' : 'even') && bet.PUnderOver === (powerBall.over ? 'over' : 'under')) {
                                    resultAmount = Number(el.details.amount) * Number(multiplier);
                                    // console.log('wowowow2')
                                } else if (bet.OddEven === (regularBall.odd ? 'odd' : 'even') && bet.UnderOver === (regularBall.over ? 'over' : 'under')) {
                                    resultAmount = Number(el.details.amount) * Number(multiplier);
                                    // console.log('wowowow3')
                                } else if (
                                    (bet.POddEven === (powerBall.odd ? 'odd' : 'even') && bet.PUnderOver === '' && bet.OddEven === '' && bet.UnderOver === '') ||
                                    (bet.POddEven === '' && bet.PUnderOver === (powerBall.over ? 'over' : 'under') && bet.OddEven === '' && bet.UnderOver === '') ||
                                    (bet.POddEven === '' && bet.PUnderOver === '' && bet.OddEven === (regularBall.odd ? 'odd' : 'even') && bet.UnderOver === '') ||
                                    (bet.POddEven === '' && bet.PUnderOver === '' && bet.OddEven === '' && bet.UnderOver === (regularBall.over ? 'over' : 'under'))
                                ) {
                                    resultAmount = Number(el.details.amount) * Number(multiplier);
                                    // console.log('wowowow4')
                                } else {
                                    resultAmount = 0;
                                    // console.log('lose')
                                }

                                if (resultAmount !== 0 && !isNaN(resultAmount)) {
                                    // console.log(`resultAmount : ${resultAmount}`);
                                    const user = await Customer.findOne({
                                        _id: el.customerId
                                    })
                                    if (!user || !user._id) {
                                        return;
                                    }
                                    const success = await updateWallet(String(user._id), resultAmount, el.currencyId.toString());
                                    // console.log(success);
                                    if (success === 'success') {

                                    } else {
                                        return;
                                    }
                                }

                                const betResult = await MinigameBetting.create({
                                    customerId: el.customerId,
                                    currencyId: el.currencyId,
                                    amount: resultAmount,
                                    isChecked: false,
                                    checkedId: null,
                                    transactions: {
                                        id: date.getTime(), // timestamp
                                        txType: "win", // “bet”, “win”
                                        refererId: el.transactions.refererId,
                                        amount: resultAmount,
                                        processedAt: date.toISOString(),
                                    },
                                    details: {
                                        gameId: el.details.gameId,
                                        bet: el.details.bet,
                                        amount: el.details.amount,
                                        multiplier: el.details.multiplier
                                    }
                                });

                                const up = await MinigameBetting.updateOne({
                                    _id: el._id
                                }, {
                                    $set: {
                                        isChecked: true,
                                        checkedId: betResult._id
                                    }
                                })
                                // console.log(up);
                                break;
                            case "ladder":
                                // console.log(bet)
                                const ladderResult = result!.result;
                                // console.log(ladderResult)

                                let ladderResultAmount = 0;

                                if (
                                    (bet.LeftRight === ladderResult.start && bet.ThreeFour === '' && bet.OddEven === '') ||
                                    (bet.LeftRight === '' && bet.ThreeFour === ladderResult.line && bet.OddEven === '') ||
                                    (bet.LeftRight === '' && bet.ThreeFour === '' && bet.OddEven === (ladderResult.odd ? 'odd' : 'even'))
                                ) {
                                    ladderResultAmount = Number(el.details.amount) * Number(multiplier);
                                } else {
                                    ladderResultAmount = 0;
                                }

                                if (ladderResultAmount !== 0 && !isNaN(ladderResultAmount)) {
                                    // console.log(`ladderResultAmount : ${ladderResultAmount}`);
                                    const user = await Customer.findOne({
                                        _id: el.customerId
                                    })
                                    if (!user || !user._id) {
                                        return;
                                    }
                                    const success = await updateWallet(String(user._id), ladderResultAmount, el.currencyId.toString());
                                    // console.log(success);
                                    if (success === 'success') {

                                    } else {
                                        return;
                                    }
                                }

                                const ladderBetResult = await MinigameBetting.create({
                                    customerId: el.customerId,
                                    currencyId: el.currencyId,
                                    amount: ladderResultAmount,
                                    isChecked: false,
                                    checkedId: null,
                                    transactions: {
                                        id: date.getTime(), // timestamp
                                        txType: "win", // “bet”, “win”
                                        refererId: el.transactions.refererId,
                                        amount: ladderResultAmount,
                                        processedAt: date.toISOString(),
                                    },
                                    details: {
                                        gameId: el.details.gameId,
                                        bet: el.details.bet,
                                        amount: el.details.amount,
                                        multiplier: el.details.multiplier
                                    }
                                });

                                const ladderUp = await MinigameBetting.updateOne({
                                    _id: el._id
                                }, {
                                    $set: {
                                        isChecked: true,
                                        checkedId: ladderBetResult._id
                                    }
                                })
                                // console.log(ladderUp);
                                break;
                            case "keno":
                                // console.log(bet)
                                const kenoResult = result!.result;
                                // console.log(kenoResult)

                                let kenoResultAmount = 0;
                                if (e.gameId === 'ntry-keno') {
                                    if (
                                        bet.OddEven === (kenoResult.odd ? 'odd' : 'even') && bet.UnderOver === '' ||
                                        bet.OddEven === '' && bet.UnderOver === (kenoResult.over ? 'over' : 'under')
                                    ) {
                                        kenoResultAmount = Number(el.details.amount) * Number(multiplier);
                                    } else {
                                        kenoResultAmount = 0;
                                    }
                                } else if (e.gameId === 'dh-keno') {
                                    // {
                                    //     "number": "16,55,68,65,5,25,61,11,38,42,69,43,47,34,56,31,44,17,41,49,28,40",
                                    //     "lucky": {
                                    //         "number": "40",
                                    //         "section": "G",
                                    //         "odd": false,
                                    //         "over": true
                                    //     },
                                    //     "sum": {
                                    //         "section": "C",
                                    //         "odd": true,
                                    //         "over": true,
                                    //         "sum": "885"
                                    //     }
                                    // }
                                    const kenoLucky = kenoResult.lucky;
                                    const kenoSum = kenoResult.sum;

                                    if (
                                        (bet.POddEven === (kenoLucky.odd ? 'odd' : 'even') && bet.PUnderOver === '' && bet.OddEven === '' && bet.UnderOver === '') ||
                                        (bet.POddEven === '' && bet.PUnderOver === (kenoLucky.over ? 'over' : 'under') && bet.OddEven === '' && bet.UnderOver === '') ||
                                        (bet.POddEven === '' && bet.PUnderOver === '' && bet.OddEven === (kenoSum.odd ? 'odd' : 'even') && bet.UnderOver === '') ||
                                        (bet.POddEven === '' && bet.PUnderOver === '' && bet.OddEven === '' && bet.UnderOver === (kenoSum.over ? 'over' : 'under'))
                                    ) {
                                        resultAmount = Number(el.details.amount) * Number(multiplier);
                                        // console.log('wowowow4')
                                    } else {
                                        resultAmount = 0;
                                        // console.log('lose')
                                    }
                                }
                                // console.log(kenoResultAmount);

                                if (kenoResultAmount !== 0 && !isNaN(kenoResultAmount)) {
                                    // console.log(`kenoResultAmount : ${kenoResultAmount}`);
                                    const user = await Customer.findOne({
                                        _id: el.customerId
                                    })
                                    if (!user || !user._id) {
                                        return;
                                    }
                                    const success = await updateWallet(String(user._id), kenoResultAmount, el.currencyId.toString());
                                    // console.log(success);
                                    if (success === 'success') {

                                    } else {
                                        return;
                                    }
                                }

                                const kenoBetResult = await MinigameBetting.create({
                                    customerId: el.customerId,
                                    currencyId: el.currencyId,
                                    amount: kenoResultAmount,
                                    isChecked: false,
                                    checkedId: null,
                                    transactions: {
                                        id: date.getTime(), // timestamp
                                        txType: "win", // “bet”, “win”
                                        refererId: el.transactions.refererId,
                                        amount: kenoResultAmount,
                                        processedAt: date.toISOString(),
                                    },
                                    details: {
                                        gameId: el.details.gameId,
                                        bet: el.details.bet,
                                        amount: el.details.amount,
                                        multiplier: el.details.multiplier
                                    }
                                });

                                const kenoUp = await MinigameBetting.updateOne({
                                    _id: el._id
                                }, {
                                    $set: {
                                        isChecked: true,
                                        checkedId: kenoBetResult._id
                                    }
                                })
                                // console.log(kenoUp);
                                break;
                            default:
                                break;
                        }

                        const latestMinigameBettingHistory: any = await MinigameBetting.aggregate([
                            {
                                $match: {
                                    customerId: el.customerId,
                                    "transactions.txType":
                                        "win"
                                }
                            },
                            {
                                $lookup: {
                                    from: 'minigamelists',
                                    localField: 'details.gameId',
                                    foreignField: 'gameId',
                                    as: 'minigamelists',
                                }
                            },
                            {
                                $unwind: '$minigamelists'
                            },
                            {
                                $lookup: {
                                    from: 'currencies',
                                    localField: 'currencyId',
                                    foreignField: '_id',
                                    as: 'currencies',
                                }
                            },
                            {
                                $unwind: '$currencies'
                            },
                            {
                                $lookup: {
                                    from: 'customers',
                                    localField: 'customerId',
                                    foreignField: '_id',
                                    as: 'customers',
                                }
                            },
                            {
                                $unwind: '$customers'
                            },
                            {
                                $sort: {
                                    _id: -1,
                                }
                            },
                            {
                                $limit: 1,
                            },
                            {
                                $skip: 0,
                            },
                        ]);
                        // socket.to(el.customerId.toString()).emit('minigame-bet-history', latestMinigameBettingHistory[0]);
                        socket.emit('minigame-bet-history', latestMinigameBettingHistory[0]);
                    })
                )
            })
        )
        // await updateWallet('nickname',200);
    } catch (err) {
    }
}
