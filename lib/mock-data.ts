// Mock data for development
export const mockProjects = [
  {
    id: 1,
    name: "Website Redesign",
    description: "Redesign the company website with modern UI/UX",
    status: "active",
    progress: 65,
    memberCount: 3,
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
  {
    id: 2,
    name: "Mobile App Development",
    description: "Create a new mobile app for our customers",
    status: "planning",
    progress: 15,
    memberCount: 4,
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
  },
  {
    id: 3,
    name: "Marketing Campaign",
    description: "Q2 marketing campaign for new product launch",
    status: "on hold",
    progress: 30,
    memberCount: 2,
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
]

export const mockTasks = [
  {
    id: 1,
    projectId: 1,
    title: "Design homepage",
    description: "Create wireframes and mockups for the new homepage",
    completed: false,
    priority: "high",
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    assignee: {
      id: 2,
      name: "Jane Smith",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: 2,
    projectId: 1,
    title: "Implement responsive navigation",
    description: "Create a mobile-friendly navigation menu",
    completed: true,
    priority: "medium",
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    assignee: {
      id: 1,
      name: "John Doe",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: 3,
    projectId: 1,
    title: "Optimize images",
    description: "Compress and optimize all website images",
    completed: false,
    priority: "low",
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
    assignee: {
      id: 3,
      name: "Bob Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: 4,
    projectId: 2,
    title: "Create app architecture",
    description: "Design the overall architecture for the mobile app",
    completed: false,
    priority: "high",
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    assignee: {
      id: 2,
      name: "Jane Smith",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: 5,
    projectId: 2,
    title: "Design authentication flow",
    description: "Create login and registration screens",
    completed: false,
    priority: "medium",
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    assignee: {
      id: 1,
      name: "John Doe",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: 6,
    projectId: 3,
    title: "Develop content strategy",
    description: "Plan content for the marketing campaign",
    completed: true,
    priority: "high",
    dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    assignee: {
      id: 3,
      name: "Bob Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: 7,
    projectId: 3,
    title: "Create social media assets",
    description: "Design graphics for social media posts",
    completed: false,
    priority: "medium",
    dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days from now
    assignee: {
      id: 2,
      name: "Jane Smith",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
]

export const mockMembers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "owner",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "admin",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "member",
  },
]

