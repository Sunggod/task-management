import { createTask } from "@/lib/actions"
import { getProjectById, getProjectMembers } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { notFound } from "next/navigation"
import Link from "next/link"

export default async function NewTaskPage({ params }: { params: { id: string } }) {
  const projectId = Number.parseInt(params.id)
  const project = await getProjectById(projectId)

  if (!project) {
    notFound()
  }

  const members = await getProjectMembers(projectId)

  return (
    <main className="container max-w-2xl mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Adicionar nova tarefa</CardTitle>
          <CardDescription>Crie uma nova tarefa para o projeto {project.name}</CardDescription>
        </CardHeader>
        <form action={createTask}>
          <input type="hidden" name="projectId" value={projectId} />
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Tarefa Titulo</Label>
              <Input id="title" name="title" placeholder="Digite o titulo aki" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea id="description" name="description" placeholder="Digite a descrição aki" rows={3} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Prioridade</Label>
                <Select name="priority" defaultValue="medium">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar Prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Fácil</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="high">Díficil</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Data de vencimento</Label>
                <Input id="dueDate" name="dueDate" type="date" required defaultValue={getDefaultDueDate()} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assigneeId">Atribuir a</Label>
              <Select name="assigneeId">
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o membro da equipe" />
                </SelectTrigger>
                <SelectContent>
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
            <Button variant="outline" asChild>
              <Link href={`/projects/${projectId}`}>Cancelar</Link>
            </Button>
            <Button type="submit">Criar tarefa</Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  )
}

function getDefaultDueDate() {
  const date = new Date()
  date.setDate(date.getDate() + 7)
  return date.toISOString().split("T")[0]
}

