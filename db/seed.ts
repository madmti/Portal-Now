import { Classes, db, Preferences, Schedules, TimeSistems } from 'astro:db';
import type { tSistemTime } from './config';
import { getMilis } from './utils';

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
    await db.insert(TimeSistems).values([
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
    ]);
}
