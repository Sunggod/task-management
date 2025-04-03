import "server-only"
import { db } from "./db"
import { cache } from "react"

export type Project = {
  id: number
  name: string
  description: string
  status: string
  progress: number
  memberCount: number
  updatedAt: string
}

export type Task = {
  id: number
  title: string
  description: string
  completed: boolean
  priority: "low" | "medium" | "high"
  dueDate: string
  assignee?: {
    id: number
    name: string
    avatar: string
  }
}

export type Member = {
  id: number
  name: string
  email: string
  avatar: string
  role: "owner" | "admin" | "member"
}

export const getProjects = cache(async (): Promise<Project[]> => {
  try {
    const projects = await db
      .select(
        "projects.id",
        "projects.name",
        "projects.description",
        "projects.status",
        db.raw(
          "COALESCE(ROUND(COUNT(CASE WHEN tasks.completed = 1 THEN 1 END) * 100.0 / NULLIF(COUNT(tasks.id), 0)), 0) as progress",
        ),
        db.raw("COUNT(DISTINCT project_members.user_id) as memberCount"),
        "projects.updated_at as updatedAt",
      )
      .from("projects")
      .leftJoin("tasks", "projects.id", "tasks.project_id")
      .leftJoin("project_members", "projects.id", "project_members.project_id")
      .groupBy("projects.id")
      .orderBy("projects.updated_at", "desc")

    return projects
  } catch (error) {
    console.error("Database error:", error)
    return []
  }
})

export const getProjectById = cache(async (id: number): Promise<Project | null> => {
  try {
    const [project] = await db
      .select(
        "projects.id",
        "projects.name",
        "projects.description",
        "projects.status",
        db.raw(
          "COALESCE(ROUND(COUNT(CASE WHEN tasks.completed = 1 THEN 1 END) * 100.0 / NULLIF(COUNT(tasks.id), 0)), 0) as progress",
        ),
        db.raw("COUNT(DISTINCT project_members.user_id) as memberCount"),
        "projects.updated_at as updatedAt",
      )
      .from("projects")
      .leftJoin("tasks", "projects.id", "tasks.project_id")
      .leftJoin("project_members", "projects.id", "project_members.project_id")
      .where("projects.id", id)
      .groupBy("projects.id")

    return project || null
  } catch (error) {
    console.error("Database error:", error)
    return null
  }
})

export const getTasksByProjectId = cache(async (projectId: number): Promise<Task[]> => {
  try {
    const tasks = await db
      .select(
        "tasks.id",
        "tasks.title",
        "tasks.description",
        "tasks.completed",
        "tasks.priority",
        "tasks.due_date as dueDate",
        "users.id as assigneeId",
        "users.name as assigneeName",
        "users.avatar as assigneeAvatar",
      )
      .from("tasks")
      .leftJoin("users", "tasks.assignee_id", "users.id")
      .where("tasks.project_id", projectId)
      .orderBy([
        { column: "tasks.completed", order: "asc" },
        { column: "tasks.due_date", order: "asc" },
      ])

    return tasks.map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      completed: task.completed === 1,
      priority: task.priority,
      dueDate: task.dueDate,
      assignee: task.assigneeId
        ? {
            id: task.assigneeId,
            name: task.assigneeName,
            avatar: task.assigneeAvatar,
          }
        : undefined,
    }))
  } catch (error) {
    console.error("Database error:", error)
    return []
  }
})

export const getProjectMembers = cache(async (projectId: number): Promise<Member[]> => {
  try {
    const members = await db
      .select("users.id", "users.name", "users.email", "users.avatar", "project_members.role")
      .from("project_members")
      .join("users", "project_members.user_id", "users.id")
      .where("project_members.project_id", projectId)
      .orderBy([
        { column: "project_members.role", order: "asc" },
        { column: "users.name", order: "asc" },
      ])

    return members
  } catch (error) {
    console.error("Database error:", error)
    return []
  }
})

