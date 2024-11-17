import crypto from 'crypto';

/** create random code /2023-06-28/jino*/
export const generateRandomCode = (length: number): string => {
    let result: string = '';
    const characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const charactersLength: number = characters.length;

    for (let i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        );
    }

    return result;
};

/** create random number /2023-07-01/jino */
export const generateRandomNumber = (length: number): string => {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += Math.floor(Math.random() * 10); // generates a random number between 0 and 9
    }

    return result;
};

/** create random number /2023-07-01/jino */
export const hashWithSHA256 = (password: string) => {
    const hash = crypto.createHash('sha256');
    hash.update(process.env.SALT + password);

    return hash.digest('hex');
};

/** get UTC time /2024-01-08/tier */
export const getFullDate = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const _month = month < 10 ? `0${month}` : month;
    const _day = day < 10 ? `0${day}` : day;

    return `${_day}-${_month}-${year}`;
}

/** get UTC time /2024-01-12/tier */
export const getUTCTime = (date?: Date) => {
    if (!date) {
        date = new Date();
    }

    // Get the UTC date and time components
    const utcYear = date.getUTCFullYear();
    const utcMonth = date.getUTCMonth() + 1;
    const utcDate = date.getUTCDate();
    const utcHours = date.getUTCHours();
    const utcMinutes = date.getUTCMinutes();
    const utcSeconds = date.getUTCSeconds();

    // Construct a string representing the current UTC time
    const utcTimeString = `${utcYear}-${String(utcMonth).padStart(2, '0')}-${String(utcDate).padStart(2, '0')}T${String(utcHours).padStart(2, '0')}:${String(utcMinutes).padStart(2, '0')}:${String(utcSeconds).padStart(2, '0')}`;

    return utcTimeString;
}

/** get UTC time /2024-01-08/tier */
export const sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const reverseDate = (date: string) => {
    return date.split('.').reverse().join('-');
}

export const compareNumber = (first: number, second: number) => {
    if (first > second) return 1;
    else if (first === second) return 0;
    else return -1;
}

export const getMinMaxUTCDate = (min: number, max: number) => {
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + min);
    const minUTCDate = new Date(getUTCTime(minDate));

    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + max);
    const maxUTCDate = new Date(getUTCTime(maxDate));

    return {minUTCDate, maxUTCDate}
}