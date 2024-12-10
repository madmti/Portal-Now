import { Classes, db, Preferences, Schedules, TimeSistems } from 'astro:db';
import type { tSistemTime } from './config';
import { getMilis } from './utils';

const user_uid = process.env.PUBLIC_TEST_USER_UID ?? import.meta.env.PUBLIC_TEST_USER_UID;

export default async function seed() {
    /**
     * DELETE ALL
     */
    await db.delete(Preferences);
    await db.delete(Schedules);
    await db.delete(TimeSistems);
    await db.delete(Classes);

    /**
     * INSERT TIME SISTEMS
     */
    const result = await db.insert(TimeSistems).values([
        {
            is_global: true,
            name: 'UTFSM',
            sistem_type: 'range',
            sistem: {
                '1-2': { range: [getMilis(8, 15), getMilis(9, 25)] },
                '3-4': { range: [getMilis(9, 35), getMilis(10, 45)] },
                '5-6': { range: [getMilis(10, 55), getMilis(12, 5)] },
                '7-8': { range: [getMilis(12, 15), getMilis(13, 25)] },
                '9-10': { range: [getMilis(14, 30), getMilis(15, 40)] },
                '11-12': { range: [getMilis(15, 50), getMilis(17, 0)] },
                '13-14': { range: [getMilis(17, 10), getMilis(18, 20)] },
                '15-16': { range: [getMilis(18, 30), getMilis(19, 40)] },
                '17-18': { range: [getMilis(19, 50), getMilis(21, 0)] },
                '19-20': { range: [getMilis(21, 10), getMilis(22, 20)] },
            } as tSistemTime,
            sorted_keys: ['1-2', '3-4', '5-6', '7-8', '9-10', '11-12', '13-14', '15-16', '17-18', '19-20'],
        }
    ]).returning({ id: TimeSistems.id });
    const custom_time_sistem = result[0].id;

    /**
     * INSERT PREFERENCES
     */
    await db.insert(Preferences).values([
        { user_uid, custom_time_sistem },
    ]);

    /**
     * INSERT CLASSES
     */
    const classes = await db.insert(Classes).values([
        { user_uid, name: 'Clase 1' },
        { user_uid, name: 'Clase 2' },
        { user_uid, name: 'Clase 3' },
        { user_uid, name: 'Clase 4' },
    ]).returning({ id: Classes.id });

    /**
     * INSERT SCHEDULES
     */
    for (const clas of classes) {
        await db.insert(Schedules).values([
            { user_uid, class_id: clas.id, type: 'Catedra', day: (clas.id + 0) % 7, place: 'Lugar 1', sistem_id: custom_time_sistem, sistem_key: '1-2' },
            { user_uid, class_id: clas.id, type: 'Laboratorio', day: (clas.id + 1) % 7, place: 'Lugar 2', sistem_id: custom_time_sistem, sistem_key: '3-4' },
            { user_uid, class_id: clas.id, type: 'Catedra', day: (clas.id + 2) % 7, place: 'Lugar 3', sistem_id: custom_time_sistem, sistem_key: '5-6' },
            { user_uid, class_id: clas.id, type: 'Catedra', day: (clas.id + 3) % 7, place: 'Lugar 4', sistem_id: custom_time_sistem, sistem_key: '7-8' },
            { user_uid, class_id: clas.id, type: 'Catedra', day: (clas.id + 4) % 7, place: 'Lugar 5', sistem_id: custom_time_sistem, sistem_key: '9-10' },
            { user_uid, class_id: clas.id, type: 'Catedra', day: (clas.id + 5) % 7, place: 'Lugar 6', sistem_id: custom_time_sistem, sistem_key: '11-12' },
            { user_uid, class_id: clas.id, type: 'Catedra', day: (clas.id + 6) % 7, place: 'Lugar 7', sistem_id: custom_time_sistem, sistem_key: '13-14' },
            { user_uid, class_id: clas.id, type: 'Catedra', day: (clas.id + 7) % 7, place: 'Lugar 8', sistem_id: custom_time_sistem, sistem_key: '15-16' },
            { user_uid, class_id: clas.id, type: 'Catedra', day: (clas.id + 8) % 7, place: 'Lugar 9', sistem_id: custom_time_sistem, sistem_key: '17-18' },
            { user_uid, class_id: clas.id, type: 'Catedra', day: (clas.id + 9) % 7, place: 'Lugar 10', sistem_id: custom_time_sistem, sistem_key: '19-20' },
        ]);
    };
}

