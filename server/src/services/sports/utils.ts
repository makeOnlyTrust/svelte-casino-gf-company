// Utills
import { reverseDate, getUTCTime } from '../../utils/library';

export const validateSportsType = (sportsName: string) => {
  const validSportsList = [
    'soccer',
    'basketball',
    'baseball',
    'american-football',
    'hockey',
    'cricket',
    'golf',
    'rugby',
    'rugby-league'
  ];

  if (validSportsList.findIndex(ele => ele === sportsName) !== -1) {
    return true;
  } else {
    return false;
  }
}

const getDateKey = (sportsName: string) => {
  switch (sportsName) {
    case 'soccer':
    case 'tennis':
    case 'esports':
    case 'table-tennis':
    case 'darts':
      return 'formatted_date';
    case 'basketball':
    case 'hockey':
    case 'handball':
    case 'volleyball':
    case 'american-football':
    case 'rugby':
    case 'baseball':
    case 'boxing':
    case 'golf':
    case 'rugby-league':
      return 'date';
    default:
      return '';
  }
}

export const sportsOddResultParam = (sportsName: string) => {
  switch (sportsName) {
    case 'soccer':
      return 'soccernew';

    default:
      return '';
  }
}

export const getSportsOddsParam = (sportsName: string) => {
  switch (sportsName) {
    case 'soccer':
    case 'tennis':
    case 'hockey':
    case 'handball':
    case 'volleyball':
    case 'rugby':
    case 'baseball':
    case 'boxing':
    case 'esports':
    case 'golf':
    case 'darts':
      return sportsName;
    case 'basketball':
      return 'basket';
    case 'american-football':
      return 'football';
    case 'table-tennis':
      return 'table_tennis';
    case 'rugby-league':
      return 'rugbyleague';
    default:
      return sportsName;
  }
}

export const getSportsLogoParam = (sportsName: string) => {
  switch (sportsName) {
    case 'soccer':
    case 'tennis':
    case 'hockey':
    case 'handball':
    case 'volleyball':
    case 'baseball':
    case 'boxing':
    case 'esports':
    case 'table-tennis':
    case 'golf':
    case 'basketball':
    case 'darts':
      return sportsName;
    case 'american-football':
      return 'amfootball';
    case 'rugby':
      return 'rugby_union';
    case 'rugby-league':
      return 'rugby_league';
    default:
      return sportsName;
  }
}

export const convertSportsLogoFile = (base64: string) => {
  const imageBuffer = Buffer.from(base64, 'base64');

  return imageBuffer;
}

export const convertSportsOddsType = (sportsName: string, sportsOddsData: any): Array<any> => {
  const resData: Array<any> = [];
  const key = getDateKey(sportsName);

  sportsOddsData.map((category: any) => {
    category.matches.map((match: any) => {
      const formatted_date = reverseDate(match[key]);

      if (category.gid) {
        resData.push({
          ...match,
          league_id: category.id,
          league_gid: category.gid,
          league_name: category.name,
          formatted_date: formatted_date
        });
      } else {
        resData.push({
          ...match,
          league_id: category.id,
          league_gid: category.id,
          league_name: category.name,
          formatted_date: formatted_date
        });
      }
    })
  })

  return resData;
}

export const convertSportsOddResultsType = (oddResultData: any) => {
  const resData: Array<any> = [];

  oddResultData.map((oddResult: any) => {
    const matchData = oddResult.matches.match;

    const leagueData = {
      league_id: oddResult['@id'],
      league_gid: oddResult['@gid'],
      league_name: oddResult['@name'],
      league_file_group: oddResult['@file_group'],
      league_iscup: oddResult['@iscup'],
    }

    if (Array.isArray(matchData)) {
      matchData.map((match: any) => {
        if (match['events']) {
          const formatted_date = reverseDate(match['@formatted_date']);

          resData.push({
            ...leagueData,
            id: match['@id'],
            status: match['@status'],
            timer: match['@timer'],
            date: match['@date'],
            formatted_date: formatted_date,
            time: match['@time'],
            commentary_available: match['@commentary_available'],
            venue: match['@venue'],
            v: match['@v'],
            static_id: match['@static_id'],
            fix_id: match['@fix_id'],
            localteam: match['localteam'],
            visitorteam: match['visitorteam'],
            events: match['events'],
            ht: match['ht'],
            ft: match['ft'],
            et: match['et'],
            penalty: match['penalty'],
          });
        }
      });
    } else if (matchData['events']) {
      const formatted_date = reverseDate(matchData['@formatted_date']);

      resData.push({
        ...leagueData,
        id: matchData['@id'],
        status: matchData['@status'],
        timer: matchData['@timer'],
        date: matchData['@date'],
        formatted_date: formatted_date,
        time: matchData['@time'],
        commentary_available: matchData['@commentary_available'],
        venue: matchData['@venue'],
        v: matchData['@v'],
        static_id: matchData['@static_id'],
        fix_id: matchData['@fix_id'],
        localteam: matchData['localteam'],
        visitorteam: matchData['visitorteam'],
        events: matchData['events'],
        ht: matchData['ht'],
        ft: matchData['ft'],
        et: matchData['et'],
        penalty: matchData['penalty'],
      });
    }
  })

  return resData;
}