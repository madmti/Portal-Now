import type { tgetClassesInfoRes, tgetTimeSistemRes, tgetTodayScheduleRes } from "./database";
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

export const getClassesFromInfo = (classesInfo: tgetClassesInfoRes) => {
    return classesInfo.map((classInfo) => ({
        id: classInfo.class_id,
        name: classInfo.class_name,
    }));
};
export const getClassesMapFromInfo = (classesInfo: tgetClassesInfoRes) => {
    const classesMap = new Map<string, Record<'sched', Map<number, Set<tBloques>>>>();
    for (const classInfo of classesInfo) {
        if (!classesMap.has(classInfo.class_name)) {
            classesMap.set(classInfo.class_name, {
                sched: new Map(),
            });
        }
        const classSched = classesMap.get(classInfo.class_name)!.sched!;
        if (!classSched.has(classInfo.sched_day)) {
            classSched.set(classInfo.sched_day, new Set());
        }
        const schedDay = classSched.get(classInfo.sched_day)!;
        for (const block of classInfo.sched_time.blocks) {
            schedDay.add(block);
        }
    }
    return classesMap;
};

export const repeatPerBlock = (sched: {
    sched_day: number;
    sched_type: string;
    sched_place: string;
    sched_block_mode: boolean;
    sched_time: any;
}[]) => {
    const result = [];
    for (const s of sched) {
        if (s.sched_block_mode) {
            for (const block of s.sched_time.blocks) {
                result.push({
                    sched_day: s.sched_day,
                    sched_type: s.sched_type,
                    sched_place: s.sched_place,
                    sched_block_mode: s.sched_block_mode,
                    sched_time: block,
                });
            }
        } else {
            result.push(s);
        }
    }
    return result as {
        sched_day: number;
        sched_type: string;
        sched_place: string;
        sched_block_mode: boolean;
        sched_time: string;
    }[];
};