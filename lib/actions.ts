"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { mockTasks, mockProjects } from "./mock-data"

export async function updateTaskStatus(formData: FormData) {
  const taskId = formData.get("taskId") as string
  const completed = formData.get("completed") === "true"

  try {
    // Find the task and its project
    const task = mockTasks.find((t) => t.id === Number.parseInt(taskId))

    if (!task) {
      throw new Error("Task not found")
    }

    // In a real app, this would update the database
    // For mock data, we'll just update the in-memory object
    task.completed = completed

    // Revalidate the project page
    revalidatePath(`/projects/${task.projectId}`)
  } catch (error) {
    console.error("Error updating task status:", error)
  }
}

export async function createProject(formData: FormData) {
  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const status = formData.get("status") as string

  try {
    // In a real app, this would insert into the database
    // For mock data, we'll just create a new project with the next ID
    const newId = Math.max(...mockProjects.map((p) => p.id)) + 1

    const newProject = {
      id: newId,
      name,
      description,
      status,
      progress: 0,
      memberCount: 1,
      updatedAt: new Date().toISOString(),
    }

    mockProjects.push(newProject)

    redirect(`/projects/${newId}`)
  } catch (error) {
    console.error("Error creating project:", error)
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
    // In a real app, this would insert into the database
    // For mock data, we'll just create a new task with the next ID
    const newId = Math.max(...mockTasks.map((t) => t.id)) + 1

    const newTask = {
      id: newId,
      projectId,
      title,
      description,
      completed: false,
      priority: priority as "low" | "medium" | "high",
      dueDate,
      assignee: assigneeId
        ? {
            id: Number.parseInt(assigneeId),
            name: "Assigned User", // In a real app, we would look up the user's name
            avatar: "/placeholder.svg?height=40&width=40",
          }
        : undefined,
    }

    mockTasks.push(newTask)

    redirect(`/projects/${projectId}`)
  } catch (error) {
    console.error("Error creating task:", error)
  }
}

