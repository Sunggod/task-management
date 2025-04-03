-- Create database
CREATE DATABASE IF NOT EXISTS task_management;
USE task_management;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  avatar VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('planning', 'active', 'on hold', 'completed') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Project members table
CREATE TABLE IF NOT EXISTS project_members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  user_id INT NOT NULL,
  role ENUM('owner', 'admin', 'member') DEFAULT 'member',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_project_user (project_id, user_id)
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
  due_date DATE,
  assignee_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (assignee_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  task_id INT NOT NULL,
  user_id INT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Sample data for testing
INSERT INTO users (name, email, password, avatar) VALUES
('John Doe', 'john@example.com', '$2a$10$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', '/placeholder.svg?height=40&width=40'),
('Jane Smith', 'jane@example.com', '$2a$10$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', '/placeholder.svg?height=40&width=40'),
('Bob Johnson', 'bob@example.com', '$2a$10$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', '/placeholder.svg?height=40&width=40');

INSERT INTO projects (name, description, status) VALUES
('Redesign do Site', 'Redesenhar o site da empresa com UI/UX moderno', 'active'),
('Desenvolvimento de App Mobile', 'Criar um novo aplicativo móvel para nossos clientes', 'planning'),
('Campanha de Marketing', 'Campanha de marketing do Q2 para lançamento de novo produto', 'on hold');

INSERT INTO project_members (project_id, user_id, role) VALUES
(1, 1, 'owner'),
(1, 2, 'admin'),
(1, 3, 'member'),
(2, 2, 'owner'),
(2, 1, 'member'),
(3, 3, 'owner'),
(3, 1, 'member'),
(3, 2, 'member');

INSERT INTO tasks (project_id, title, description, completed, priority, due_date, assignee_id) VALUES
(1, 'Design da página inicial', 'Criar wireframes e mockups para a nova página inicial', FALSE, 'high', DATE_ADD(CURRENT_DATE, INTERVAL 5 DAY), 2),
(1, 'Implementar navegação responsiva', 'Criar um menu de navegação amigável para dispositivos móveis', TRUE, 'medium', DATE_ADD(CURRENT_DATE, INTERVAL -2 DAY), 1),
(1, 'Otimizar imagens', 'Comprimir e otimizar todas as imagens do site', FALSE, 'low', DATE_ADD(CURRENT_DATE, INTERVAL 10 DAY), 3),
(2, 'Criar arquitetura do app', 'Projetar a arquitetura geral do aplicativo móvel', FALSE, 'high', DATE_ADD(CURRENT_DATE, INTERVAL 3 DAY), 2),
(2, 'Design do fluxo de autenticação', 'Criar as telas de login e registro', FALSE, 'medium', DATE_ADD(CURRENT_DATE, INTERVAL 7 DAY), 1),
(3, 'Desenvolver estratégia de conteúdo', 'Planejar conteúdo para a campanha de marketing', TRUE, 'high', DATE_ADD(CURRENT_DATE, INTERVAL -5 DAY), 3),
(3, 'Criar assets para redes sociais', 'Desenhar gráficos para posts em redes sociais', FALSE, 'medium', DATE_ADD(CURRENT_DATE, INTERVAL 4 DAY), 2);

INSERT INTO comments (task_id, user_id, content) VALUES
(1, 3, 'Acho que deveríamos usar uma linguagem de design mais moderna'),
(1, 2, 'Concordo, vou atualizar os mockups'),
(2, 1, 'Isso agora está completo, por favor revisem'),
(4, 2, 'Comecei a trabalhar nisso, terei um rascunho pronto amanhã');

