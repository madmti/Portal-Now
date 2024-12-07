import { Classes, db, eq, Schedules, sql } from "astro:db";
import type { tBloques } from "./time";

export type tgetTodayScheduleRes = {
    class_name: string;
    sched_type: string;
    sched_place: string;
    sched_block_mode: boolean;
    sched_time: { blocks: tBloques[] };
}[];
export const getTodaySchedule = async (user_uid: string, day: number): Promise<tgetTodayScheduleRes> => {
    return db.select({
        class_name: Classes.name,
        sched_type: Schedules.type,
        sched_place: Schedules.place,
        sched_block_mode: Schedules.block_mode,
        sched_time: Schedules.time,
    })
        .from(Schedules)
        .where(sql`${Schedules.user_uid} = ${user_uid} AND ${Schedules.day} = ${day}`)
        .innerJoin(Classes, eq(Schedules.class_id, Classes.id)) as Promise<tgetTodayScheduleRes>;
};

export const getClasses = async (user_uid: string) => {
    return db.select()
        .from(Classes)
        .where(sql`${Classes.user_uid} = ${user_uid}`);
};