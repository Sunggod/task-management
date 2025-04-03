"use client"

import { Skeleton } from "@/components/ui/skeleton"

import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { TaskSkeleton } from "@/components/Skeletons"
import TaskList from "@/components/TaskList"
import ProjectMembers from "@/components/ProjectMembers"
import { PlusCircle } from "lucide-react"
import { api } from "@/lib/api"
import type { Project, Task, Member } from "@/types"
import { useToast } from "@/components/ui/use-toast"

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>()
  const [project, setProject] = useState<Project | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingTasks, setLoadingTasks] = useState(true)
  const [loadingMembers, setLoadingMembers] = useState(true)
  const { toast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true)
        const response = await api.get(`/projects/${id}`)
        setProject(response.data)
      } catch (error) {
        console.error("Erro ao buscar projeto:", error)
        toast({
          title: "Erro ao carregar projeto",
          description: "Não foi possível carregar os detalhes do projeto. Tente novamente mais tarde.",
          variant: "destructive",
        })
        navigate("/")
      } finally {
        setLoading(false)
      }
    }

    const fetchTasks = async () => {
      try {
        setLoadingTasks(true)
        const response = await api.get(`/projects/${id}/tasks`)
        setTasks(response.data)
      } catch (error) {
        console.error("Erro ao buscar tarefas:", error)
        toast({
          title: "Erro ao carregar tarefas",
          description: "Não foi possível carregar as tarefas do projeto.",
          variant: "destructive",
        })
      } finally {
        setLoadingTasks(false)
      }
    }

    const fetchMembers = async () => {
      try {
        setLoadingMembers(true)
        const response = await api.get(`/projects/${id}/members`)
        setMembers(response.data)
      } catch (error) {
        console.error("Erro ao buscar membros:", error)
        toast({
          title: "Erro ao carregar membros",
          description: "Não foi possível carregar os membros do projeto.",
          variant: "destructive",
        })
      } finally {
        setLoadingMembers(false)
      }
    }

    fetchProject()
    fetchTasks()
    fetchMembers()
  }, [id, toast, navigate])

  if (loading) {
    return (
      <main className="container mx-auto py-8 px-4">
        <div className="flex flex-col gap-4">
          <div className="h-8 w-64 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
          <div className="h-4 w-full max-w-md bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
          <div className="h-2.5 w-full bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse mt-4"></div>
        </div>
      </main>
    )
  }

  if (!project) {
    return (
      <main className="container mx-auto py-8 px-4">
        <div className="text-center py-10">
          <h3 className="text-lg font-medium mb-2">Projeto não encontrado</h3>
          <p className="text-muted-foreground mb-4">O projeto que você está procurando não existe ou foi removido.</p>
          <Button asChild>
            <Link to="/">Voltar para Projetos</Link>
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{project.name}</h1>
            <Badge variant={getStatusVariant(project.status)}>{getStatusTranslation(project.status)}</Badge>
          </div>
          <p className="text-muted-foreground mt-1">{project.description}</p>
        </div>
        <Button asChild>
          <Link to={`/projetos/${project.id}/tarefas/nova`}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Tarefa
          </Link>
        </Button>
      </div>

      <div className="mb-6 w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5">
        <div className="bg-primary h-2.5 rounded-full" style={{ width: `${project.progress}%` }}></div>
      </div>

      <Tabs defaultValue="tasks">
        <TabsList className="mb-6">
          <TabsTrigger value="tasks">Tarefas</TabsTrigger>
          <TabsTrigger value="members">Membros</TabsTrigger>
        </TabsList>
        <TabsContent value="tasks">
          {loadingTasks ? (
            <TaskSkeleton />
          ) : (
            <TaskList
              tasks={tasks}
              projectId={Number(id)}
              onTaskUpdate={(updatedTask) => {
                setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
              }}
            />
          )}
        </TabsContent>
        <TabsContent value="members">
          {loadingMembers ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center p-4 border rounded-lg">
                  <Skeleton className="h-10 w-10 mr-4 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-1/3" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              ))}
            </div>
          ) : (
            <ProjectMembers members={members} projectId={Number(id)} />
          )}
        </TabsContent>
      </Tabs>
    </main>
  )
}

function getStatusVariant(status: string) {
  switch (status.toLowerCase()) {
    case "active":
      return "default"
    case "completed":
      return "success"
    case "on hold":
      return "warning"
    case "planning":
      return "secondary"
    default:
      return "secondary"
  }
}

function getStatusTranslation(status: string) {
  switch (status.toLowerCase()) {
    case "active":
      return "Ativo"
    case "completed":
      return "Concluído"
    case "on hold":
      return "Em espera"
    case "planning":
      return "Planejamento"
    default:
      return status
  }
}

