import { days } from "@lib/time";
import { Classes, db, eq, Schedules, sql, TimeSistems } from "astro:db";

/**
 * from Astro.locals
 */
const user_uid = process.env.PUBLIC_TEST_USER_UID ?? import.meta.env.PUBLIC_TEST_USER_UID;

interface ScheduleQueryRes {
    class_name: string;
    sched_day: number;
    sistem_name: string;
    sistem_key: string;
}

interface ClassMap {
    [class_name: string]: {
        sistems_used: string[];
        days: {
            [day: number]: {
                sistem_keys: string[];
            };
        };
    };
}

export default async function testClassesSched() {
    /**
     * Querys
    */
    console.time('Query');
    const classes = await db.select({
        class_name: Classes.name,
        sched_day: Schedules.day,
        sistem_name: TimeSistems.name,
        sistem_key: Schedules.sistem_key,
    })
        .from(Schedules)
        .where(sql`${Schedules.user_uid} = ${user_uid}`)
        .innerJoin(Classes, eq(Schedules.class_id, Classes.id))
        .innerJoin(TimeSistems, eq(Schedules.sistem_id, TimeSistems.id)) as ScheduleQueryRes[];
    console.timeEnd('Query');
    /**
     * Format data
     */
    console.time('Format data');
    const map = classes.reduce((acc, curr) => {
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
    }, {} as ClassMap);
    console.timeEnd('Format data');
    /**
     * Display data
     */
    for (const [class_name, class_data] of Object.entries(map)) {
        console.log(`\nClass: ${class_name}`);
        console.log('Sistems used:', class_data.sistems_used);
        console.log('Days:');
        for (let day = 1; day < 8; day++) {
            if (class_data.days[day % 7]) {
                console.log(`\t${days[day % 7]}:`, class_data.days[day % 7].sistem_keys);
            }
        }
    }
}
