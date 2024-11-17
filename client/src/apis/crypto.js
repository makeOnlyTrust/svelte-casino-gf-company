import { Api as axios }  from "@src/interceptors/Api.js";

const GF_API_KEY = import.meta.env.VITE_GF_API_KEY;
const GF_AFFILIATE_CODE = import.meta.env.VITE_GF_AFFILIATE_CODE;
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export const getNetwork = async (symbol) => {
  try {
    const res = await axios.get(SERVER_URL + `/api/gfcrypto/network?symbol=${symbol}`, {
        headers: {
          'GF-API-KEY': GF_API_KEY,
          'GF-AFFILIATE-CODE': GF_AFFILIATE_CODE,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      }
    );
    if (res.status == 200) {
      return {
        success: true,
        data: res.data
      };
    }

    return {
      success: false,
      data: 'Api Error'
    };
  } catch (err) {
    if (err.response && err.response.request.status == 400)
      return {
        success: false,
        data: err.response.data
      };
    return {
      success: false,
      data: {
        message: 'Bad Internet Connection'
      }
    };
  }
};

export const getAddress = async (network) => {
  try {
    const res = await axios.get(SERVER_URL + `/api/gfcrypto/address?network=${network}`, {
        headers: {
          'GF-API-KEY': GF_API_KEY,
          'GF-AFFILIATE-CODE': GF_AFFILIATE_CODE,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      }
    );

    if (res.status == 200) {
      return {
        success: true,
        data: res.data
      };
    }
    /// add more case here.
    return {
      success: false,
      data: 'Sign in Failed'
    };
  } catch (err) {
    if (err.response && err.response.request.status == 400)
      return {
        success: false,
        data: err.response.data
      };
    return {
      success: false,
      data: {
        message: 'Bad Internet Connection'
      }
    };
  }
};

export const getCryptoRate = async ({ currencySymbol }) => {
  try {
    const res = await axios.get(SERVER_URL + `/api/gfcrypto/rate?currencySymbol=${currencySymbol}`, {
        headers: {
          'GF-API-KEY': GF_API_KEY,
          'GF-AFFILIATE-CODE': GF_AFFILIATE_CODE,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      }
    );

    return {
      success: true,
      rate: res.data.rate
    };
  } catch (err) {
    if (err.response && err.response.request.status == 400)
      return {
        success: false,
        data: err.response.data
      };
    return {
      success: false,
      data: {
        message: 'Bad Internet Connection'
      }
    };
  }
};
