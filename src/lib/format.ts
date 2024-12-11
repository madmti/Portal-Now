import type { tgetClassesInfoRes, tgetClassInfoRes, tgetTodayScheduleRes } from "./database";
import type { tBloques } from "./time";

export const schedToKeyMap = (schedule: tgetTodayScheduleRes[]) => {
    const key_map = new Map<string, tgetTodayScheduleRes[]>();
    for (const sched of schedule) {
        const key = sched.sistem_key;
        if (!key_map.has(key)) {
            key_map.set(key, []);
        }
        key_map.get(key)!.push(sched);
    }
    return key_map;
};

export type tgetClassesMapFromInfoRes = {
    [class_name: string]: {
        sistems_used: string[];
        days: {
            [day: number]: {
                sistem_keys: string[];
            };
        };
    };
};
export const getClassesMapFromInfo = (classesInfo: tgetClassesInfoRes[]) => {
    return classesInfo.reduce((acc, curr) => {
        if (!acc[curr.class_name]) {
            acc[curr.class_name] = {
                sistems_used: [],
                days: {},
            };
        }
        const class_data = acc[curr.class_name];
        if (!class_data.sistems_used.includes(curr.sistem_name)) {
            class_data.sistems_used.push(curr.sistem_name);
        }
        if (!class_data.days[curr.sched_day]) {
            class_data.days[curr.sched_day] = {
                sistem_keys: [],
            };
        }
        class_data.days[curr.sched_day].sistem_keys.push(curr.sistem_key);
        return acc;
    }, {} as tgetClassesMapFromInfoRes);
};

export type tgetClassMapFromInfoRes = {
    sistems_used: string[];
    days: {
        [day: number]: {
            sistem_keys: string[];
        };
    };
};
export const getClassMapFromInfo = (classInfo: tgetClassInfoRes[]) => {
    return classInfo.reduce((acc, curr) => {
        if (!acc.sistems_used.includes(curr.sistem_name)) {
            acc.sistems_used.push(curr.sistem_name);
        }
        if (!acc.days[curr.sched_day]) {
            acc.days[curr.sched_day] = {
                sistem_keys: [],
            };
        }
        acc.days[curr.sched_day].sistem_keys.push(curr.sistem_key);
        return acc;
    }, { sistems_used: [], days: {} } as tgetClassMapFromInfoRes);
};
