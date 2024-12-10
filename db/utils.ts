import type { tSistemTime, tSistemType } from "./config";

export const getTimeStamp = (hour?: number, minute?: number) => {
    const date = new Date();
    date.setFullYear(1970, 0, 1);
    if (hour){
        if (!minute) minute = 0;
        date.setHours(hour, minute, 0, 0);
    }
    return date;
};


export const getMilis = (hour: number, minute: number) => {
    return getTimeStamp(hour, minute).getTime();
};

export const getActive = (now: number, key: string, sistem_type: tSistemType, sistem: tSistemTime) => {
    if (sistem_type === 'range') {
        const range = sistem[key].range;
        return now >= range[0] && now <= range[1];
    }
};

export const getDiff = (now: number, key: string, sistem_type: tSistemType, sistem: tSistemTime) => {
    if (sistem_type === 'range') {
        const range = sistem[key].range;
        return range[0] - now;
    }
}

export const getValues = (key: string, sistem_type: tSistemType, sistem: tSistemTime) => {
    if (sistem_type === 'range') {
        const start = (new Date(sistem[key].range[0])).toLocaleTimeString();
        const end = new Date(sistem[key].range[1]).toLocaleTimeString();
        return start + ' - ' + end;
    }
}