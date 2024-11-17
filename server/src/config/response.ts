import { Result, ResultEmailSendSuccess } from '../types/response.types';
import { EMAIL_VERIFICATION_TIME } from './setting.config';

// success
export const emailSendSuccess: ResultEmailSendSuccess = {
    code: 1001,
    message: 'Sent a auth code to your email.',
    timeout: EMAIL_VERIFICATION_TIME,
    key: 'EMAIL_SUCCESS'
};

export const smsSendSuccess: ResultEmailSendSuccess = {
    code: 1002,
    message: 'Sent a auth code to your phone.',
    timeout: EMAIL_VERIFICATION_TIME,
    key: 'EMAIL_SUCCESS'
};


export const authCodeValidationSuccess: Result = {
    code: 1003,
    message: 'AuthCode validation successfully.',
    key: 'AUTHCODE_VALIDATION_SUCCESS'
};

export const agentAddedSuccess: Result = {
    code: 1004,
    message: 'Agent Code added successfully.',
    key: 'AGENTCODE_ADDED_SUCCESS'
};

export const signUpSuccess: Result = {
    code: 1005,
    message: 'Sign up successfully 🎉',
    key: 'SIGN_UP_SUCCESS'
};

export const signInSuccess: Result = {
    code: 1006,
    message: 'Sign in successfully 🎉',
    key: 'SIGN_IN_SUCCESS'
};

export const tokenRecreate: Result = {
    code: 1007,
    message: 'Token Recreate',
    key: 'TOKEN_RECREATE'
};

export const signOutSuccess: Result = {
    code: 1008,
    message: 'Sign out successfully',
    key: 'SIGN_OUT_SUCCESS'
};

export const passwordChangeSuccess: Result = {
    code: 1009,
    message: 'Password change successfully',
    key: 'PASSWORD_CHANGE_SUCCESS'
};

export const profileImageChangeSuccess: Result = {
    code: 1010,
    message: 'Profile image change successfully',
    key: 'PROFILE_IMAGE_CHANGE_SUCCESS'
};

export const nickChangeSuccess: Result = {
    code: 1011,
    message: 'Nick change successfully',
    key: 'NICK_CHANGE_SUCCESS'
};

export const createFavoriteSuccess: Result = {
    code: 1012,
    message: 'Create Favorite successfully',
    key: 'CREATE_FAVORITE_SUCCESS'
};

export const deleteFavoriteSuccess: Result = {
    code: 1013,
    message: 'Delete Favorite successfully',
    key: 'DELETE_FAVORITE_SUCCESS'
};
export const fiatCurrencyDepositSuccess: Result = {
    code: 1014,
    message: 'Fiat currency deposit successfully',
    key: 'FIAT_CURRENCY_DEPOSIT_SUCCESS'
};

export const createDepositTransactionSuccess: Result = {
    code: 1015,
    message: "Your deposit request has been successful 🎉",
    key: "DEPOSIT_REQUEST_SUCCESSFUL"
}

// Duplicate //
export const emailDuplicateError: Result = {
    code: 2001,
    message: 'The email is a duplicate.',
    key: 'EMAIL_DUPLICATE'
};

// invalid //
export const idInvalid: Result = {
    code: 2002,
    message: 'ID is incorrect.',
    key: 'ID_INCORRECT'
};

export const emailInvalid: Result = {
    code: 2003,
    message: 'Email is incorrect.',
    key: 'EMAIL_INCORRECT'
};

export const userNameInvalid: Result = {
    code: 2004,
    message: 'Username is incorrect.',
    key: 'USERNAME_INCORRECT'
};

export const memberValidationInvalid: Result = {
    code: 2005,
    message: 'The email or password is incorrect.',
    key: 'EMAIL_OR_PASSWORD_INCORRECT'
};

export const authCodeValidationInvalid: Result = {
    code: 2006,
    message: 'Invalid authentication code.',
    key: 'AUTHCODE_INVALID'
};

export const agentCodeValidationInvalid: Result = {
    code: 2007,
    message: 'Invalid agent code.',
    key: 'AGENTCODE_INVALID'
};

// failed
export const emailFailedSend: Result = {
    code: 4000,
    message: 'Email sending failed, please try again.',
    key: 'EMAIL_FAILED'
};

export const tokenVerificationFailed: Result = {
    code: 4001,
    message: 'The token has expired.',
    key: 'TOEKN_EXPIRED'
};

export const smsFailedSend: Result = {
    code: 4002,
    message: 'SMS sending failed, please try again.',
    key: 'EMAIL_FAILED'
};

export const ApiFailed: Result = {
    code: 4003,
    message: 'The Api has been failed.',
    key: 'API_FAILED'
};

export const authCodeValidationFailed: Result = {
    code: 4004,
    message: 'AuthCode validation failed.',
    key: 'AUTHCODE_FAILED'
};

export const agentCodeValidationFailed: Result = {
    code: 4005,
    message: 'AgentCode validation failed.',
    key: 'AGENTCODE_FAILED'
};

export const signUpFailed: Result = {
    code: 4006,
    message: 'Sign up failed.',
    key: 'SIGN_UP_FAILED'
};

export const signInFailed: Result = {
    code: 4007,
    message: 'Sign in failed.',
    key: 'SIGN_IN_FAILED'
};

export const signOutFailed: Result = {
    code: 4008,
    message: 'Sign out failed.',
    key: 'SIGN_OUT_FAILED'
};

export const profileImageChangeFailed: Result = {
    code: 4009,
    message: 'Profile image change failed.',
    key: 'PROFILE_IMAGE_CHANGE_FAILED'
};

export const nickChangeFailed: Result = {
    code: 4010,
    message: 'Nick change failed.',
    key: 'NICK_CHANGE_FAILED'
};

export const createFavoriteFailed: Result = {
    code: 4011,
    message: 'Create favorite failed.',
    key: 'CREATE_FAVORITE_FAILED'
};

export const deleteFavoriteFailed: Result = {
    code: 4012,
    message: 'Delete favorite failed.',
    key: 'DELETE_FAVORITE_FAILED'
};

export const getCasinoListFailed: Result = {
    code: 4013,
    message: 'Get casino list failed.',
    key: 'GET_CASINO_LIST_FAILED'
};

export const getBalanceFailed: Result = {
    code: 4014,
    message: 'Get balance failed.',
    key: 'GET_BALANCE_FAILED'
};

export const changeBalanceFailed: Result = {
    code: 4015,
    message: 'Change balance failed.',
    key: 'CHANGE_BALANCE_FAILED'
};

export const updateBalanceFailed: Result = {
    code: 4016,
    message: 'Update balance failed.',
    key: 'UPDATE_BALANCE_FAILED'
};

export const getInfoFailed: Result = {
    code: 4017,
    message: 'Get info failed.',
    key: 'GET_INFO_FAILED'
};

export const launchFailed: Result = {
    code: 4018,
    message: 'Launch failed.',
    key: 'LAUNCH_FAILED'
};

export const getTypesFailed: Result = {
    code: 4019,
    message: 'Get types failed.',
    key: 'GET_TYPES_FAILED'
};

export const getVendorsFailed: Result = {
    code: 4020,
    message: 'Get vendors failed.',
    key: 'GET_VENDORS_FAILED'
};

export const getWalletFailed: Result = {
    code: 4021,
    message: 'Get wallet failed.',
    key: 'GET_WALLET_FAILED'
};

export const alreadyBettingInSameMinigame: Result = {
    code: 4022,
    message: 'Already betting in same Minigame',
    key: 'ALREADY_BETTING_IN_SAME_MINIGAME'
};

export const notEnoughBalance: Result = {
    code: 4023,
    message: 'Not enough balance',
    key: 'NOT_ENOUGH_BALANCE'
};

export const createDepositTransactionFailed: Result = {
    code: 4024,
    message: "Your deposit request has been Falied",
    key: "DEPOSIT_REQUEST_Failed"
}

export const nickAlreadyTaken: Result = {
    code: 4025,
    message: 'nick Already Taken.',
    key: 'NICK_ALREADY_TAKEN'
};

export const minigameClosed: Result = {
    code: 4026,
    message: 'minigame Closed.',
    key: 'MINIGAME_CLOSED'
};

export const casinoClosed: Result = {
    code: 4027,
    message: 'casino Closed.',
    key: 'CASINO_CLOSED'
};


// callback
export const gfpayCallbackSuccess: Result = {
    code: "0000",
    message: "success",
    key: "SUCCESS_CALLBACK"
}

export const gfpayCallbackFailed: Result = {
    code: "0000",
    message: "success",
    key: "SUCCESS_CALLBACK"
}
