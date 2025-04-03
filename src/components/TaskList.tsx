"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import type { Task } from "@/types"
import { api } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

interface TaskListProps {
  tasks: Task[]
  projectId: number
  onTaskUpdate: (task: Task) => void
}

export default function TaskList({ tasks, projectId, onTaskUpdate }: TaskListProps) {
  const [updatingTasks, setUpdatingTasks] = useState<number[]>([])
  const { toast } = useToast()

  const updateTaskStatus = async (taskId: number, completed: boolean) => {
    try {
      setUpdatingTasks((prev) => [...prev, taskId])
      const response = await api.patch(`/tasks/${taskId}`, { completed })

      // Converter o formato da resposta para o formato esperado pelo componente
      const updatedTask: Task = {
        ...response.data,
        completed: response.data.completed === 1,
        dueDate: response.data.due_date,
        assignee: response.data.assignee_id
          ? {
              id: response.data.assignee_id,
              name: response.data.assignee_name || "",
              avatar: response.data.assignee_avatar || "",
            }
          : undefined,
      }

      onTaskUpdate(updatedTask)

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
      setUpdatingTasks((prev) => prev.filter((id) => id !== taskId))
    }
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium mb-2">Nenhuma tarefa encontrada</h3>
        <p className="text-muted-foreground">Adicione sua primeira tarefa para começar.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div key={task.id} className="flex items-start p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900">
          <Checkbox
            id={`task-${task.id}`}
            checked={task.completed}
            disabled={updatingTasks.includes(task.id)}
            onCheckedChange={(checked) => {
              if (typeof checked === "boolean") {
                updateTaskStatus(task.id, checked)
              }
            }}
            className="mt-1 mr-3"
          />

          <div className="flex-1">
            <Link to={`/projetos/${projectId}/tarefas/${task.id}`} className="block">
              <h3 className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                {task.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline">{getPriorityTranslation(task.priority)}</Badge>
                <span className="text-xs text-muted-foreground">
                  Vencimento {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true, locale: ptBR })}
                </span>
              </div>
            </Link>
          </div>

          {task.assignee && (
            <Avatar className="h-8 w-8">
              <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
              <AvatarFallback>{getInitials(task.assignee.name)}</AvatarFallback>
            </Avatar>
          )}
        </div>
      ))}
    </div>
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

