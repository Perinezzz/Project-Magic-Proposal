# ✅ Checklist de Testes - PDF & WhatsApp

## 🧪 Testes de Funcionalidade

### 1. Geração de PDF

#### Teste 1.1: PDF Draft
- [ ] Abrir aplicação
- [ ] Criar uma proposta completa
- [ ] Clicar em \"Baixar PDF\"
- [ ] Selecionar qualidade \"Draft\"
- [ ] Verificar se o PDF foi baixado
- [ ] Verificar nome do arquivo: `proposta-[destino].pdf`
- [ ] Abrir PDF e validar conteúdo
- [ ] Tempo esperado: 2-3 segundos

#### Teste 1.2: PDF Standard
- [ ] Repetir teste 1.1 com qualidade \"Standard\"
- [ ] Comparar tamanho do arquivo (should be ~2-3x larger than draft)
- [ ] Verificar qualidade das imagens
- [ ] Tempo esperado: 3-5 segundos

#### Teste 1.3: PDF High Quality
- [ ] Repetir teste 1.1 com qualidade \"High\"
- [ ] Verificar melhor qualidade de renderização
- [ ] Validar watermark visível
- [ ] Tempo esperado: 5-10 segundos

#### Teste 1.4: PDF Com Imagens
- [ ] Proposta com imagens do destino
- [ ] Proposta com fotos do hotel
- [ ] Verificar se todas as imagens aparecem
- [ ] Verificar se as imagens estão nítidas
- [ ] Validar que CORS funciona corretamente

#### Teste 1.5: PDF Sem Imagens
- [ ] Proposta sem fotos
- [ ] Verificar se gera PDF mesmo assim
- [ ] Validar que não há espaços em branco excessivos
- [ ] Verificar se layout se ajusta bem

### 2. Compartilhamento WhatsApp

#### Teste 2.1: WhatsApp Com Número
- [ ] Clicar em \"Compartilhar WhatsApp\"
- [ ] Digitar número: `55 11 98765-4321`
- [ ] Clicar em \"Enviar\"
- [ ] Verificar se WhatsApp abre
- [ ] Verificar se mensagem está pré-preenchida
- [ ] Validar que número está correto
- [ ] Cancelar ou enviar mensagem

#### Teste 2.2: WhatsApp Sem Número
- [ ] Clicar em \"Compartilhar WhatsApp\"
- [ ] Deixar campo vazio
- [ ] Clicar em \"Enviar\"
- [ ] Verificar se abre WhatsApp Web
- [ ] Validar que pode escolher contato

#### Teste 2.3: WhatsApp Números Diferentes
- [ ] Testar com: `55 21 99876-5432` (RJ)
- [ ] Testar com: `55 85 98888-7777` (CE)
- [ ] Testar com: `55 31 98888-7777` (MG)
- [ ] Verificar se todos funcionam

#### Teste 2.4: Mensagem WhatsApp
- [ ] Verificar conteúdo da mensagem
- [ ] Validar que tem nome do destino
- [ ] Validar que tem datas
- [ ] Validar que tem valor
- [ ] Validar formatação

### 3. Interface & UX

#### Teste 3.1: Botão Flutuante
- [ ] Verificar se aparece na página de proposta
- [ ] Verificar posição (canto inferior direito)
- [ ] Verificar se é responsivo (mobile/tablet)
- [ ] Clicar para abrir menu
- [ ] Verificar animação do menu
- [ ] Clicar fora para fechar menu

#### Teste 3.2: Menu Dropdown
- [ ] Abrir menu
- [ ] Verificar se tem opção \"Baixar PDF\"
- [ ] Verificar se tem opção \"Compartilhar WhatsApp\"
- [ ] Verificar animações suaves
- [ ] Verificar cores conforme tema

#### Teste 3.3: Feedback Visual
- [ ] Gerar PDF e ver loading spinner
- [ ] Verificar se aparece \"Gerando PDF...\"
- [ ] Verificar check verde ao concluir
- [ ] Verificar se desaparece após 2 segundos
- [ ] Validar que não bloqueia UI

#### Teste 3.4: Estados do Menu
- [ ] Estado idle (normal)
- [ ] Estado generating (durante PDF)
- [ ] Estado completed (sucesso)
- [ ] Estado error (se houver erro)
- [ ] Transições entre estados

## 🌐 Testes de Compatibilidade

### 4. Navegadores

#### Desktop
- [ ] Chrome (versão recente)
- [ ] Firefox (versão recente)
- [ ] Safari (se Mac)
- [ ] Edge (se disponível)

#### Mobile
- [ ] Chrome Mobile
- [ ] Safari iOS
- [ ] Firefox Mobile
- [ ] Samsung Internet

#### Tablets
- [ ] iPad (Safari)
- [ ] Android Tablet (Chrome)

### 5. Sistemas Operacionais

- [ ] Windows 10/11
- [ ] macOS (Intel/Apple Silicon)
- [ ] Linux (se usar)
- [ ] iOS
- [ ] Android

### 6. WhatsApp Platforms

- [ ] WhatsApp App Android
- [ ] WhatsApp App iOS
- [ ] WhatsApp Web
- [ ] WhatsApp Business (se aplicável)

## 📱 Testes de Responsividade

### 7. Breakpoints

#### Mobile (< 640px)
- [ ] Botão flutuante visível
- [ ] Menu touch-friendly
- [ ] Input legível
- [ ] Sem overflow de conteúdo

#### Tablet (640px - 1024px)
- [ ] Layout adaptado
- [ ] Botão bem posicionado
- [ ] Menu centrado

#### Desktop (> 1024px)
- [ ] Botão posicionado corretamente
- [ ] Menu com boa margem
- [ ] Espaço suficiente para conteúdo

## 🎨 Testes de Temas

### 8. Dark Mode
- [ ] Botão visível em dark mode
- [ ] Menu com cores apropriadas
- [ ] Ícones visíveis
- [ ] PDF gerado em branco (independente do tema)

### 9. Light Mode
- [ ] Botão visível em light mode
- [ ] Menu com cores apropriadas
- [ ] Ícones visíveis
- [ ] Contraste adequado

## 🔐 Testes de Segurança

### 10. Dados Sensíveis
- [ ] Informações do cliente não vazam
- [ ] Dados não são enviados a servidores externos
- [ ] PDF gerado localmente (no browser)
- [ ] WhatsApp usa link padrão (sem API key)

### 11. CORS
- [ ] Imagens do destino carregam
- [ ] Imagens do hotel carregam
- [ ] Logo da agência carrega
- [ ] Sem warnings no console

### 12. Validação de Entrada
- [ ] Número de telefone validado
- [ ] Caracteres especiais tratados
- [ ] Entrada vazia não causa erro
- [ ] Números inválidos são rejeitados

## ⚡ Testes de Performance

### 13. Tempo de Geração

#### Deve completar em:
- [ ] Draft: < 3 segundos
- [ ] Standard: < 5 segundos
- [ ] High: < 10 segundos

#### Múltiplos PDFs
- [ ] Gerar 5 PDFs (draft)
- [ ] Tempo total: < 20 segundos
- [ ] Sem travamento de UI
- [ ] Sem memory leak

### 14. Tamanho de Arquivo

#### Tamanhos esperados (aproximado):
- [ ] Draft: 500 KB - 1 MB
- [ ] Standard: 1 - 3 MB
- [ ] High: 3 - 8 MB

### 15. Memória
- [ ] Abrir DevTools → Memory
- [ ] Gerar PDF
- [ ] Verificar que memória volta ao normal
- [ ] Sem memory leak após múltiplas gerações

### 16. CPU
- [ ] Gerar PDF não congela interface
- [ ] Outros elementos ainda responsivos
- [ ] Scrolling suave durante geração
- [ ] Animações fluidas

## 🎯 Testes de Casos de Uso

### 17. Fluxo Completo: PDF

```
1. [ ] Acessar aplicação
2. [ ] Preencher formulário
3. [ ] Criar proposta
4. [ ] Ver página de proposta
5. [ ] Clicar botão flutuante
6. [ ] Clicar \"Baixar PDF\"
7. [ ] Selecionar qualidade
8. [ ] Arquivo baixa automaticamente
9. [ ] Abrir PDF no leitor padrão
10. [ ] Validar conteúdo completo
```

### 18. Fluxo Completo: WhatsApp

```
1. [ ] Acessar aplicação
2. [ ] Preencher formulário
3. [ ] Criar proposta
4. [ ] Ver página de proposta
5. [ ] Clicar botão flutuante
6. [ ] Clicar \"Compartilhar WhatsApp\"
7. [ ] Digitar número de telefone
8. [ ] Clicar \"Enviar\"
9. [ ] WhatsApp abre
10. [ ] Mensagem está pré-preenchida
11. [ ] Pode revisar e enviar
```

### 19. Caso: Propostas com Todas as Seções
- [ ] Com fotos
- [ ] Com experiências
- [ ] Com múltiplas paradas
- [ ] Com valores altos
- [ ] Com muitas inclusões customizadas
- [ ] PDF completo em múltiplas páginas

### 20. Caso: Propostas Mínimas
- [ ] Sem fotos (tudo vazio)
- [ ] Sem experiências
- [ ] Sem paradas extras
- [ ] Sem customizações
- [ ] PDF ainda válido e formatado

## 🐛 Testes de Error Handling

### 21. Erros de Geração
- [ ] [ ] Fechar navegador durante PDF (antes de salvar)
- [ ] [ ] Virar de aba durante geração
- [ ] [ ] Sem conexão de internet (para imagens externas)
- [ ] [ ] Imagem corrompida
- [ ] [ ] Dados inválidos (crash graceful)

### 22. Erros de WhatsApp
- [ ] [ ] Telefone vazio
- [ ] [ ] Telefone inválido (< 10 dígitos)
- [ ] [ ] Telefone com caracteres inválidos
- [ ] [ ] WhatsApp não instalado (fallback Web)
- [ ] [ ] Navegador sem suporte a URL schemes

## 📋 Testes de Conteúdo do PDF

### 23. Seções Presentes
- [ ] Hero section com imagem
- [ ] Título do destino
- [ ] Datas de ida e volta
- [ ] Duração (noites)
- [ ] Número de viajantes
- [ ] Hotel
- [ ] Sobre o destino
- [ ] Clima, melhor época, idioma, moeda
- [ ] Destaques
- [ ] Fotos do destino
- [ ] Voos (ida e volta)
- [ ] Detalhes dos voos
- [ ] Hospedagem com fotos
- [ ] Avaliação do hotel
- [ ] Tipo de quarto e amenidades
- [ ] O que está incluso
- [ ] Experiências (se houver)
- [ ] Valor total
- [ ] Valor por pessoa
- [ ] Informações do consultor
- [ ] Marca d'água da agência
- [ ] ID da proposta

### 24. Formatação & Layout
- [ ] Margens corretas
- [ ] Espaçamento entre seções
- [ ] Fontes legíveis
- [ ] Tamanhos de fonte apropriados
- [ ] Cores respeitam tema
- [ ] Imagens dimensionadas corretamente
- [ ] Sem textos cortados
- [ ] Quebras de página corretas

## 📊 Testes Documentados

### 25. Resultados
- [ ] Anotar resultado de cada teste
- [ ] Documentar erros encontrados
- [ ] Descrever passos para reprodução
- [ ] Guardar screenshots dos bugs
- [ ] Versão do navegador
- [ ] Sistema operacional

## ✅ Checklist Final

- [ ] Todos os testes de funcionalidade passaram
- [ ] Todos os testes de compatibilidade passaram
- [ ] Nenhum erro no console
- [ ] Nenhum warning crítico
- [ ] Performance aceitável
- [ ] UI responsiva
- [ ] Documentação revisada
- [ ] Exemplos testados
- [ ] Tudo pronto para produção

## 🚀 Antes de Lançar

- [ ] Fazer backup do código
- [ ] Testar em staging environment
- [ ] Validar com usuários beta
- [ ] Preparar release notes
- [ ] Atualizar documentação
- [ ] Comunicar mudanças à equipe
- [ ] Monitorar analytics
- [ ] Estar preparado para rollback

---

**Dica**: Imprima este checklist e marque conforme avança nos testes! ✅

**Total de Testes**: ~100 itens  
**Tempo Estimado**: 2-4 horas  
**Recomendado**: 1-2 pessoas testando
