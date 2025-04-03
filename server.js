import express from "express"
import cors from "cors"
import knex from "knex"
import dotenv from "dotenv"

dotenv.config()

const app = express()
const port = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Database connection
const db = knex({
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST || "localhost",
    port: Number.parseInt(process.env.DB_PORT || "3306"),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "task_management",
  },
  pool: { min: 0, max: 7 },
})

// API Routes
// Projects
app.get("/api/projects", async (req, res) => {
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

    res.json(projects)
  } catch (error) {
    console.error("Erro ao buscar projetos:", error)
    res.status(500).json({ error: "Falha ao buscar projetos" })
  }
})

app.get("/api/projects/:id", async (req, res) => {
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
      .where("projects.id", req.params.id)
      .groupBy("projects.id")

    if (!project) {
      return res.status(404).json({ error: "Projeto não encontrado" })
    }

    res.json(project)
  } catch (error) {
    console.error("Erro ao buscar projeto:", error)
    res.status(500).json({ error: "Falha ao buscar projeto" })
  }
})

app.post("/api/projects", async (req, res) => {
  const { name, description, status } = req.body

  if (!name) {
    return res.status(400).json({ error: "Nome do projeto é obrigatório" })
  }

  try {
    // Insert the new project
    const [projectId] = await db("projects").insert({
      name,
      description,
      status: status || "active",
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

    const [project] = await db.select("*").from("projects").where("id", projectId)

    res.status(201).json(project)
  } catch (error) {
    console.error("Erro ao criar projeto:", error)
    res.status(500).json({ error: "Falha ao criar projeto" })
  }
})

// Tasks
app.get("/api/projects/:projectId/tasks", async (req, res) => {
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
      .where("tasks.project_id", req.params.projectId)
      .orderBy([
        { column: "tasks.completed", order: "asc" },
        { column: "tasks.due_date", order: "asc" },
      ])

    const formattedTasks = tasks.map((task) => ({
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
        : null,
    }))

    res.json(formattedTasks)
  } catch (error) {
    console.error("Erro ao buscar tarefas:", error)
    res.status(500).json({ error: "Falha ao buscar tarefas" })
  }
})

app.post("/api/projects/:projectId/tasks", async (req, res) => {
  const { title, description, priority, dueDate, assigneeId } = req.body
  const projectId = req.params.projectId

  if (!title) {
    return res.status(400).json({ error: "Título da tarefa é obrigatório" })
  }

  try {
    const [taskId] = await db("tasks").insert({
      project_id: projectId,
      title,
      description,
      priority: priority || "medium",
      due_date: dueDate,
      assignee_id: assigneeId || null,
      completed: 0,
      created_at: new Date(),
      updated_at: new Date(),
    })

    const [task] = await db.select("*").from("tasks").where("id", taskId)

    res.status(201).json(task)
  } catch (error) {
    console.error("Erro ao criar tarefa:", error)
    res.status(500).json({ error: "Falha ao criar tarefa" })
  }
})

app.patch("/api/tasks/:taskId", async (req, res) => {
  const { completed } = req.body
  const taskId = req.params.taskId

  try {
    await db("tasks")
      .where("id", taskId)
      .update({
        completed: completed ? 1 : 0,
        updated_at: new Date(),
      })

    const [task] = await db.select("*").from("tasks").where("id", taskId)

    res.json(task)
  } catch (error) {
    console.error("Erro ao atualizar tarefa:", error)
    res.status(500).json({ error: "Falha ao atualizar tarefa" })
  }
})

// Project Members
app.get("/api/projects/:projectId/members", async (req, res) => {
  try {
    const members = await db
      .select("users.id", "users.name", "users.email", "users.avatar", "project_members.role")
      .from("project_members")
      .join("users", "project_members.user_id", "users.id")
      .where("project_members.project_id", req.params.projectId)
      .orderBy([
        { column: "project_members.role", order: "asc" },
        { column: "users.name", order: "asc" },
      ])

    res.json(members)
  } catch (error) {
    console.error("Erro ao buscar membros:", error)
    res.status(500).json({ error: "Falha ao buscar membros" })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`)
})

console.log("Configuração do servidor completa. Pronto para processar requisições.")

