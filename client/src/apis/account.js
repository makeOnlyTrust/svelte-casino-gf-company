import { Api as axios } from "@src/interceptors/Api.js";

const GF_API_KEY = import.meta.env.VITE_GF_API_KEY;
const GF_AFFILIATE_CODE = import.meta.env.VITE_GF_AFFILIATE_CODE;
const SERVER_URL = import.meta.env.VITE_SERVER_URL;
const ADMIN_IDX = import.meta.env.VITE_ADMIN_IDX;

export const getAccessToken = async () => {
    try {
        const res = await axios.post(
            SERVER_URL + '/api/account/sign-in/success',
            {},
            {
                headers: {
                    'GF-API-KEY': GF_API_KEY,
                    'GF-AFFILIATE-CODE': GF_AFFILIATE_CODE,
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            }
        );
        if (res.status === 200) {
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

export const getRefreshToken = async () => {
    try {
        const res = await axios.post(
            SERVER_URL + '/api/account/sign-in/refresh',
            {},
            {
                doNotRetry: true,
                headers: {
                    'GF-API-KEY': GF_API_KEY,
                    'GF-AFFILIATE-CODE': GF_AFFILIATE_CODE,
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            }
        );
        if (res.status === 200) {
            localStorage.setItem('accessToken', res.data.accessToken)
            localStorage.setItem('refreshToken', res.data.refreshToken)
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

export const signIn = async ({ email, password }) => {
    try {
        const res = await axios.post(
            SERVER_URL + '/api/account/sign-in',
            {
                email,
                password
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

        if (res.status === 200) {
            localStorage.setItem('accessToken', res.data.accessToken)
            localStorage.setItem('refreshToken', res.data.refreshToken)
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

export const signupSocial = async ({ email, password }) => {
    try {
        const res = await axios.post(
            SERVER_URL + '/api/account/social/sign-up',
            {
                admin_idx: ADMIN_IDX,
                email,
                password
            },
            {
                headers: {
                    'GF-API-KEY': GF_API_KEY,
                    'GF-AFFILIATE-CODE': GF_AFFILIATE_CODE,
                    'Content-Type': 'application/json'
                }
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

export const signOut = async () => {
    try {
        const res = await axios.post(
            SERVER_URL + '/api/account/sign-out',
            {},
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
            localStorage.setItem('accessToken', null)
            localStorage.setItem('refreshToken', null)
            return {
                success: true,
                data: res.data
            };
        }
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

export const changeProfileImage = async ({ customerIdx, profileImage }) => {
    try {
        const res = await axios.post(
            SERVER_URL + '/api/account/profile/image',
            {
                customerIdx,
                profileImage
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

export const changeNickname = async ({ customerIdx, nick }) => {
    try {
        const res = await axios.post(
            SERVER_URL + '/api/account/profile/nick',
            {
                customerIdx,
                nick
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

export const sendEmail = async (email) => {
    try {
        const res = await axios.post(
            SERVER_URL + '/api/account/email',
            {
                email
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

export const sendPhone = async (phone) => {
    try {
        const res = await axios.post(
            SERVER_URL + '/api/account/sms',
            {
                phone
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

export const emailCheck = async (authCode, email) => {
    try {
        const res = await axios.post(
            SERVER_URL + '/api/account/email-check',
            {
                authCode,
                email
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

export const phoneCheck = async (authCode, email, name, phone) => {
    try {
        const res = await axios.post(
            SERVER_URL + '/api/account/phone-check',
            {
                authCode,
                email,
                name,
                phone
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

export const getWallet = async () => {
    try {
        const res = await axios.get(
            SERVER_URL + `/api/account/wallet`,
            {},
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

export const agentCodeAdd = async ({ email, agentCode }) => {
    try {
        const res = await axios.post(
            SERVER_URL + '/api/account/agent-code',
            {
                email,
                agentCode
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

export const getNetwork = async ({ currencyId }) => {
    try {
        const res = await axios.post(
            SERVER_URL + '/api/account/get-network',
            {
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
