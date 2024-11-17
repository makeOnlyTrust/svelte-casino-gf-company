import axios from 'axios';

interface TgetOddsParam {
    type: string;
    timestamp?: string | null | undefined;
    data_start?: string;
    date_end?: string;
    bm?: string;
    market?: string;
    league?: string[];
    match?: string;
};

const SERVER_URL = process.env.SPORTS_API_URL!;
const KEY = process.env.SPORTS_API_KEY!;

export const getOdds = (param: TgetOddsParam): Promise<any> => {
    const SERVER_URL: string = process.env.SPORTS_API_URL!;
    const KEY: string = process.env.SPORTS_API_KEY!;

    const params = {
        ts: param.timestamp,
        date_start: param.data_start,
        date_end: param.date_end,
        bm: param.bm,
        market: param.market,
        league:
            param.league && param.league.length > 0
                ? param.league.join(',')
                : undefined,
        match: param.match
    };

    const query = Object.entries(params)
        .filter(([key, value]) => value !== undefined)
        .map(([key, value]) => `${key}=${value}`)
        .join('&');

    const endpoint = `${SERVER_URL}getfeed/${KEY}/getodds/soccer?cat=${param.type}_10&json=1&${query}`;

    const headers = {
        'Content-Type': 'application/json'
    };

    return new Promise((resolve, reject) => {
        axios
            .get(endpoint, { headers })
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export const getOddResults = (sports: string, param: number): Promise<any> => {
    const SERVER_URL: string = process.env.SPORTS_API_URL!;
    const KEY: string = process.env.SPORTS_API_KEY!;

    const params = param === 0 ? 'home' : `d${param}`;

    const endpoint = `${SERVER_URL}getfeed/${KEY}/${sports}/${params}?json=1`;

    const headers = {
        'Content-Type': 'application/json'
    };

    return new Promise((resolve, reject) => {
        axios
            .get(endpoint, { headers })
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export const getLeagueIds = (): Promise<any> => {
    const endpoint = `${SERVER_URL}getfeed/${KEY}/soccerfixtures/data/mapping?json=1`;

    const headers = {
        'Content-Type': 'application/json'
    };

    return new Promise((resolve, reject) => {
        axios
            .get(endpoint, { headers })
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export const getLeagueSeasons = (): Promise<any> => {
    const endpoint = `${SERVER_URL}getfeed/${KEY}/soccerfixtures/data/seasons?json=1`;

    const headers = {
        'Content-Type': 'application/json'
    };

    return new Promise((resolve, reject) => {
        axios
            .get(endpoint, { headers })
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export const getFixture = (id: string): Promise<any> => {
    const endpoint = `${SERVER_URL}getfeed/${KEY}/soccerfixtures/leagueid/${id}?json=1`;

    const headers = {
        'Content-Type': 'application/json'
    };

    return new Promise((resolve, reject) => {
        axios
            .get(endpoint, { headers })
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export const getTeamAbbr = (): Promise<any> => {
    const endpoint = `${SERVER_URL}getfeed/${KEY}/soccernew/abbr?json=1`;

    const headers = {
        'Content-Type': 'application/json'
    };

    return new Promise((resolve, reject) => {
        axios
            .get(endpoint, { headers })
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export const getHistory = (leagueIds: string[]): Promise<any> => {
    const leagueIdString = leagueIds.join('-');
    const endpoint = `${SERVER_URL}getfeed/${KEY}/soccerhistory/leagueid/${leagueIdString}?json=1`;

    const headers = {
        'Content-Type': 'application/json'
    };

    return new Promise((resolve, reject) => {
        axios
            .get(endpoint, { headers })
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export const getLeague = (leagueId: string): Promise<any> => {
    const endpoint = `${SERVER_URL}getfeed/${KEY}/soccerleague/${leagueId}?json=1`;

    const headers = {
        'Content-Type': 'application/json'
    };

    return new Promise((resolve, reject) => {
        axios
            .get(endpoint, { headers })
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export const getCommentary = (id: string): Promise<any> => {
    /*
        TODO: add date attribute, static_id and league id
    */
    const endpoint = `${SERVER_URL}getfeed/${KEY}/commentaries/${id}.xml?json=1`;

    const headers = {
        'Content-Type': 'application/json'
    };

    return new Promise((resolve, reject) => {
        axios
            .get(endpoint, { headers })
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export const getInjury = (): Promise<any> => {
    const endpoint = `${SERVER_URL}getfeed/${KEY}/soccernew/injuries?json=1`;

    const headers = {
        'Content-Type': 'application/json'
    };

    return new Promise((resolve, reject) => {
        axios
            .get(endpoint, { headers })
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export const getHighlight = (date: number): Promise<any> => {
    const param = date === 0 ? 'home' : `d${date}`;

    const endpoint = `${SERVER_URL}getfeed/${KEY}/soccerhighlights/${param}?json=1`;

    const headers = {
        'Content-Type': 'application/json'
    };

    return new Promise((resolve, reject) => {
        axios
            .get(endpoint, { headers })
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export const getStanding = (leagueId: number): Promise<any> => {
    const endpoint = `${SERVER_URL}getfeed/${KEY}/standings/${leagueId}.xml?json=1`;

    const headers = {
        'Content-Type': 'application/json'
    };

    return new Promise((resolve, reject) => {
        axios
            .get(endpoint, { headers })
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export const getTopscore = (leagueId: number): Promise<any> => {
    const endpoint = `${SERVER_URL}getfeed/${KEY}/topscorers/${leagueId}?json=1`;

    const headers = {
        'Content-Type': 'application/json'
    };

    return new Promise((resolve, reject) => {
        axios
            .get(endpoint, { headers })
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export const getSoccerStats = (type: string, id: string): Promise<any> => {
    const endpoint = `${SERVER_URL}getfeed/${KEY}/soccerstats/${type}/${id}?json=1`;

    const headers = {
        'Content-Type': 'application/json'
    };

    return new Promise((resolve, reject) => {
        axios
            .get(endpoint, { headers })
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export const getHTwoH = (team1Id: string, team2Id: string): Promise<any> => {
    const endpoint = `${SERVER_URL}getfeed/${KEY}/h2h/${team1Id}/${team2Id}?json=1`;

    const headers = {
        'Content-Type': 'application/json'
    };

    return new Promise((resolve, reject) => {
        axios
            .get(endpoint, { headers })
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};
