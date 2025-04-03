export interface Project {
  id: number
  name: string
  description: string
  status: string
  progress: number
  memberCount: number
  updatedAt: string
}

export interface Task {
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

export interface Member {
  id: number
  name: string
  email: string
  avatar: string
  role: "owner" | "admin" | "member"
}

