"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { api } from "@/lib/api"
import type { Project, Member } from "@/types"
import { useToast } from "@/components/ui/use-toast"

export default function NewTaskPage() {
  const { id } = useParams<{ id: string }>()
  const projectId = Number(id)

  const [project, setProject] = useState<Project | null>(null)
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState("medium")
  const [dueDate, setDueDate] = useState(getDefaultDueDate())
  const [assigneeId, setAssigneeId] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    const fetchProjectAndMembers = async () => {
      try {
        setLoading(true)
        const [projectResponse, membersResponse] = await Promise.all([
          api.get(`/projects/${projectId}`),
          api.get(`/projects/${projectId}/members`),
        ])

        setProject(projectResponse.data)
        setMembers(membersResponse.data)
      } catch (error) {
        console.error("Erro ao buscar dados:", error)
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os dados do projeto. Tente novamente mais tarde.",
          variant: "destructive",
        })
        navigate("/")
      } finally {
        setLoading(false)
      }
    }

    fetchProjectAndMembers()
  }, [projectId, toast, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      toast({
        title: "Título obrigatório",
        description: "Por favor, informe um título para a tarefa.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      await api.post(`/projects/${projectId}/tasks`, {
        title,
        description,
        priority,
        dueDate,
        assigneeId: assigneeId || null,
      })

      toast({
        title: "Tarefa criada",
        description: "A tarefa foi criada com sucesso.",
      })

      navigate(`/projetos/${projectId}`)
    } catch (error) {
      console.error("Erro ao criar tarefa:", error)
      toast({
        title: "Erro ao criar tarefa",
        description: "Não foi possível criar a tarefa. Tente novamente mais tarde.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <main className="container max-w-2xl mx-auto py-8 px-4">
        <Card>
          <CardHeader>
            <div className="h-6 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                <div className="h-10 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
    )
  }

  if (!project) {
    return (
      <main className="container max-w-2xl mx-auto py-8 px-4">
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
    <main className="container max-w-2xl mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Adicionar Nova Tarefa</CardTitle>
          <CardDescription>Criar uma nova tarefa para o projeto: {project.name}</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título da Tarefa</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Digite o título da tarefa"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Digite a descrição da tarefa"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Prioridade</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baixa</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Data de Vencimento</Label>
                <Input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assigneeId">Atribuir Para</Label>
              <Select value={assigneeId} onValueChange={setAssigneeId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um membro da equipe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Não atribuído</SelectItem>
                  {members.map((member) => (
                    <SelectItem key={member.id} value={member.id.toString()}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" asChild>
              <Link to={`/projetos/${projectId}`}>Cancelar</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Criando..." : "Criar Tarefa"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  )
}

function getDefaultDueDate() {
  const date = new Date()
  date.setDate(date.getDate() + 7) // Default to 1 week from now
  return date.toISOString().split("T")[0]
}

