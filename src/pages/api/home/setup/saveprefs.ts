import type { APIRoute } from "astro";
import { db, Preferences, sql } from "astro:db";

export const POST: APIRoute = async ({ request, redirect, locals }) => {
    const formData = await request.formData();
    const sistem_id = formData.get('sistem_id') as string;
    const user_uid = locals.user.uid;

    try {
        const prefExists = await db.select().from(Preferences).where(sql`${Preferences.user_uid} = ${user_uid}`);
        if (prefExists.length) {
            await db.delete(Preferences).where(sql`${Preferences.user_uid} = ${user_uid}`);
        }
        const pref = sistem_id == 'null'
            ? { user_uid, }
            : { user_uid, custom_time_sistem: Number(sistem_id).valueOf(), };
        await db.insert(Preferences).values([pref]);

    } catch (error: any) {
        return new Response(error.message, { status: 500 });
    }

    return redirect('/home/dashboard/');
};
