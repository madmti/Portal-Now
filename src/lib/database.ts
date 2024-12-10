import { Classes, db, eq, Schedules, sql, TimeSistems } from "astro:db";
import type { tBloques, tNumDay } from "./time";
import type { tSistemTime, tSistemType } from "@db/config";

export type tgetTodayScheduleRes = {
    class_name: string;
    type: string;
    place: string;
    sistem_key: string;
};
export const getTodaySchedule = async (user_uid: string, time_sistem: number | null, day: number) => {
    return await db.select({
        class_name: Classes.name,
        type: Schedules.type,
        place: Schedules.place,
        sistem_key: Schedules.sistem_key,
    })
        .from(Schedules)
        .where(sql`${Schedules.user_uid} = ${user_uid} AND ${Schedules.day} = ${day} AND ${Schedules.sistem_id} = ${time_sistem}`)
        .innerJoin(Classes, eq(Schedules.class_id, Classes.id)) as tgetTodayScheduleRes[];
};

export type tgetTimeSistemRes = {
    name: string;
    type: tSistemType;
    sistem: tSistemTime;
    sorted_keys: string[];
};
export const getTimeSistem = async (time_sistem: number | null) => {
    const res_query = await db.select({
        name: TimeSistems.name,
        type: TimeSistems.sistem_type,
        sistem: TimeSistems.sistem,
        sorted_keys: TimeSistems.sorted_keys,
    })
        .from(TimeSistems)
        .where(sql`${TimeSistems.id} = ${time_sistem}`) as tgetTimeSistemRes[]
    return res_query.length > 0 ? res_query[0] : null;
};

export const getClasses = async (user_uid: string) => {
    return db.select()
        .from(Classes)
        .where(sql`${Classes.user_uid} = ${user_uid}`);
};

export type tgetClassesInfoRes = {
    class_id: number;
    class_name: string;
    sched_day: tNumDay;
    sched_place: string;
    sched_time: {
        blocks: tBloques[];
    };
}[];
export const getClassesInfo = async (user_uid: string, block_mode: boolean) => {
    /*     return db.select({
            class_id: Classes.id,
            class_name: Classes.name,
            sched_day: Schedules.day,
            sched_place: Schedules.place,
            sched_time: Schedules.time,
        })
            .from(Classes)
            .where(sql`${Classes.user_uid} = ${user_uid} AND ${Schedules.block_mode} = ${block_mode}`)
            .innerJoin(Schedules, eq(Classes.id, Schedules.class_id)) as Promise<tgetClassesInfoRes>; */
    return [];
};

export const getSchedule = async (user_uid: string, class_name: string) => {
    /*     return db.select({
            sched_day: Schedules.day,
            sched_type: Schedules.type,
            sched_place: Schedules.place,
            sched_block_mode: Schedules.block_mode,
            sched_time: Schedules.time,
        })
            .from(Classes)
            .innerJoin(Schedules, eq(Classes.id, Schedules.class_id))
            .where(sql`${Classes.user_uid} = ${user_uid} AND ${Classes.name} = ${class_name}`)
            .orderBy(Schedules.day); */
    return [];
}

export type tgetSistemsRes = {
    id: number;
    name: string;
    is_global: boolean;
    sistem_type: string;
    sistem: tSistemTime;
    sorted_keys: string[];
}[];
export const getGlobalSistems = async () => {
    return await db.select().from(TimeSistems).where(sql`${TimeSistems.is_global} = true`) as tgetSistemsRes;
};