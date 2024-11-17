export interface Result {
    code: number|string;
    message: string;
    key: string;
}

export interface ResultEmailSendSuccess {
    code: number;
    message: string;
    timeout: number;
    key: string;
}

export interface ResultAccessTokenExpired {
    name: string;
    message: string;
    expiredAt: string;
    key: string;
}
