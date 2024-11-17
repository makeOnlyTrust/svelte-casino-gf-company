const SPORTS_TIMEZONE = import.meta.env.VITE_SPORTS_TIMEZONE;

// 240119 / jinowe / open popup
export const openPopup = (url, title, w, h) => {
    const left = (screen.width - w) / 2;
    const top = (screen.height - h) / 2;

    const options = `width=${w},height=${h},top=${top},left=${left}`;

    window.open(url, title, options);
}

// 240120 / jinowe / **

export const formatIsoDateToCustomFormat = (isoDate) => {
    const date = new Date(isoDate);
  
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
  
    return `${year}.${month}.${day} ${hours}:${minutes}:${seconds}`;
}

export const capitalizeFirstLetter = (string) => {
    if (!string) return string;
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export const getFormattedDate = (date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const dateArr = date.split('/');
    const month = Number(dateArr[0]) - 1;

    return `${dateArr[1]} ${months[month]}`;
}
  
export const clearSportsName = (sportsName) => {
    return sportsName.replaceAll('-', ' ');
}

export const convertToTimezone = (fullDate, time) => {
    const gmtDate = new Date();
    const [year, month, date] = fullDate.split('-');
    const [hours, minutes] = time.split(':');

    gmtDate.setUTCFullYear(parseInt(year, 10));
    gmtDate.setUTCMonth(parseInt(month - 1, 10));
    gmtDate.setUTCDate(parseInt(date, 10));
    gmtDate.setUTCHours(parseInt(hours, 10));
    gmtDate.setUTCMinutes(parseInt(minutes, 10));

    // Convert the GMT time to Hong Kong timezone
    const convertedDateTime = new Intl.DateTimeFormat('en-US', {
        timeZone: SPORTS_TIMEZONE,
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false,
    }).format(gmtDate);

    const [convertedDate, convertedtime] = convertedDateTime.split(', ');

    const formattedDate = getFormattedDate(convertedDate);

    return [formattedDate, convertedtime];
};