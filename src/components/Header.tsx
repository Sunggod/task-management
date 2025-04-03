import { Link } from "react-router-dom"
import { Mountain } from "lucide-react"
import { Button } from "./ui/button"
import { ModeToggle } from "./mode-toggle"

export default function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center justify-center">
          <Mountain className="h-6 w-6 mr-2" />
          <span className="font-bold">Gerenciador de Tarefas</span>
        </Link>
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex gap-6">
            <Link to="/" className="text-sm font-medium hover:underline underline-offset-4">
              Projetos
            </Link>
            <a href="#" className="text-sm font-medium hover:underline underline-offset-4">
              Equipe
            </a>
            <a href="#" className="text-sm font-medium hover:underline underline-offset-4">
              Relatórios
            </a>
          </nav>
          <ModeToggle />
          <Button variant="outline" size="sm">
            Minha Conta
          </Button>
        </div>
      </div>
    </header>
  )
}

