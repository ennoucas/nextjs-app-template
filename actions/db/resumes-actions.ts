"use server";

import { db } from "@/db/db";
import { InsertResume, SelectResume, resumesTable } from "@/db/schema";
import { ActionState } from "@/types";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

export async function createResumeAction(
  resume: Omit<InsertResume, "userId">
): Promise<ActionState<SelectResume>> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { isSuccess: false, message: "Unauthorized" };
    }

    const [newResume] = await db
      .insert(resumesTable)
      .values({ ...resume, userId })
      .returning();

    return {
      isSuccess: true,
      message: "Resume created successfully",
      data: newResume,
    };
  } catch (error) {
    console.error("Error creating resume:", error);
    return { isSuccess: false, message: "Failed to create resume" };
  }
}

export async function getResumesAction(
  userId: string
): Promise<ActionState<SelectResume[]>> {
  try {
    const resumes = await db.query.resumes.findMany({
      where: eq(resumesTable.userId, userId),
    });
    return {
      isSuccess: true,
      message: "Resumes retrieved successfully",
      data: resumes,
    };
  } catch (error) {
    console.error("Error getting resumes:", error);
    return { isSuccess: false, message: "Failed to get resumes" };
  }
}

export async function updateResumeAction(
  id: string,
  data: Partial<InsertResume>
): Promise<ActionState<SelectResume>> {
  try {
    const [updatedResume] = await db
      .update(resumesTable)
      .set(data)
      .where(eq(resumesTable.id, id))
      .returning();

    return {
      isSuccess: true,
      message: "Resume updated successfully",
      data: updatedResume,
    };
  } catch (error) {
    console.error("Error updating resume:", error);
    return { isSuccess: false, message: "Failed to update resume" };
  }
}

export async function deleteResumeAction(
  id: string
): Promise<ActionState<void>> {
  try {
    await db.delete(resumesTable).where(eq(resumesTable.id, id));
    return {
      isSuccess: true,
      message: "Resume deleted successfully",
      data: undefined,
    };
  } catch (error) {
    console.error("Error deleting resume:", error);
    return { isSuccess: false, message: "Failed to delete resume" };
  }
}
