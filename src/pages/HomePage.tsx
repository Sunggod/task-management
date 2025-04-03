"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import ProjectList from "@/components/ProjectList"
import { ProjectSkeleton } from "@/components/Skeletons"
import { api } from "@/lib/api"
import type { Project } from "@/types"
import { useToast } from "@/components/ui/use-toast"

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        const response = await api.get("/projects")
        setProjects(response.data)
      } catch (error) {
        console.error("Erro ao buscar projetos:", error)
        toast({
          title: "Erro ao carregar projetos",
          description: "Não foi possível carregar a lista de projetos. Tente novamente mais tarde.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [toast])

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Projetos</h1>
        <Button asChild>
          <Link to="/projetos/novo">
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Projeto
          </Link>
        </Button>
      </div>

      {loading ? <ProjectSkeleton /> : <ProjectList projects={projects} />}
    </main>
  )
}

