/*
<ai_context>
This server page retrieves user todos from the database and renders them in a list.
</ai_context>
*/

"use server"

import { getProfileByUserIdAction } from "@/actions/db/profiles-actions"
import { getResumesAction } from "@/actions/db/resumes-actions"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function TodoPage() {
  const { userId } = await auth()

  if (!userId) {
    return redirect("/login")
  }

  const { data: profile } = await getProfileByUserIdAction(userId)

  if (!profile) {
    return redirect("/signup")
  }

  if (profile.membership === "free") {
    return redirect("/pricing")
  }

  const resumes = await getResumesAction(userId)

  return (
    <div className="flex-1 p-4 pt-0">
      {(resumes.data ?? []).map(resume => resume.title)}
    </div>
  )
}
