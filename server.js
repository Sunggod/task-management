import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { getProjects, getProjectById, getTasksByProjectId, getProjectMembers } from "./lib/data" 
dotenv.config()

const app = express()
const port = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Rota para buscar todos os projetos
app.get("/api/projects", async (req, res) => {
  try {
    const projects = await getProjects()  
    res.json(projects)
  } catch (error) {
    console.error("Erro ao buscar projetos:", error)
    res.status(500).json({ error: "Falha ao buscar projetos" })
  }
})

// Rota para buscar um projeto pelo ID
app.get("/api/projects/:id", async (req, res) => {
  try {
    const project = await getProjectById(Number(req.params.id))
    if (!project) {
      return res.status(404).json({ error: "Projeto não encontrado" })
    }
    res.json(project)
  } catch (error) {
    console.error("Erro ao buscar projeto:", error)
    res.status(500).json({ error: "Falha ao buscar projeto" })
  }
})

// Rota para buscar as tarefas de um projeto
app.get("/api/projects/:projectId/tasks", async (req, res) => {
  try {
    const tasks = await getTasksByProjectId(Number(req.params.projectId))  
    res.json(tasks)
  } catch (error) {
    console.error("Erro ao buscar tarefas:", error)
    res.status(500).json({ error: "Falha ao buscar tarefas" })
  }
})

// Rota para buscar membros de um projeto
app.get("/api/projects/:projectId/members", async (req, res) => {
  try {
    const members = await getProjectMembers(Number(req.params.projectId))  
    res.json(members)
  } catch (error) {
    console.error("Erro ao buscar membros:", error)
    res.status(500).json({ error: "Falha ao buscar membros" })
  }
})

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`)
})

console.log("Configuração do servidor completa. Pronto para processar requisições.")
