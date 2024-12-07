import { relations } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";

export const trackers = sqliteTable("tracker", {
  id: text().primaryKey().$defaultFn(nanoid),
  closed: integer({ mode: "boolean" }).default(false).notNull(),
  createdAt: integer({ mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer({ mode: "timestamp" }).$onUpdateFn(() => new Date()),
});
export const trackersRelations = relations(trackers, ({ many }) => ({
  attendees: many(attendees),
}));
export type Tracker = typeof trackers.$inferSelect;
export type TrackerInsert = typeof trackers.$inferInsert;

export const attendees = sqliteTable("attendee", {
  id: text().primaryKey().$defaultFn(nanoid),
  name: text().notNull(),

  trackerId: text().notNull(),

  createdAt: integer({ mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer({ mode: "timestamp" }).$onUpdateFn(() => new Date()),
});
export const attendeesRelations = relations(attendees, ({ one }) => ({
  tracker: one(trackers, {
    fields: [attendees.trackerId],
    references: [trackers.id],
  }),
}));
export type Attendee = typeof attendees.$inferSelect;
export type AttendeeInsert = typeof attendees.$inferInsert;
