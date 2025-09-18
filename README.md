# YouTrack Performance Dashboard

Dashboard gerencial para análise de KPIs e métricas de performance do YouTrack.

## Funcionalidades

- **KPIs Principais**:
  - Total de issues
  - Issues resolvidas (quantidade e percentual)
  - Tempo médio de resolução

- **Visualizações**:
  - Issues por prioridade (gráfico de pizza)
  - Issues por estado (gráfico de pizza)
  - Issues por projeto (gráfico de barras)
  - Performance da equipe (gráfico de barras)
  - Timeline de criação de issues (gráfico de linha)

## Configuração

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   ```bash
   cp .env.local.example .env.local
   ```

4. Edite o arquivo `.env.local` com suas credenciais do YouTrack:
   ```
   NEXT_PUBLIC_YOUTRACK_URL=https://yourdomain.myjetbrains.com/youtrack
   NEXT_PUBLIC_YOUTRACK_TOKEN=your-permanent-token-here
   ```

## Como obter o token do YouTrack

1. Acesse seu YouTrack
2. Vá em Profile → Authentication → New token
3. Crie um token permanente com as permissões necessárias
4. Cole o token no arquivo `.env.local`

## Execução

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm run build
npm start
```

## Tecnologias Utilizadas

- **Next.js 15** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Recharts** - Gráficos e visualizações
- **Axios** - Cliente HTTP para API
- **Lucide React** - Ícones

## Estrutura do Projeto

```
├── app/                 # Páginas da aplicação
├── components/          # Componentes reutilizáveis
├── lib/                 # Utilitários e configurações
├── types/               # Definições de tipos TypeScript
└── public/              # Arquivos estáticos
```

## API do YouTrack

O dashboard utiliza a API REST do YouTrack para buscar dados de issues. As principais consultas incluem:

- Issues criadas nos últimos 30 dias
- Issues resolvidas por período
- Dados de projetos e usuários
- Campos customizados

## Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request