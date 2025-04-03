import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { Suspense } from "react"
import HomePage from "./pages/HomePage"
import ProjectPage from "./pages/ProjectPage"
import NewProjectPage from "./pages/NewProjectPage"
import NewTaskPage from "./pages/NewTaskPage"
import TaskDetailPage from "./pages/TaskDetailPage"
import { ThemeProvider } from "./components/theme-provider"
import { Toaster } from "./components/ui/toaster"
import Header from "./components/Header"

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Router>
        <div className="min-h-screen bg-background">
          <Header />
          <Suspense fallback={<div className="container mx-auto py-8 px-4">Carregando...</div>}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/projetos/novo" element={<NewProjectPage />} />
              <Route path="/projetos/:id" element={<ProjectPage />} />
              <Route path="/projetos/:id/tarefas/nova" element={<NewTaskPage />} />
              <Route path="/projetos/:id/tarefas/:taskId" element={<TaskDetailPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
          <Toaster />
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App

