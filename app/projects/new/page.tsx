import { createProject } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

export default function NewProjectPage() {
  return (
    <main className="container max-w-2xl mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Criar novo projeto</CardTitle>
          <CardDescription>Adicione um novo projeto para começar a organizar suas tarefas.</CardDescription>
        </CardHeader>
        <form action={createProject}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do projeto</Label>
              <Input id="name" name="name" placeholder="Digite o nome do projeto" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea id="description" name="description" placeholder="Digite a descrição do projeto" rows={4} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select name="status" defaultValue="active">
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="planning">Planejando</SelectItem>
                  <SelectItem value="on hold">Em espera</SelectItem>
                  <SelectItem value="completed">Completado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/">Cancelar</Link>
            </Button>
            <Button type="submit">Criar Projeto</Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  )
}

