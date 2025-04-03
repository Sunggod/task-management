"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ArrowLeft, MessageSquare } from "lucide-react"
import { api } from "@/lib/api"
import type { Project, Task } from "@/types"
import { useToast } from "@/components/ui/use-toast"

export default function TaskDetailPage() {
  const { id, taskId } = useParams<{ id: string; taskId: string }>()
  const projectId = Number(id)
  const taskIdNum = Number(taskId)

  const [project, setProject] = useState<Project | null>(null)
  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const [updatingTask, setUpdatingTask] = useState(false)

  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    const fetchProjectAndTask = async () => {
      try {
        setLoading(true)
        const [projectResponse, tasksResponse] = await Promise.all([
          api.get(`/projects/${projectId}`),
          api.get(`/projects/${projectId}/tasks`),
        ])

        setProject(projectResponse.data)

        const foundTask = tasksResponse.data.find((t: any) => t.id === taskIdNum)
        if (foundTask) {
          setTask(foundTask)
        } else {
          toast({
            title: "Tarefa não encontrada",
            description: "A tarefa que você está procurando não existe ou foi removida.",
            variant: "destructive",
          })
          navigate(`/projetos/${projectId}`)
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error)
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os dados da tarefa. Tente novamente mais tarde.",
          variant: "destructive",
        })
        navigate("/")
      } finally {
        setLoading(false)
      }
    }

    fetchProjectAndTask()
  }, [projectId, taskIdNum, toast, navigate])

  const updateTaskStatus = async (completed: boolean) => {
    if (!task) return

    try {
      setUpdatingTask(true)
      const response = await api.patch(`/tasks/${task.id}`, { completed })

      // Converter o formato da resposta para o formato esperado pelo componente
      const updatedTask: Task = {
        ...task,
        completed,
      }

      setTask(updatedTask)

      toast({
        title: completed ? "Tarefa concluída" : "Tarefa reaberta",
        description: completed ? "A tarefa foi marcada como concluída." : "A tarefa foi marcada como não concluída.",
      })
    } catch (error) {
      console.error("Erro ao atualizar status da tarefa:", error)
      toast({
        title: "Erro ao atualizar tarefa",
        description: "Não foi possível atualizar o status da tarefa. Tente novamente mais tarde.",
        variant: "destructive",
      })
    } finally {
      setUpdatingTask(false)
    }
  }

  if (loading) {
    return (
      <main className="container max-w-3xl mx-auto py-8 px-4">
        <div className="mb-6">
          <div className="h-8 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-4"></div>
          <Card>
            <CardHeader>
              <div className="h-6 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mt-2"></div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                <div className="h-16 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                  <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                  <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  if (!project || !task) {
    return (
      <main className="container max-w-3xl mx-auto py-8 px-4">
        <div className="text-center py-10">
          <h3 className="text-lg font-medium mb-2">Tarefa não encontrada</h3>
          <p className="text-muted-foreground mb-4">A tarefa que você está procurando não existe ou foi removida.</p>
          <Button asChild>
            <Link to={`/projetos/${projectId}`}>Voltar para o Projeto</Link>
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main className="container max-w-3xl mx-auto py-8 px-4">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link to={`/projetos/${projectId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para o Projeto
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <Checkbox
                  id={`task-${task.id}`}
                  checked={task.completed}
                  disabled={updatingTask}
                  onCheckedChange={(checked) => {
                    if (typeof checked === "boolean") {
                      updateTaskStatus(checked)
                    }
                  }}
                  className="mt-1"
                />
                <div>
                  <CardTitle className={task.completed ? "line-through text-muted-foreground" : ""}>
                    {task.title}
                  </CardTitle>
                  <CardDescription>{project.name}</CardDescription>
                </div>
              </div>
              <Badge variant="outline">{getPriorityTranslation(task.priority)}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-1">Descrição</h3>
              <p className="text-sm text-muted-foreground">{task.description || "Nenhuma descrição fornecida."}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <h3 className="text-sm font-medium mb-1">Data de Vencimento</h3>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(task.dueDate), "PPP", { locale: ptBR })}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-1">Responsável</h3>
                {task.assignee ? (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                      <AvatarFallback>{getInitials(task.assignee.name)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{task.assignee.name}</span>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Não atribuído</p>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-6">
            <div className="w-full">
              <h3 className="text-sm font-medium mb-3 flex items-center">
                <MessageSquare className="mr-2 h-4 w-4" />
                Comentários
              </h3>
              <p className="text-sm text-muted-foreground text-center py-6">
                Nenhum comentário ainda. Seja o primeiro a comentar!
              </p>
              {/* Formulário de comentários seria adicionado aqui em uma aplicação real */}
            </div>
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2)
}

function getPriorityTranslation(priority: string) {
  switch (priority.toLowerCase()) {
    case "low":
      return "Baixa"
    case "medium":
      return "Média"
    case "high":
      return "Alta"
    default:
      return priority
  }
}

