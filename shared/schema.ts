import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  avatar: text("avatar"),
  language: text("language").notNull().default('en'),
  role: text("role").notNull().default('user'),
});

export const sessions = pgTable("sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  hostId: varchar("host_id").notNull(),
  category: text("category").notNull(),
  status: text("status").notNull().default('scheduled'),
  isLive: boolean("is_live").notNull().default(false),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  participantCount: integer("participant_count").notNull().default(0),
  languages: text("languages").array(),
  qrCode: text("qr_code"),
});

export const transcripts = pgTable("transcripts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull(),
  speakerId: varchar("speaker_id").notNull(),
  text: text("text").notNull(),
  language: text("language").notNull(),
  timestamp: timestamp("timestamp").notNull(),
  duration: integer("duration"),
});

export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  conversationId: varchar("conversation_id").notNull(),
  senderId: varchar("sender_id").notNull(),
  text: text("text").notNull(),
  originalLanguage: text("original_language").notNull(),
  isVoiceMessage: boolean("is_voice_message").notNull().default(false),
  timestamp: timestamp("timestamp").notNull(),
});

export const conversations = pgTable("conversations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name"),
  isGroup: boolean("is_group").notNull().default(false),
  participants: text("participants").array(),
  lastMessage: text("last_message"),
  lastMessageTime: timestamp("last_message_time"),
});

export const discussions = pgTable("discussions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull(),
  userId: varchar("user_id").notNull(),
  question: text("question").notNull(),
  language: text("language").notNull(),
  upvotes: integer("upvotes").notNull().default(0),
  timestamp: timestamp("timestamp").notNull(),
  isAnswered: boolean("is_answered").notNull().default(false),
});

export const notes = pgTable("notes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  format: text("format").notNull().default('notes'),
  duration: integer("duration"),
  timestamp: timestamp("timestamp").notNull(),
  sessionId: varchar("session_id"),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertSessionSchema = createInsertSchema(sessions).omit({ id: true });
export const insertTranscriptSchema = createInsertSchema(transcripts).omit({ id: true });
export const insertMessageSchema = createInsertSchema(messages).omit({ id: true });
export const insertConversationSchema = createInsertSchema(conversations).omit({ id: true });
export const insertDiscussionSchema = createInsertSchema(discussions).omit({ id: true });
export const insertNoteSchema = createInsertSchema(notes).omit({ id: true });

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Session = typeof sessions.$inferSelect;
export type InsertSession = z.infer<typeof insertSessionSchema>;
export type Transcript = typeof transcripts.$inferSelect;
export type InsertTranscript = z.infer<typeof insertTranscriptSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Discussion = typeof discussions.$inferSelect;
export type InsertDiscussion = z.infer<typeof insertDiscussionSchema>;
export type Note = typeof notes.$inferSelect;
export type InsertNote = z.infer<typeof insertNoteSchema>;
