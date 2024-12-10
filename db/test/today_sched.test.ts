import type { tSistemTime, tSistemType } from "@db/config";
import { getActive, getDiff, getTimeStamp, getValues } from "@db/utils";
import { days } from "@lib/time";
import { Classes, db, eq, Schedules, sql, TimeSistems } from "astro:db";

// from Astro.locals
const user_uid = process.env.PUBLIC_TEST_USER_UID ?? import.meta.env.PUBLIC_TEST_USER_UID;
const custom_time_sistem = 1;

// from new Date()
const today = 2;
const today_name = days[today];
const now = getTimeStamp();

interface ScheduleQueryRes {
    class_name: string;
    type: string;
    place: string;
    sistem_key: string;
}

interface TimeSistemQueryRes {
    name: string;
    type: tSistemType;
    sistem: tSistemTime;
    sorted_keys: string[];
}

export default async function testTodaySched() {
    /**
     * Querys
     */
    console.time('Querys');
    const schedules = await db.select({
        class_name: Classes.name,
        type: Schedules.type,
        place: Schedules.place,
        sistem_key: Schedules.sistem_key,
    })
        .from(Schedules)
        .where(sql`${Schedules.user_uid} = ${user_uid} AND ${Schedules.day} = ${today} AND ${Schedules.sistem_id} = ${custom_time_sistem}`)
        .innerJoin(Classes, eq(Schedules.class_id, Classes.id)) as ScheduleQueryRes[];
    const result_time_sistem = await db.select({
        name: TimeSistems.name,
        type: TimeSistems.sistem_type,
        sistem: TimeSistems.sistem,
        sorted_keys: TimeSistems.sorted_keys,
    })
        .from(TimeSistems)
        .where(sql`${TimeSistems.id} = ${custom_time_sistem}`) as TimeSistemQueryRes[];
    console.timeEnd('Querys');

    /**
     * Format data
     */
    console.time('Format data');
    const time_sistem = result_time_sistem[0];
    const key_map = new Map<string, ScheduleQueryRes[]>;

    for (const sched of schedules) {
        const key = sched.sistem_key;
        if (!key_map.has(key)) {
            key_map.set(key, []);
        }
        key_map.get(key)!.push(sched);
    }
    console.timeEnd('Format data');

    /**
     * Display data
     */
    console.log(`\n=== Schedule for ${today_name} ===`);
    console.log(`Actual time: ${now.toLocaleTimeString()}`);
    console.log(`Time sistem: ${time_sistem.name}`);
    console.log(`Type: ${time_sistem.type}`);

    for (const key of time_sistem.sorted_keys) {
        const scheds = key_map.get(key);
        const active = getActive(now.getTime(), key, time_sistem.type, time_sistem.sistem);
        const diff = getDiff(now.getTime(), key, time_sistem.type, time_sistem.sistem);
        const value = getValues(key, time_sistem.type, time_sistem.sistem);
        const pipe = diff && diff < 0 ? '|' : ' ';
        console.log(`${pipe}=====================================`);
        console.log(`${pipe}${active ? `> ${key} <` : key}`);
        console.log(`${pipe}Diff: ${diff}ms`);
        console.log(`${pipe}Value: ${value}`);

        if (scheds) {
            for (const sched of scheds) {
                console.log(`${pipe}- ${sched.class_name} (${sched.type}) @ ${sched.place}`);
            }
        }
    }
}
