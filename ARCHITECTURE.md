# 🏗️ Arquitetura do Sistema - PDF & WhatsApp Integration

## Diagrama de Fluxo Completo

```
┌─────────────────────────────────────────────────────────────────┐
│                      TRAVEL PROPOSAL GENERATOR                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   ProposalView Page                       │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │ • Hero Section com imagem do destino              │  │  │
│  │  │ • Sobre o destino (descrição, clima, etc)        │  │  │
│  │  │ • Voos (ida e volta)                             │  │  │
│  │  │ • Hospedagem com fotos e amenidades             │  │  │
│  │  │ • Inclusões (O que está incluso)                │  │  │
│  │  │ • Experiências                                   │  │  │
│  │  │ • Investimento (valores e forma de pagamento)   │  │  │
│  │  │ • Informações do consultor                      │  │  │
│  │  │ • Footer (agência, ID)                          │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │                                                            │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │      🎯 FloatingExportButton (Botão Flutuante)    │  │  │
│  │  │      Posição: Canto inferior direito              │  │  │
│  │  │      Status: Fixo durante scroll                  │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                  ▼                              │
│         ┌───────────────────────────────────────┐              │
│         │   ExportMenu Dropdown                 │              │
│         ├───────────────────────────────────────┤              │
│         │ 📥 Baixar PDF                         │              │
│         │    ├─ Draft                           │              │
│         │    ├─ Standard (padrão)              │              │
│         │    └─ High Quality                    │              │
│         ├───────────────────────────────────────┤              │
│         │ 💬 Compartilhar WhatsApp              │              │
│         │    ├─ Com número                      │              │
│         │    └─ Sem número (Web)               │              │
│         └───────────────────────────────────────┘              │
│                    ▼                    ▼                        │
│         ┌──────────────────┐  ┌────────────────────┐           │
│         │ generateProposalPDF   shareViaWhatsApp   │           │
│         └──────────────────┘  └────────────────────┘           │
│              (pdfService)         (pdfService)                  │
└─────────────────────────────────────────────────────────────────┘
         ▼                                      ▼
    ┌─────────────────────┐         ┌────────────────────────┐
    │  PDF GENERATION     │         │  WHATSAPP SHARING      │
    ├─────────────────────┤         ├────────────────────────┤
    │                     │         │                        │
    │ 1. HTML Rendering   │         │ 1. Generate Message    │
    │    ├─ createPDF     │         │ 2. Format Phone        │
    │    │   Content()    │         │ 3. Build wa.me Link    │
    │    └─ CSS Applied   │         │ 4. Open URL            │
    │                     │         │    ├─ App (mobile)     │
    │ 2. Canvas Conv.     │         │    └─ Web (desktop)    │
    │    └─ html2canvas   │         │                        │
    │                     │         │ Message Includes:      │
    │ 3. PDF Creation     │         │ ├─ Destination name    │
    │    ├─ jsPDF init    │         │ ├─ Dates               │
    │    ├─ Add images    │         │ ├─ Hotel               │
    │    ├─ Multi-page    │         │ ├─ Price               │
    │    └─ Metadata      │         │ └─ Consultant name     │
    │                     │         │                        │
    │ 4. Watermark        │         │ Result: Direct chat    │
    │    ├─ Text overlay  │         │ with client via        │
    │    └─ Opacity ctrl  │         │ WhatsApp               │
    │                     │         │                        │
    │ 5. Download         │         │                        │
    │    └─ Browser API   │         │                        │
    │                     │         │                        │
    │ Result: PDF File    │         │                        │
    │ ├─ proposta-[...]   │         │                        │
    │ │  .pdf (format)    │         │                        │
    │ └─ Size: 1-8 MB     │         │                        │
    └─────────────────────┘         └────────────────────────┘
              ▼                              ▼
        ┌─────────────┐           ┌──────────────────┐
        │ 📥 Download │           │ 💬 Open WhatsApp │
        │             │           │                  │
        │ Saved as:   │           │ If app exists:   │
        │ Downloads/  │           │ ├─ Open app      │
        │ proposta-.. │           │ └─ New chat      │
        │ .pdf        │           │                  │
        │             │           │ If no app:       │
        │ User can:   │           │ └─ WhatsApp Web  │
        │ ├─ View     │           │                  │
        │ ├─ Print    │           │ Message sent:    │
        │ ├─ Share    │           │ \"Olá! Tenho uma  │
        │ └─ Email    │           │  proposta        │
        │             │           │  especial...\"    │
        └─────────────┘           └──────────────────┘
```

## Arquitetura de Componentes

```
src/
│
├── pages/
│   └── ProposalView.tsx ────────────┐
│       (Página da Proposta)         │
│       • Renderiza todas as seções  │
│       • Integra FloatingExportBtn  │
│       • Passa proposal como prop   │
│                                    │
│                                    ▼
├── components/
│   └── ui/
│       └── ExportMenu.tsx ◄─────────┘
│           • ExportMenu (dropdown)
│           • FloatingExportButton (botão flutuante)
│           • Gerencia estado (PDF/WhatsApp)
│           • Animações Framer Motion
│           • Input para telefone
│
│           ┌─────────────────────────┐
│           │  Quando usuário clica:  │
│           ├─────────────────────────┤
│           │ Download PDF:           │
│           │ └─ pdfService.          │
│           │    downloadProposalPDF()│
│           │                         │
│           │ Share WhatsApp:         │
│           │ └─ pdfService.          │
│           │    shareViaWhatsApp()   │
│           └─────────────────────────┘
│
├── services/
│   └── pdfService.ts ◄──────────────┐
│       • generateProposalPDF()       │
│       • downloadProposalPDF()       │
│       • shareViaWhatsApp()          │
│       • generateWhatsAppShareLink() │
│       • addWatermark()              │
│       • createPDFContent()          │
│                                    │
│       Usa bibliotecas:             │
│       ├─ jsPDF                     │
│       └─ html2canvas              │
│
└── types.ts ◄──────────────────────┘
    • TravelProposal (interface)
    • Outras interfaces
    • formatCurrency() ◄─ Usada em pdfService
    • formatDate() ◄──────────────────┘
```

## Fluxo de Dados

```
User Action (Clique no botão)
         ▼
    ExportMenu State Change
         ▼
    if (action === 'download')
         ▼
    pdfService.downloadProposalPDF(proposal, options)
         ▼
    createPDFContent(proposal) → HTML Element
         ▼
    document.body.appendChild(element)
         ▼
    html2canvas(element) → Canvas
         ▼
    jsPDF() → Initialize PDF
         ▼
    Add Canvas as image to PDF
         ▼
    [Loop each page if needed]
         ▼
    addWatermark(pdf, watermarkText)
         ▼
    pdf.save('proposta-[destino].pdf')
         ▼
    document.body.removeChild(element) → Cleanup
         ▼
    Browser Download Triggered
         ▼
    File saved in Downloads folder

---

    if (action === 'whatsapp')
         ▼
    generateWhatsAppShareLink(proposal, phone)
         ▼
    Format phone number (ensure +55 format)
         ▼
    Generate message with proposal details
         ▼
    Build wa.me link with encoded message
         ▼
    window.location.href = whatsappLink
         ▼
    Browser detects whatsapp:// or wa.me/ URL
         ▼
    Open WhatsApp (app or web) with message
         ▼
    User sees pre-filled message
         ▼
    User confirms and sends (manual)
```

## Integração com Tema

```
┌────────────────────────────┐
│   User Prefers Dark/Light  │
│                            │
│   CSS em index.css         │
│   ├─ Dark mode colors      │
│   ├─ Light mode colors     │
│   └─ Tailwind classes      │
└────────────────────────────┘
         ▼
┌────────────────────────────┐
│ ExportMenu Component       │
│ ├─ Usa classes Tailwind    │
│ ├─ Herda cores do tema     │
│ └─ Animações Framer Motion │
└────────────────────────────┘
         ▼
┌────────────────────────────┐
│ PDF Gerado                 │
│ └─ SEMPRE BRANCO (interno) │
│    Independente do tema    │
│    (fundo branco            │
│     para impressão)        │
└────────────────────────────┘
```

## Ciclo de Vida do PDF

```
┌─ Criação ─────────────────────────────────┐
│  • HTML renderizado                       │
│  • Element adicionado ao DOM              │
│  • Dimensões calculadas                   │
│  • Styles aplicados                       │
└───────────────┬─────────────────────────┘
                ▼
┌─ Conversão para Canvas ───────────────────┐
│  • html2canvas renderiza HTML             │
│  • Escala conforme qualidade escolhida    │
│  • CORS habilitado para imagens           │
│  • Canvas armazenado em memória           │
└───────────────┬─────────────────────────┘
                ▼
┌─ PDF Creation ────────────────────────────┐
│  • jsPDF inicializado (A4, portrait)      │
│  • Canvas convertido para image data      │
│  • Imagem adicionada ao PDF               │
│  • Quebras de página automáticas          │
│  • Múltiplas páginas suportadas           │
└───────────────┬─────────────────────────┘
                ▼
┌─ Metadados & Watermark ───────────────────┐
│  • Título: Nome da proposta               │
│  • Autor: Nome da agência                 │
│  • Subject: Travel Proposal               │
│  • Created: Data/hora atual               │
│  • Watermark: Sobreposição com opacidade  │
│  • Watermark text: Nome da agência        │
└───────────────┬─────────────────────────┘
                ▼
┌─ Download ────────────────────────────────┐
│  • PDF convertido para Blob               │
│  • URL criada: blob:http://...            │
│  • <a> tag criada                         │
│  • Click disparado programaticamente      │
│  • Browser inicia download                │
│  • URL liberada (URL.revokeObjectURL)     │
└───────────────┬─────────────────────────┘
                ▼
┌─ Limpeza ─────────────────────────────────┐
│  • Element removido do DOM                │
│  • Canvas liberado da memória             │
│  • Blob URL destruída                     │
│  • Estado resetado no componente          │
│  • Estado \"completed\" por 2 segundos    │
└───────────────────────────────────────────┘
```

## Ciclo de Vida do WhatsApp Share

```
┌─ Geração de Mensagem ─────────────────────┐
│  • Formatar datas (pt-BR)                 │
│  • Formatar preço em R$                   │
│  • Extrair informações principais         │
│  • Montar texto legível                   │
│  • Usar emojis para destaque              │
└───────────────┬─────────────────────────┘
                ▼
┌─ Validação & Formatação do Telefone ──────┐
│  • Remover espaços e caracteres           │
│  • Validar comprimento (11+ dígitos)      │
│  • Garantir código de país (55)           │
│  • Formatar para internacional            │
│  • Validar contra padrões conhecidos      │
└───────────────┬─────────────────────────┘
                ▼
┌─ Construção da URL wa.me ─────────────────┐
│  • URL: wa.me/[phone]                     │
│  • Query param: ?text=[encoded message]   │
│  • Mensagem URL encoded                   │
│  • Limite: 4096 caracteres                │
│  • Fallback: wa.me (sem número)           │
└───────────────┬─────────────────────────┘
                ▼
┌─ Abrir WhatsApp ──────────────────────────┐
│  • Detectar app instalado (mobile)        │
│  • ├─ Se sim: whatsapp://                 │
│  • └─ Se não: wa.me (Web)                 │
│  • window.location.href = URL             │
│  • Browser trata link scheme              │
└───────────────┬─────────────────────────┘
                ▼
┌─ Resultado ───────────────────────────────┐
│  • App/Web abre                           │
│  • Novo chat ou chat existente            │
│  • Mensagem pré-preenchida                │
│  • Usuário revisa                         │
│  • Usuário envia (manual)                 │
│  • Cliente recebe mensagem com info       │
└───────────────────────────────────────────┘
```

## Stack Técnico Visual

```
┌──────────────────────────────────────────────┐
│              React App (SPA)                 │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │     UI Layer (Componentes React)       │  │
│  │                                        │  │
│  │  • ProposalView                        │  │
│  │  • ExportMenu                          │  │
│  │  • FloatingExportButton                │  │
│  │  • ThemeToggle (dark/light)            │  │
│  │  • Outros componentes...               │  │
│  │                                        │  │
│  └────────────────────────────────────────┘  │
│                    ▼                          │
│  ┌────────────────────────────────────────┐  │
│  │     Service Layer                      │  │
│  │                                        │  │
│  │  • pdfService.ts (PDF + WhatsApp)      │  │
│  │  • aiService.ts (Together AI API)      │  │
│  │  • storage.ts (localStorage)           │  │
│  │                                        │  │
│  └────────────────────────────────────────┘  │
│                    ▼                          │
│  ┌────────────────────────────────────────┐  │
│  │     External Libraries                │  │
│  │                                        │  │
│  │  • jsPDF (PDF generation)              │  │
│  │  • html2canvas (HTML to image)         │  │
│  │  • Framer Motion (animations)          │  │
│  │  • Lucide React (icons)                │  │
│  │  • Tailwind CSS (styling)              │  │
│  │  • React Router (navigation)           │  │
│  │                                        │  │
│  └────────────────────────────────────────┘  │
│                    ▼                          │
│  ┌────────────────────────────────────────┐  │
│  │     Browser APIs                       │  │
│  │                                        │  │
│  │  • Canvas API (html2canvas)            │  │
│  │  • Blob API (file handling)            │  │
│  │  • URL API (object URLs)               │  │
│  │  • localStorage (persistence)          │  │
│  │  • URL schemes (WhatsApp)              │  │
│  │                                        │  │
│  └────────────────────────────────────────┘  │
│                    ▼                          │
│  ┌────────────────────────────────────────┐  │
│  │     External Services                  │  │
│  │                                        │  │
│  │  • Together.ai (AI descriptions)       │  │
│  │  • WhatsApp (messaging)                │  │
│  │  • Image CDN (CORS enabled)            │  │
│  │                                        │  │
│  └────────────────────────────────────────┘  │
│                                              │
└──────────────────────────────────────────────┘
```

## Comunicação entre Componentes

```
ProposalView
    │
    ├─ Passa: proposal (TravelProposal)
    │
    ▼
FloatingExportButton
    │
    ├─ Renderiza menu
    ├─ Gerencia estado (open/closed)
    │
    ├─ Ao clicar \"Baixar PDF\"
    │  └─ Chama: pdfService.downloadProposalPDF()
    │
    ├─ Ao clicar \"Compartilhar WhatsApp\"
    │  ├─ Recebe número (input)
    │  └─ Chama: pdfService.shareViaWhatsApp()
    │
    └─ Emite: onExportComplete (callback)
        └─ ProposalView pode reagir
```

## Segurança & Privacy

```
Local Processing (No server)
    ├─ PDF gerado no browser
    ├─ HTML renderizado em memória
    ├─ Canvas criado localmente
    ├─ Nenhum envio de dados
    └─ Somente download local

WhatsApp Sharing (Public URL scheme)
    ├─ wa.me é URL padrão pública
    ├─ Sem API key necessária
    ├─ Sem autenticação
    ├─ Segue link scheme padrão
    └─ Usuário controla envio

CORS Policy
    ├─ Imagens: CORS habilitado
    ├─ APIs: Endpoints autorizados
    ├─ Storage: localStorage (seguro)
    └─ Cross-origin: Bloqueado por padrão
```

---

**Diagrama Atualizado**: 2024  
**Versão da Arquitetura**: 1.0.0  
**Status**: ✅ Documentado e Completo
