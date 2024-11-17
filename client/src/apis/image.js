import { Api as axios }  from "@src/interceptors/Api.js";

const STORAGE_SERVER_URL = import.meta.env.VITE_STORAGE_SERVER_URL;

export const saveImageWebp = async ({ filename, ext }) => {
  try {
    const res = await axios.post(STORAGE_SERVER_URL + '/save/ext', {
      filename,
      ext
    });

    if (res.status == 200) {
      return {
        success: true,
        data: res.data
      };
    }
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

export const saveTempImage = async ({ formData }) => {
  try {
    const res = await axios.post(STORAGE_SERVER_URL + '/temp', formData);

    if (res.status == 200) {
      return {
        success: true,
        data: res.data
      };
    }
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
