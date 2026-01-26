# 💻 Exemplos Práticos - PDF & WhatsApp Integration

## Exemplos de Uso

### 1️⃣ Exemplo: Exportar PDF Simples

```typescript
import { downloadProposalPDF } from './services/pdfService';

// Dentro de um componente React
const handleExport = async () => {
  await downloadProposalPDF(proposal);
  // Arquivo baixado: proposta-viagem.pdf
};
```

### 2️⃣ Exemplo: Exportar PDF com Customização

```typescript
import { downloadProposalPDF } from './services/pdfService';

const handleExportCustom = async () => {
  await downloadProposalPDF(proposal, {
    fileName: 'meu-pacote-cancun',
    quality: 'high',
    includeWatermark: true
  });
  // Arquivo baixado: meu-pacote-cancun.pdf
};
```

### 3️⃣ Exemplo: Compartilhar WhatsApp (Com Número)

```typescript
import { shareViaWhatsApp } from './services/pdfService';

const handleWhatsAppShare = () => {
  // Cliente em São Paulo
  shareViaWhatsApp(proposal, '55 11 98765-4321');
};
```

### 4️⃣ Exemplo: Compartilhar WhatsApp (Sem Número)

```typescript
import { shareViaWhatsApp } from './services/pdfService';

const handleWhatsAppShare = () => {
  // Abre WhatsApp Web
  shareViaWhatsApp(proposal);
};
```

### 5️⃣ Exemplo: Gerar Link de Compartilhamento

```typescript
import { generateWhatsAppShareLink } from './services/pdfService';

const getShareLink = () => {
  const link = generateWhatsAppShareLink(proposal, '55 85 99999-8888');
  console.log(link);
  // wa.me/558599998888?text=Olá! Tenho uma proposta...
};
```

### 6️⃣ Exemplo: Integrar Botão Customizado

```typescript
import { downloadProposalPDF, shareViaWhatsApp } from './services/pdfService';

// Seu próprio componente
export const MyExportButtons = ({ proposal }) => {
  return (
    <div className="flex gap-4">
      <button
        onClick={() => downloadProposalPDF(proposal)}
        className="btn btn-primary"
      >
        📥 Baixar PDF
      </button>
      
      <button
        onClick={() => shareViaWhatsApp(proposal)}
        className="btn btn-success"
      >
        💬 Compartilhar
      </button>
    </div>
  );
};
```

## Casos de Uso Reais

### Caso 1: Consultor Envia Proposta por Email

```typescript
// Flow: Gerar PDF → Anexar Email → Enviar

const handleSendByEmail = async (email: string) => {
  try {
    // Gerar PDF
    const pdfBlob = await generateProposalPDF(proposal, {
      quality: 'high',
      includeWatermark: true
    });
    
    // Criar FormData
    const formData = new FormData();
    formData.append('file', pdfBlob, 'proposta.pdf');
    formData.append('to', email);
    formData.append('subject', `Proposta - ${proposal.destination.name}`);
    
    // Enviar para seu backend
    await fetch('/api/send-email', {
      method: 'POST',
      body: formData
    });
    
    alert('Proposta enviada com sucesso!');
  } catch (error) {
    console.error('Erro:', error);
    alert('Erro ao enviar proposta');
  }
};
```

### Caso 2: Cliente Recebe WhatsApp Imediato

```typescript
// Flow: Criar proposta → Abrir WhatsApp → Enviar link

const handleQuickShare = async () => {
  const clientPhone = '55 21 98765-4321'; // Rio de Janeiro
  
  shareViaWhatsApp(proposal, clientPhone);
  
  // Cliente verá na tela:
  // "Olá! 👋
  //  Tenho uma proposta especial de viagem para você! 🌍
  //  
  //  📍 Destino: Cancun
  //  📅 Datas: 15 de junho a 22 de junho de 2024
  //  🏨 Hospedagem: Grand Palladium
  //  💰 Investimento: R$ 8.950,00"
};
```

### Caso 3: Apresentação Presencial

```typescript
// Flow: Gerar PDF em alta qualidade → Imprimir ou mostrar tela

const handlePresentation = async () => {
  const pdfBlob = await generateProposalPDF(proposal, {
    quality: 'high', // Melhor qualidade para impressão
    fileName: `apresentacao-${proposal.destination.name}`
  });
  
  // Abrir em nova aba para visualizar
  const url = URL.createObjectURL(pdfBlob);
  window.open(url, '_blank');
  
  // Usuário pode:
  // 1. Imprimir (Ctrl+P)
  // 2. Salvar como PDF
  // 3. Compartilhar tela
};
```

### Caso 4: Múltiplas Propostas para um Cliente

```typescript
// Flow: Gerar 3 PDFs com opções diferentes

const handleMultipleOptions = async (clientPhone: string) => {
  const proposals = [proposal1, proposal2, proposal3];
  
  for (let i = 0; i < proposals.length; i++) {
    const pdf = await generateProposalPDF(proposals[i], {
      fileName: `opcao-${i + 1}-${proposals[i].destination.name}`
    });
    
    // Baixar cada PDF
    const link = document.createElement('a');
    link.href = URL.createObjectURL(pdf);
    link.download = `opcao-${i + 1}.pdf`;
    link.click();
    
    // Aguardar entre downloads
    await new Promise(r => setTimeout(r, 1000));
  }
  
  // Depois compartilhar via WhatsApp
  setTimeout(() => {
    shareViaWhatsApp(proposal1, clientPhone);
  }, 3000);
};
```

## Números de Telefone - Exemplos

### Brasil

```javascript
// São Paulo
const sp = '55 11 98765-4321';
const sp_alt = '5511987654321'; // Sem formatação

// Rio de Janeiro
const rj = '55 21 99876-5432';

// Minas Gerais
const mg = '55 31 98888-7777';

// Bahia
const ba = '55 71 99999-8888';

// Ceará
const ce = '55 85 98888-7777';

// São Paulo (comercial)
const business = '55 11 3456-7890';
```

### Outros Países (Exemplos)

```javascript
// Argentina
const ar = '54 11 2345-6789';

// Colômbia
const co = '57 1 2345-6789';

// Peru
const pe = '51 1 2345-6789';

// Uruguai
const uy = '598 2 1234-5678';

// EUA (cliente no exterior)
const usa = '1 305 123-4567'; // Miami
```

## Números com Erro - Evite

```javascript
// ❌ ERRADO - Sem código de país
const wrong1 = '11 98765-4321';

// ❌ ERRADO - Código incompleto
const wrong2 = '5 11 98765-4321';

// ❌ ERRADO - Só números sem formatação inadequada
const wrong3 = '(11) 98765-4321';

// ✅ CORRETO - Formatos aceitos
const correct1 = '55 11 98765-4321';
const correct2 = '5511987654321';
const correct3 = '+55 11 98765-4321';
```

## Mensagem WhatsApp - Customização

### Mensagem Padrão

```
Olá! 👋

Tenho uma proposta especial de viagem para você! 🌍

📍 Destino: [Nome do Destino]
📅 Datas: [Data Ida] a [Data Volta]
🏨 Hospedagem: [Hotel]
💰 Investimento: R$ [Valor]

Clique no link abaixo para ver a proposta completa:
[Link da proposta]

Fico no aguardo do seu retorno! 😊

[Assinatura do Consultor]
```

### Como Customizar (Futuro)

Para editar a mensagem, modifique em `pdfService.ts`:

```typescript
// Função: generateWhatsAppShareLink

const message = `
Olá! 👋

Tenho uma proposta especial de viagem para você! 🌍

📍 Destino: ${proposal.destination.name}
📅 Datas: ${formatDate(proposal.destination.checkIn)} a ${formatDate(proposal.destination.checkOut)}
🏨 Hospedagem: ${proposal.accommodation.name}
💰 Investimento: ${formatCurrency(proposal.investment.price)}

Fico no aguardo do seu retorno! 😊
`;
```

## Tratamento de Erros

### Erro: PDF Não Gera

```typescript
const handleExportWithErrorHandling = async () => {
  try {
    await downloadProposalPDF(proposal);
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('html2canvas')) {
        alert('Erro ao processar imagens. Tente qualidade Draft.');
      } else if (error.message.includes('jsPDF')) {
        alert('Erro ao criar PDF. Recarregue a página.');
      } else {
        alert(`Erro: ${error.message}`);
      }
    }
  }
};
```

### Erro: WhatsApp Não Abre

```typescript
const handleWhatsAppWithFallback = (phone?: string) => {
  try {
    shareViaWhatsApp(proposal, phone);
  } catch (error) {
    console.error('Erro ao abrir WhatsApp:', error);
    
    // Fallback: Gerar link e copiar para clipboard
    const link = generateWhatsAppShareLink(proposal, phone);
    navigator.clipboard.writeText(link);
    
    alert('Link copiado! Cole em seu navegador ou WhatsApp Web.');
  }
};
```

## Performance - Otimizações

### Download Múltiplos PDFs

```typescript
const handleBulkExport = async (proposals: TravelProposal[]) => {
  for (const proposal of proposals) {
    try {
      // Gerar com qualidade reduzida para velocidade
      await downloadProposalPDF(proposal, {
        quality: 'standard', // Mais rápido
        includeWatermark: false // Sem processamento extra
      });
      
      // Aguardar 2 segundos entre downloads
      await new Promise(r => setTimeout(r, 2000));
    } catch (error) {
      console.error(`Erro em ${proposal.destination.name}:`, error);
      continue;
    }
  }
};
```

## Integração com Seu Backend

### Salvar Proposta + PDF

```typescript
const handleSaveProposalWithPDF = async () => {
  try {
    // 1. Gerar PDF
    const pdfBlob = await generateProposalPDF(proposal, {
      quality: 'high'
    });
    
    // 2. Salvar proposta no DB
    const response = await fetch('/api/proposals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(proposal)
    });
    
    const { id } = await response.json();
    
    // 3. Salvar PDF no storage
    const formData = new FormData();
    formData.append('proposal_id', id);
    formData.append('pdf', pdfBlob);
    
    await fetch('/api/proposals/upload-pdf', {
      method: 'POST',
      body: formData
    });
    
    alert('Proposta salva com sucesso!');
  } catch (error) {
    console.error('Erro:', error);
    alert('Erro ao salvar proposta');
  }
};
```

## Monitoramento & Analytics

### Rastrear Ações

```typescript
const trackEvent = (eventName: string, data?: any) => {
  // Integrar com Google Analytics, Mixpanel, etc.
  window.gtag?.('event', eventName, data);
};

const handleTrackingExport = async () => {
  // Antes
  trackEvent('pdf_export_started', {
    destination: proposal.destination.name,
    quality: 'high'
  });
  
  try {
    await downloadProposalPDF(proposal, { quality: 'high' });
    
    // Depois
    trackEvent('pdf_export_completed', {
      destination: proposal.destination.name,
      timestamp: new Date()
    });
  } catch (error) {
    trackEvent('pdf_export_error', {
      destination: proposal.destination.name,
      error: error?.message
    });
  }
};
```

## Dicas & Truques

### 1️⃣ Teste Local Antes de Enviar

```typescript
// Teste a qualidade do PDF em draft
const testPDF = async () => {
  const draft = await generateProposalPDF(proposal, {
    quality: 'draft'
  });
  
  // Abrir em nova aba para revisar
  const url = URL.createObjectURL(draft);
  window.open(url, '_blank');
};
```

### 2️⃣ Medir Tempo de Geração

```typescript
const measurePDFGeneration = async () => {
  const start = performance.now();
  
  await downloadProposalPDF(proposal, {
    quality: 'high'
  });
  
  const end = performance.now();
  console.log(`PDF gerado em ${(end - start).toFixed(0)}ms`);
};
```

### 3️⃣ Validar Número Antes de WhatsApp

```typescript
const isValidWhatsAppNumber = (phone: string) => {
  // Remove espaços e caracteres especiais
  const cleaned = phone.replace(/\\D/g, '');
  
  // Deve ter 11+ dígitos (código país + número)
  return cleaned.length >= 10;
};

const handleValidatedWhatsApp = (phone: string) => {
  if (!isValidWhatsAppNumber(phone)) {
    alert('Número inválido. Use formato: 55 11 98765-4321');
    return;
  }
  
  shareViaWhatsApp(proposal, phone);
};
```

---

**Todos esses exemplos estão prontos para usar!** 🚀

Copie e adapte conforme sua necessidade.
