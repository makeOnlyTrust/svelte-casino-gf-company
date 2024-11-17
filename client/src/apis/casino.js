import { Api as axios }  from "@src/interceptors/Api.js";

const GF_API_KEY = import.meta.env.VITE_GF_API_KEY;
const GF_AFFILIATE_CODE = import.meta.env.VITE_GF_AFFILIATE_CODE;
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export const getCasinoList = async ({ title, type, vendor, page, sort, limit, userId }) => {
  const endPoint =
    SERVER_URL +
    `/api/casino/list?title=${title}&type=${type}&vendor=${vendor}&page=${page}&sort=${sort}&limit=${limit}&userId=${userId}`;

  const headers = {
    'GF-API-KEY': GF_API_KEY,
    'GF-AFFILIATE-CODE': GF_AFFILIATE_CODE,
    'Content-Type': 'application/json'
  };
  const options = {
    headers: headers,
    withCredentials: true
  };

  try {
    const res = await axios.get(endPoint, {}, options);

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

export const getCasinoInfo = async (idx, userId) => {
  const endPoint = SERVER_URL + `/api/casino/info?id=${idx}&userId=${userId}`;
  const headers = {
    'GF-API-KEY': GF_API_KEY,
    'GF-AFFILIATE-CODE': GF_AFFILIATE_CODE,
    'Content-Type': 'application/json'
  };
  const options = {
    headers: headers,
    withCredentials: true
  };

  try {
    const res = await axios.get(endPoint, {}, options);
    if (res.status == 200) {
      return res.data;
    }

    if (err.response && err.response.request.status == 400) {
      return err.response.data;
    }
  } catch (err) {
    return {
      data: {
        // 'message': "Bad Internet Connection"
        message: err
      }
    };
  }
};

export const LaunchCasino = async (idx, userId) => {
  const endPoint = SERVER_URL + `/api/casino/launch?id=${idx}&userId=${userId}`;
  const headers = {
    'GF-API-KEY': GF_API_KEY,
    'GF-AFFILIATE-CODE': GF_AFFILIATE_CODE,
    'Content-Type': 'application/json'
  };
  const options = {
    headers: headers,
    withCredentials: true
  };

  try {
    const res = await axios.get(endPoint, {}, options);
    if (res.status == 200) {
      return res.data;
    }

    if (err.response && err.response.request.status == 400) {
      return err.response.data;
    }
  } catch (_) {
    return {
      data: {
        message: 'Bad Internet Connection'
      }
    };
  }
};

export const getBetResult = async (page, search) => {
  const endPoint = SERVER_URL + '/api/casino/bet-result';
  const headers = {
    'GF-API-KEY': GF_API_KEY,
    'GF-AFFILIATE-CODE': GF_AFFILIATE_CODE,
    'Content-Type': 'application/json'
  };
  const options = {
    headers: headers,
    withCredentials: true
  };

  try {
    const res = await axios.get(endPoint, {}, options);
    if (res.status == 200) {
      return res.data;
    }

    if (err.response && err.response.request.status == 400) {
      return err.response.data;
    }
  } catch (_) {
    return {
      data: {
        message: 'Bad Internet Connection'
      }
    };
  }
};

export const getTypes = async () => {
  const endPoint = SERVER_URL + '/api/casino/type';

  const headers = {
    'GF-API-KEY': GF_API_KEY,
    'GF-AFFILIATE-CODE': GF_AFFILIATE_CODE,
    'Content-Type': 'application/json'
  };
  const options = {
    headers: headers,
    withCredentials: true
  };

  try {
    const res = await axios.get(endPoint, {}, options);
    if (res.status == 200) {
      return res.data;
    }

    if (err.response && err.response.request.status == 400) {
      return err.response.data;
    }
  } catch {
    return {
      data: {
        message: 'Bad Internet Connection'
      }
    };
  }
};

export const getVendors = async () => {
  const endPoint = SERVER_URL + '/api/casino/vendor';

  const headers = {
    'GF-API-KEY': GF_API_KEY,
    'GF-AFFILIATE-CODE': GF_AFFILIATE_CODE,
    'Content-Type': 'application/json'
  };
  const options = {
    headers: headers,
    withCredentials: true
  };

  try {
    const res = await axios.get(endPoint, {}, options);
    if (res.status == 200) {
      return res.data;
    }

    if (err.response && err.response.request.status == 400) {
      return err.response.data;
    }
  } catch {
    return {
      data: {
        message: 'Bad Internet Connection'
      }
    };
  }
};

export const updateBalance = async (userId, currencyId) => {
  const endPoint = SERVER_URL + '/api/casino/balance';

  const headers = {
    'GF-API-KEY': GF_API_KEY,
    'GF-AFFILIATE-CODE': GF_AFFILIATE_CODE,
    'Content-Type': 'application/json'
  };
  const options = {
    headers: headers,
    withCredentials: true
  };

  try {
    const res = await axios.post(
      endPoint,
      {
        userId,
        currencyId
      },
      options
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

export const createUser = async (userId, nickname) => {
  try {
    const res = await axios.post(
      SERVER_URL + '/api/casino/user/create',
      {
        userId: userId,
        nickname: nickname
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

export const refreshToken = (userId) => {
  return new Promise((resolve, reject) => {
    fetch('https://api.honorlink.org/api/user/refresh-token', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer q7Eh8nvLDivhwGpdjaefJ1U4t0eN31Z2OG6yL3N9'
      },
      body: JSON.stringify({
        username: userId
      })
    })
      .then((response) => response.json())
      .then((data) => {
        resolve(data);
      })
      .catch((error) => console.error('Error:', error));
  });
};
