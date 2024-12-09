import { defineMiddleware, sequence } from "astro:middleware";
import { app } from '../firebase/server';
import { getAuth } from 'firebase-admin/auth';
import { db, Preferences, sql } from "astro:db";

const authenticate = defineMiddleware(async (context, next) => {
    if (!context.url.pathname.includes('/home')) {
        return next();
    }
    if (!context.cookies.has('__session')) {
        return context.redirect('/auth/signin/');
    }
    const auth = getAuth(app);
    const sessionCookie = context.cookies.get('__session')?.value;
    const decodedCookie = await auth.verifySessionCookie(`${sessionCookie}`);
    try {
        const user = await auth.getUser(decodedCookie.uid);
        if (!user) {
            return context.redirect('/auth/signin/');
        }
        context.locals.user = user;
        return next();
    }
    catch (e) {
        return context.redirect('/api/auth/signout/');
    }
});

const isFirstTime = defineMiddleware(async (context, next) => {
    if (!context.url.pathname.includes('/home') || context.url.pathname.includes('/home/setup')) {
        return next();
    }
    const user = context.locals.user;
    const prefs = await db.select().from(Preferences).where(sql`${Preferences.user_uid} = ${user.uid}`);

    if (!prefs.length) {
        return context.redirect('/home/setup/');
    }

    return next();
});

export const onRequest = sequence(authenticate, isFirstTime);