import "server-only"
import { cache } from "react"
import { mockProjects, mockTasks, mockMembers } from "./mock-data"

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

// Use mock data for development
export const getProjects = cache(async (): Promise<Project[]> => {
  // In a real app, this would fetch from the database
  return mockProjects
})

export const getProjectById = cache(async (id: number): Promise<Project | null> => {
  // In a real app, this would fetch from the database
  const project = mockProjects.find((p) => p.id === id)
  return project || null
})

export const getTasksByProjectId = cache(async (projectId: number): Promise<Task[]> => {
  // In a real app, this would fetch from the database
  return mockTasks.filter((task) => task.projectId === projectId)
})

export const getProjectMembers = cache(async (projectId: number): Promise<Member[]> => {
  // In a real app, this would fetch from the database
  // For mock data, we'll return all members for any project
  return mockMembers
})

