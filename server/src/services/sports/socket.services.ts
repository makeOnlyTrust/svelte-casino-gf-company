// Data access
import * as SportsOdds from "../../data-access/sportsOdds";
import * as Timestamp from "../../data-access/timestamp";
import { getTimestampKey } from '../../data-access/utils';

// Utils
import { getSocketIO } from "../../utils/socket";

export const emitAllMatches = async (sportsName: string, DBModel: any) => {
    const oddsData = await SportsOdds.findMatchByLeague(DBModel, sportsName);

    const timestampData = await Timestamp.getTimestamp({
        sportsName: getTimestampKey(sportsName),
        type: 'odds'
    });

    const io = getSocketIO();

    io.emit(`${sportsName}-odds`, {
        odd: oddsData,
        timestamp: timestampData
    });
}