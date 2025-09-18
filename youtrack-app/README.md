# YouTrack Performance Dashboard

Plugin para YouTrack que adiciona widgets de dashboard para análise de KPIs e métricas de performance.

## Widgets Inclusos

### 1. Performance KPIs
- Total de issues dos últimos 30 dias
- Issues resolvidas (quantidade e percentual)
- Tempo médio de resolução

### 2. Issues por Prioridade
- Gráfico de pizza mostrando distribuição por prioridade
- Percentuais e contagens

### 3. Issues por Projeto
- Gráfico de barras mostrando volume por projeto
- Comparação visual entre projetos

### 4. Timeline de Issues
- Gráfico de linha mostrando criação ao longo dos últimos 30 dias
- Identificação de picos e tendências

### 5. Performance da Equipe
- Gráfico de barras comparando issues totais vs resolvidas
- Top 10 membros da equipe por volume
- Taxa de resolução por pessoa

## Instalação

### Método 1: Upload Manual
1. Baixe ou gere o arquivo ZIP do plugin
2. Acesse YouTrack como administrador
3. Vá em **Administration** → **Apps**
4. Clique em **Upload app**
5. Selecione o arquivo `youtrack-performance-dashboard.zip`
6. Clique em **Upload**

### Método 2: Build Local
```bash
# Clone ou baixe os arquivos
cd youtrack-app

# Gerar o ZIP (Linux/Mac)
npm run build

# Gerar o ZIP (Windows)
powershell Compress-Archive -Path manifest.json,widgets -DestinationPath youtrack-performance-dashboard.zip
```

## Configuração

1. Após instalar o app, vá em **Dashboard**
2. Clique em **Add widget**
3. Selecione os widgets do Performance Dashboard:
   - Performance KPIs
   - Issues por Prioridade
   - Issues por Projeto
   - Timeline de Issues
   - Performance da Equipe

## Funcionalidades

- **Atualização automática**: Dados são atualizados a cada 5 minutos
- **Período configurável**: Atualmente fixado em 30 dias
- **Interface responsiva**: Adapta-se ao tamanho do widget
- **Tratamento de erros**: Exibe mensagens claras em caso de falha

## Tecnologias Utilizadas

- **HTML5/CSS3**: Interface dos widgets
- **Chart.js**: Gráficos interativos
- **YouTrack REST API**: Coleta de dados
- **JavaScript ES6+**: Lógica dos widgets

## Personalização

Para personalizar os widgets:

1. Modifique os arquivos HTML em `widgets/*/index.html`
2. Ajuste estilos CSS diretamente nos arquivos
3. Altere consultas da API conforme necessário
4. Gere novo ZIP e reinstale

## Estrutura do Projeto

```
youtrack-app/
├── manifest.json                    # Configuração do app
├── package.json                     # Metadados do projeto
├── README.md                        # Documentação
└── widgets/
    ├── kpis/
    │   └── index.html              # Widget de KPIs
    ├── priority-chart/
    │   └── index.html              # Gráfico de prioridades
    ├── project-chart/
    │   └── index.html              # Gráfico de projetos
    ├── timeline/
    │   └── index.html              # Timeline de issues
    └── team-performance/
        └── index.html              # Performance da equipe
```

## API Utilizada

O plugin utiliza as seguintes endpoints da API REST do YouTrack:

- `/api/issues` - Busca de issues com filtros
- Campos utilizados: `id`, `created`, `resolved`, `priority`, `project`, `assignee`, `state`
- Filtros: Período de criação dos últimos 30 dias

## Limitações

- Período fixo de 30 dias (pode ser personalizado no código)
- Máximo de 1000 issues por consulta
- Requer permissões de leitura nas issues
- Funciona apenas com YouTrack 2023.1+

## Suporte

Para problemas ou sugestões:
1. Verifique os logs do browser (F12 → Console)
2. Confirme permissões de acesso às issues
3. Teste com consultas manuais na API

## Licença

MIT License - veja arquivo de licença para detalhes.