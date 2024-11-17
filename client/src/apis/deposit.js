import { Api as axios }  from "@src/interceptors/Api.js";
const SERVER_URL = import.meta.env.VITE_SERVER_URL;
const GF_API_KEY = import.meta.env.VITE_GF_API_KEY;
const GF_AFFILIATE_CODE = import.meta.env.VITE_GF_AFFILIATE_CODE;

export const createDepositTransaction = async ({ adminId, agentId, customerId, paymentMethodId, orderNumber, amount, bank, accountNumber, name, currencyId }) => {
    try {
      const res = await axios.post(
        SERVER_URL + '/api/deposit/fiat/user',
        {
            adminId,
            agentId,
            customerId,
            paymentMethodId,
            orderNumber,
            amount,
            bank,
            accountNumber,
            name,
            currencyId
        },
        {
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

export const getTransactions = async (customerId) => {
  try {
    const res = await axios.get(
      SERVER_URL + `/api/deposit/transactions?customerId=${customerId}`,
      {
        headers: {
          'GF-API-KEY': GF_API_KEY,
          'GF-AFFILIATE-CODE': GF_AFFILIATE_CODE,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      }
    );
    if (res.status == 200) {
      return res.data;
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
}
