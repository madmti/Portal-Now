import type { APIRoute } from "astro";
import { Classes, db, Schedules, sql } from "astro:db";

interface ResData {
    class_name: string;
    fields: {
        sched_day: number;
        sched_type: string;
        sched_place: string;
        sistem_id: number;
        sistem_name: string;
        sistem_key: string;
    }[];
}

export const POST: APIRoute = async ({ request, redirect, locals }) => {
    const data = await request.json() as ResData;
    const { user } = locals;
    const result_class = await db.select({ id: Classes.id })
        .from(Classes)
        .where(sql`${Classes.name} = ${data.class_name} AND ${Classes.user_uid} = ${user.uid}`);
    if (!result_class.length) {
        return new Response("Class not found", { status: 404 });
    }
    const class_id = result_class[0].id;

    try {
        await db.delete(Schedules)
            .where(sql`${Schedules.class_id} = ${class_id}`);
        const querys = [] as any;
        for (const field of data.fields) {
            querys.push(
                db.insert(Schedules)
                    .values([{
                        user_uid: user.uid,
                        class_id: class_id,
                        type: field.sched_type,
                        day: field.sched_day,
                        place: field.sched_place,
                        sistem_id: field.sistem_id === -1 ? null : field.sistem_id,
                        sistem_key: field.sistem_key,
                    }])
            );
        }
        await db.batch(querys);
    } catch (e) {
        return new Response("Error updating schedule", { status: 500 });
    }

    return redirect(`/home/dashboard/clases/${data.class_name}/`);
};
