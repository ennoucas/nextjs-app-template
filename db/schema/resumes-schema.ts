import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

export const documentTypeEnum = pgEnum("document_type", ["resume", "cover_letter"])

export const resumesTable = pgTable("resumes", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  title: text("title").notNull(),
  originalContent: text("original_content").notNull(),
  optimizedContent: text("optimized_content"),
  jobPosting: text("job_posting"),
  customInstructions: text("custom_instructions"),
  documentType: documentTypeEnum("document_type").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

export type InsertResume = typeof resumesTable.$inferInsert
export type SelectResume = typeof resumesTable.$inferSelect 