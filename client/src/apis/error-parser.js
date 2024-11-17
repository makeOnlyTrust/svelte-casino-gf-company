export const parseApiError = (e) => {
    const res = e.response;
    if (res?.data) {
        return {
            success: false,
            data: res.data
        }
    } else {
        return {
            success: false
        }
    }
};
