
export const getTimeStamp = (hour: number, minute: number) => {
    const date = new Date();
    date.setFullYear(1970, 0, 1);
    date.setHours(hour, minute, 0, 0);
    return date;
};

export const getMilis = (hour: number, minute: number) => {
    return getTimeStamp(hour, minute).getTime();
};