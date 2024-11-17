import { Api as axios }  from "@src/interceptors/Api.js";

const SERVER_URL = import.meta.env.VITE_SOCKET_SERVER;

export const getChatHistory = async ({ room }) => {
  try {
    const res = await axios.get(
      SERVER_URL + `/api/chatbot?room=${room}`,
      {},
      {
        headers: {
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
