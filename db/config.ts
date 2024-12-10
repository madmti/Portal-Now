import { defineDb, defineTable, column } from 'astro:db';

export type tSistemTimeRange = Record<'range', [number, number]>;

export type tSistemTime = Record<string, tSistemTimeRange>;

export type tSistemType = 'range';

const TimeSistems = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    is_global: column.boolean(),
    name: column.text({ multiline: false }),
    sistem_type: column.text({ multiline: false }),
    sistem: column.json(),
    sorted_keys: column.json(),
  }
});

const Preferences = defineTable({
  columns: {
    user_uid: column.text({ primaryKey: true }),
    custom_time_sistem: column.number({ references: () => TimeSistems.columns.id, optional: true }),
  },
});

const Classes = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    user_uid: column.text({ multiline: false }),
    name: column.text({ multiline: false }),
  }
})


const Schedules = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    user_uid: column.text(),
    class_id: column.number({ references: () => Classes.columns.id }),
    type: column.text({ multiline: false }),
    day: column.number(),
    place: column.text({ multiline: false }),
    sistem_id: column.number({ references: () => TimeSistems.columns.id, optional: true }),
    sistem_key: column.text({ multiline: false }),
  },
});

export default defineDb({
  tables: {
    TimeSistems,
    Preferences,
    Classes,
    Schedules,
  },
})
