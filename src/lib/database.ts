import { Classes, db, eq, Schedules, sql, TimeSistems } from "astro:db";
import type { tBloques, tNumDay } from "./time";
import type { tSistemTime } from "@db/config";

export type tgetTodayScheduleRes = {
    class_name: string;
    sched_type: string;
    sched_place: string;
    sched_block_mode: boolean;
    sched_time: { blocks: tBloques[] };
}[];
export const getTodaySchedule = async (user_uid: string, day: number): Promise<tgetTodayScheduleRes> => {
    return [];
    /*     return db.select({
            class_name: Classes.name,
            sched_type: Schedules.type,
            sched_place: Schedules.place,
            sched_block_mode: Schedules.block_mode,
            sched_time: Schedules.time,
        })
            .from(Schedules)
            .where(sql`${Schedules.user_uid} = ${user_uid} AND ${Schedules.day} = ${day}`)
            .innerJoin(Classes, eq(Schedules.class_id, Classes.id)) as Promise<tgetTodayScheduleRes>; */
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