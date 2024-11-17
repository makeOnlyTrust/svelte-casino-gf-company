import { Api as axios }  from "@src/interceptors/Api.js";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

class SportsApi {
  fetchMainOdds = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/api/sports/get-main-odds`);

      return res.data;
    } catch (err) {
      console.error(err);
    }
  }

  fetchOdds = async (sportsName) => {
    try {
      const res = await axios.get(`${SERVER_URL}/api/sports/get-matches/${sportsName}`);

      return res;
    } catch (err) {
      console.log(err);
    }
  };

  fetchOddNames = async (sportsName) => {
    try {
      const res = await axios.post(`${SERVER_URL}/api/sports/get-odd-name`,{
        sportsName: sportsName,
        type: 'odds'
      });

      console.log(res);

      return res;
    } catch (err) {
      console.log(err);
    }
  };

  fetchLeagues = async (sportsName, userId) => {
    try {
      const res = await axios.post(`${SERVER_URL}/api/sports/get-league-list/${sportsName}`, {
        userId: userId
      });

      return res;
    } catch (err) {
      console.log(err);
    }
  };

  fetchMatchesByLeagueId = async (sportsName, id) => {
    try {
      const res = await axios.post(`${SERVER_URL}/api/sports/get-metches-by-league/${sportsName}`, {
        id: id
      });

      return res;
    } catch (err) {
      console.log(err);
    }
  };

  fetchMatchById = async (sportsName, id) => {
    try {
      const res = await axios.post(`${SERVER_URL}/api/sports/get-match/${sportsName}`, {
        id: id
      });

      return res;
    } catch (err) {
      console.log(err);
    }
  };

  fetchBettingCardByType = async (customerId, bettingType) => {
    try {
      const res = await axios.post(`${SERVER_URL}/api/sports/betting-card-by-type`, {
        customerId,
        bettingType
      });

      return res;
    } catch (err) {
      console.error(err);
    }
  }

  addSingleBetting = async (customerId, bettingCards) => {
    try {
      const res = await axios.post(`${SERVER_URL}/api/sports/add-single-betting-cards`, {
        customerId,
        bettingCards
      });

      return res;
    } catch (err) {
      console.error(err);
    }
  }

  addMultipleBetting = async (customerId, bettingCards, bettingAmount) => {
    try {
      const res = await axios.post(`${SERVER_URL}/api/sports/add-multiple-betting-cards`, {
        customerId,
        bettingCards,
        bettingAmount
      });

      return res;
    } catch (err) {
      console.error(err);
    }
  }
}

export default new SportsApi();
