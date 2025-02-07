import { relations } from "drizzle-orm";
import {
  sqliteTable,
  text,
  integer,
  primaryKey,
} from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";

export const trackers = sqliteTable("tracker", {
  id: text().primaryKey().$defaultFn(nanoid),
  creatorId: text().notNull(),
  name: text().notNull(),
  closed: integer({ mode: "boolean" }).default(false).notNull(),
  createdAt: integer({ mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer({ mode: "timestamp" }).$onUpdateFn(() => new Date()),
});
export const trackersRelations = relations(trackers, ({ one, many }) => ({
  creator: one(user, {
    fields: [trackers.creatorId],
    references: [user.id],
  }),

  attendees: many(attendees),
}));
export type Tracker = typeof trackers.$inferSelect;
export type TrackerInsert = typeof trackers.$inferInsert;

export const attendees = sqliteTable(
  "attendee",
  {
    userId: text().notNull(),
    trackerId: text().notNull(),

    createdAt: integer({ mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer({ mode: "timestamp" }).$onUpdateFn(() => new Date()),
  },
  (t) => [primaryKey({ columns: [t.userId, t.trackerId] })],
);
export const attendeesRelations = relations(attendees, ({ one }) => ({
  tracker: one(trackers, {
    fields: [attendees.trackerId],
    references: [trackers.id],
  }),
  user: one(user, {
    fields: [attendees.userId],
    references: [user.id],
  }),
}));
export type Attendee = typeof attendees.$inferSelect;
export type AttendeeInsert = typeof attendees.$inferInsert;
export type AttendeeWithTracker = Attendee & { tracker: Tracker };
export type AttendeeWithUser = Attendee & { user: User };
export type AttendeeWithUserAndTracker = Attendee & { user: User } & {
  tracker: Tracker;
};

export type TrackerWithAttendees = Tracker & { attendees: Attendee[] };

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////// AUTH ////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" }).notNull(),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});
export type User = typeof user.$inferSelect;
export type UserWithAttended = User & { attended: AttendeeWithTracker[] };

export const userRelations = relations(user, ({ many }) => ({
  trackers: many(trackers),
  attended: many(attendees),
}));

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", {
    mode: "timestamp",
  }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", {
    mode: "timestamp",
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});
