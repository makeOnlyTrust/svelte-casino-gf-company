export const dateFormat = (date: Date) => {
    return date.getFullYear() +
        '-' + ((date.getMonth() + 1) <= 9 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)) +
        '-' + ((date.getDate()) <= 9 ? "0" + (date.getDate()) : (date.getDate()));
}

export const timeFormat = (date: Date) => {
    return date.getUTCHours()+9 <= 9 ? "0"+(date.getUTCHours()+9) : (date.getUTCHours()+9) +
        '-' + (date.getMinutes() <= 9 ? "0" + date.getMinutes() : date.getMinutes());
}
