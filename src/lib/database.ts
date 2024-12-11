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
    class_name: string;
    sched_day: number;
    sistem_name: string;
    sistem_key: string;
};
export const getClassesInfo = async (user_uid: string) => {
    return await db.select({
        class_name: Classes.name,
        sched_day: Schedules.day,
        sistem_name: TimeSistems.name,
        sistem_key: Schedules.sistem_key,
    })
        .from(Schedules)
        .where(sql`${Schedules.user_uid} = ${user_uid}`)
        .innerJoin(Classes, eq(Schedules.class_id, Classes.id))
        .innerJoin(TimeSistems, eq(Schedules.sistem_id, TimeSistems.id)) as tgetClassesInfoRes[];
};

export type tgetClassInfoRes = {
    sched_day: number;
    sched_type: string;
    sched_place: string;
    sistem_id: number;
    sistem_name: string;
    sistem_key: string;
};
export const getClassInfo = async (user_uid: string, class_name: string) => {
    return await db.select({
        sched_day: Schedules.day,
        sched_type: Schedules.type,
        sched_place: Schedules.place,
        sistem_id: Schedules.sistem_id,
        sistem_name: TimeSistems.name,
        sistem_key: Schedules.sistem_key,
    })
        .from(Classes)
        .where(sql`${Classes.name} = ${class_name} AND ${Classes.user_uid} = ${user_uid}`)
        .innerJoin(Schedules, eq(Classes.id, Schedules.class_id))
        .innerJoin(TimeSistems, eq(Schedules.sistem_id, TimeSistems.id)) as tgetClassInfoRes[];
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