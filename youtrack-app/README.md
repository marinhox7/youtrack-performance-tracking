# 📊 iMarinho Performance Dashboard - Versão 2.0 (Moderna)

Plugin para YouTrack 2024.1+ que adiciona widget de dashboard para análise de KPIs e métricas de performance usando a **arquitetura moderna de Apps** (`YTApp.register()`).

## 🆕 Novidades da Versão 2.0

- ✅ **Migrado para arquitetura moderna** (`YTApp.register()`)
- ✅ **Compatível com YouTrack 2024.1+**
- ✅ **Zero problemas de CORS** - API nativa do YouTrack
- ✅ **Estados corretos** (MAIÚSCULAS)
- ✅ **Melhor tratamento de erros** com fallback robusto
- ✅ **Interface moderna** com animações e gradientes
- ✅ **Branding iMarinho** em todos os cards
- ✅ **Team statistics** da equipe iMarinho
- ✅ **Auto-resize** e responsividade aprimorada

## 📊 Métricas Incluídas

### 🎯 4 Cards Principais:
1. **📊 Total de Issues** - Excluindo BACKLOG e MOVED TO NEXT SPRINT
2. **✅ Issues Resolvidas** - Estados: DONE, CLOSED, PRODUCTION
3. **🚀 Issues Ativas** - Estados: IN DEVELOPMENT, CORRECTION, READY TO REVIEW, REVIEWING, APPROVED
4. **📈 Taxa de Conclusão** - (Resolvidas / Total) × 100
5. **📁 Projetos** - Número de projetos únicos

### 📋 Detalhes Incluídos:
- Distribuição completa por estados
- Top 5 team iMarinho
- Issues ignoradas no cálculo
- Timestamp de última atualização
- Powered by iMarinho Performance Suite v2.0

## 🚀 Instalação

### Via Upload Manual (Recomendado)
1. Baixe o arquivo `youtrack-performance-dashboard-v2.zip`
2. Acesse YouTrack como administrador
3. Vá em **Administration** → **Apps**
4. Clique em **Upload app**
5. Selecione o arquivo ZIP
6. Clique em **Upload**

### Build Local
```bash
cd youtrack-app

# Instalar dependências (se necessário)
npm install

# Build do widget
npm run build
```

## ⚙️ Configuração

1. Após instalar o app, vá em **Dashboard**
2. Clique em **Add widget**
3. Selecione **iMarinho Performance Dashboard Moderno**
4. Configure as dimensões conforme necessário (recomendado: 800x500px)

## 🛠️ Desenvolvimento

```bash
# Instalar dependências
npm install

# Servidor de desenvolvimento (recomendado)
npm run dev

# Para HTTPS (se necessário)
npm run dev-https

# Testar o widget
npm run test
```

### URLs de Desenvolvimento:
- **HTTP**: http://localhost:9033
- **Widget**: http://localhost:9033/widgets/dashboard-suite/index.html

## 📋 Requisitos

- **YouTrack 2024.1+** (obrigatório para YTApp.register)
- **Permissões:** READ_ISSUE, READ_PROJECT, READ_USER
- **Dados:** Issues dos últimos 30 dias
- **Node.js**: 18.0.0+ (para desenvolvimento)

## 🔧 Arquitetura Técnica

### API Moderna:
```javascript
// Registra com YouTrack
host = await YTApp.register({
    onUnhandledError: (error) => { ... }
});

// Busca dados sem CORS
const issues = await host.fetchYouTrack(
    'api/issues?fields=...'
);
```

### Estados Configurados:
```javascript
const ESTADOS_RESOLVIDOS = ['DONE', 'CLOSED', 'PRODUCTION'];
const ESTADOS_IGNORADOS = ['BACKLOG', 'MOVED TO NEXT SPRINT'];
const ESTADOS_ATIVOS = ['IN DEVELOPMENT', 'CORRECTION', 'READY TO REVIEW', 'REVIEWING', 'APPROVED'];
```

## 🔧 Troubleshooting

### ❌ Widget não carrega
- **Verifique versão**: YouTrack 2024.1+ obrigatório
- **Verifique manifest**: Schema deve ser `youtrack-app.json`
- **Verifique logs**: Console do navegador para erros

### ⚠️ Dados não aparecem
- **Verifique permissões**: READ_ISSUE, READ_PROJECT, READ_USER
- **Fallback automático**: Widget mostra dados de exemplo se API falhar
- **Query**: Busca issues dos últimos 30 dias

### 🔄 Erro de API
- **Fallback robusto**: Sistema automaticamente usa dados de exemplo
- **Logs detalhados**: Console mostra exatamente o que aconteceu
- **Retry**: Botão "Atualizar" para tentar novamente

## 📈 Performance

- **Cache inteligente**: 5 minutos de cache automático
- **Auto-refresh**: Atualização a cada 5 minutos
- **Lazy loading**: Carregamento otimizado
- **Responsive design**: Adapta-se a qualquer tamanho

## 🎨 Customização

### Cores dos Cards:
- **Total**: #3B82F6 (Azul)
- **Resolvidas**: #10B981 (Verde)
- **Ativas**: #F59E0B (Laranja)
- **Taxa**: #8B5CF6 (Roxo)
- **Projetos**: #6B7280 (Cinza)

### Branding iMarinho:
- Badge "iMarinho" em cada card
- Dados de exemplo com equipe iMarinho
- Projetos iMarinho (IPERF, IYT, IANAL, IREP)
- Powered by iMarinho Performance Suite v2.0

## 📄 Changelog

### v2.0.0 (Atual)
- 🚀 **BREAKING**: Migração completa para `YTApp.register()`
- ✅ Compatibilidade com YouTrack 2024.1+
- 🎨 Interface completamente redesenhada
- 📊 Branding iMarinho integrado
- 🔧 Zero problemas de CORS
- 📈 Performance melhorada
- 🛡️ Fallback mais robusto

### v1.x.x (Legado)
- ❌ Usado API `YT` descontinuada
- ❌ Problemas de CORS
- ❌ Compatibilidade limitada

## 📞 Suporte

- **Desenvolvido por**: iMarinho Team
- **Email**: dev@imarinho.com
- **URL**: https://imarinho.com
- **GitHub**: https://github.com/imarinho/youtrack-performance-tracking

## 📄 Licença

MIT License - Developed by iMarinho Team

---

**🎯 iMarinho Performance Dashboard v2.0 - Powered by Modern YouTrack Apps Architecture**