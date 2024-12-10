import { days } from "@lib/time";
import { Classes, db, eq, Schedules, sql, TimeSistems } from "astro:db";

/**
 * from Astro.locals
 */
const user_uid = process.env.PUBLIC_TEST_USER_UID ?? import.meta.env.PUBLIC_TEST_USER_UID;
/**
 * from Astro.params
 */
const class_name = 'Clase 1';

interface ScheduleQueryRes {
    day: number;
    sistem_key: string;
    sistem_name: string;
}

interface DayMap {
    [day: number]: {
        sistem_keys: string[];
    };
}

export default async function testClassSched() {
    /**
     * Querys
     */
    console.time('Query');
    const result_class = await db.select({
        id: Classes.id
    })
        .from(Classes)
        .where(sql`${Classes.name} = ${class_name} AND ${Classes.user_uid} = ${user_uid}`);
    if (result_class.length === 0) {
        console.error('Class not found');
        return;
    }
    const class_id = result_class[0].id;
    const schedules = await db.select({
        day: Schedules.day,
        sistem_key: Schedules.sistem_key,
        sistem_name: TimeSistems.name,
    })
        .from(Schedules)
        .where(sql`${Schedules.class_id} = ${class_id}`)
        .innerJoin(TimeSistems, eq(Schedules.sistem_id, TimeSistems.id)) as ScheduleQueryRes[];
    console.timeEnd('Query');
    /**
     * Format data
     */
    console.time('Format data');
    const sistems_used: string[] = [];
    const dayMap = schedules.reduce((acc, curr) => {
        if (!sistems_used.includes(curr.sistem_name)) {
            sistems_used.push(curr.sistem_name);
        }
        if (!acc[curr.day]) {
            acc[curr.day] = {
                sistem_keys: [],
            };
        }
        const day_data = acc[curr.day];
        if (!day_data.sistem_keys.includes(curr.sistem_key)) {
            day_data.sistem_keys.push(curr.sistem_key);
        }
        return acc;
    }, {} as DayMap);
    console.timeEnd('Format data');
    /**
     * Display data
     */
    console.log('\nClass:', class_name);
    console.log('Sistems used:', sistems_used);
    console.log('Schedules:');
    for (let day = 1; day < 8; day++) {
        if (dayMap[day]) {
            console.log(`\t${days[day % 7]}:`, dayMap[day].sistem_keys);
        }
    }
};
