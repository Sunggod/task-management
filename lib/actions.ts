"use server"

import { db } from "./db"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function updateTaskStatus(formData: FormData) {
  const taskId = formData.get("taskId") as string
  const completed = formData.get("completed") === "true"

  try {
    // Get the project ID for the task
    const [task] = await db.select("project_id").from("tasks").where("id", Number.parseInt(taskId))

    if (!task) {
      throw new Error("Task not found")
    }

    // Update the task status
    await db("tasks")
      .where("id", Number.parseInt(taskId))
      .update({
        completed: completed ? 1 : 0,
        updated_at: new Date(),
      })

    // Revalidate the project page
    revalidatePath(`/projects/${task.project_id}`)
  } catch (error) {
    console.error("Error updating task status:", error)
  }
}

export async function createProject(formData: FormData) {
  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const status = formData.get("status") as string

  try {
    // Insert the new project
    const [projectId] = await db("projects").insert({
      name,
      description,
      status,
      created_at: new Date(),
      updated_at: new Date(),
    })

    // Add the current user as the project owner
    // In a real app, you would get the user ID from the session
    const userId = 1 // Placeholder for the current user ID

    await db("project_members").insert({
      project_id: projectId,
      user_id: userId,
      role: "owner",
      created_at: new Date(),
    })

    redirect(`/projects/${projectId}`)
  } catch (error) {
    console.error("Error creating project:", error)
    // In a real app, you would handle the error and show a message to the user
  }
}

export async function createTask(formData: FormData) {
  const projectId = Number.parseInt(formData.get("projectId") as string)
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const priority = formData.get("priority") as string
  const dueDate = formData.get("dueDate") as string
  const assigneeId = formData.get("assigneeId") as string

  try {
    await db("tasks").insert({
      project_id: projectId,
      title,
      description,
      priority,
      due_date: dueDate,
      assignee_id: assigneeId ? Number.parseInt(assigneeId) : null,
      completed: 0,
      created_at: new Date(),
      updated_at: new Date(),
    })

    redirect(`/projects/${projectId}`)
  } catch (error) {
    console.error("Error creating task:", error)
    // In a real app, you would handle the error and show a message to the user
  }
}

