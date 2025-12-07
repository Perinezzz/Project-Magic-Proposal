import { TravelProposal, formatCurrency, formatDate } from '../types';

/**
 * Serviço para gerar PDFs profissionais de propostas de viagem
 * Usa jsPDF e html2canvas para renderização de alta qualidade
 */

export interface PDFGenerationOptions {
  fileName?: string;
  includeWatermark?: boolean;
  quality?: 'draft' | 'standard' | 'high';
}

/**
 * Gera um PDF profissional da proposta
 */
export async function generateProposalPDF(
  proposal: TravelProposal,
  options: PDFGenerationOptions = {}
): Promise<Blob> {
  const { fileName = 'proposta-viagem', includeWatermark = true, quality = 'high' } = options;

  // Lazy load para evitar aumentar bundle
  const { jsPDF } = await import('jspdf');
  const html2canvas = (await import('html2canvas')).default;

  // Criar elemento HTML para renderizar
  const element = createPDFContent(proposal);
  document.body.appendChild(element);

  try {
    // Renderizar HTML para canvas
    const canvas = await html2canvas(element, {
      scale: quality === 'high' ? 2 : quality === 'standard' ? 1.5 : 1,
      logging: false,
      backgroundColor: '#ffffff',
      useCORS: true,
    });

    // Configurar PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - margin * 2;

    // Calcular altura da imagem
    const imgHeight = (canvas.height * contentWidth) / canvas.width;
    let yPosition = margin;

    // Converter canvas para imagem
    const imgData = canvas.toDataURL('image/png');

    // Adicionar imagem em múltiplas páginas se necessário
    let remainingHeight = imgHeight;

    while (remainingHeight > 0) {
      const availableHeight = pageHeight - margin * 2;
      const heightToAdd = Math.min(remainingHeight, availableHeight);

      // Calcular crop da imagem
      const cropStartY = (imgHeight - remainingHeight) * (canvas.height / imgHeight);
      const cropHeight = heightToAdd * (canvas.height / imgHeight);

      // Criar canvas temporário para crop
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = cropHeight;
      const tempCtx = tempCanvas.getContext('2d');
      if (tempCtx) {
        tempCtx.drawImage(canvas, 0, -cropStartY, canvas.width, canvas.height);
        const croppedImgData = tempCanvas.toDataURL('image/png');
        pdf.addImage(croppedImgData, 'PNG', margin, yPosition, contentWidth, heightToAdd);
      }

      remainingHeight -= heightToAdd;
      yPosition = margin;

      if (remainingHeight > 0) {
        pdf.addPage();
      }
    }

    // Adicionar watermark se solicitado
    if (includeWatermark) {
      addWatermark(pdf);
    }

    // Adicionar metadados
    pdf.setProperties({
      title: `Proposta de Viagem - ${proposal.destination.name}`,
      subject: `Proposta de ${proposal.agency.name}`,
      author: proposal.agency.name,
      keywords: 'viagem, proposta, turismo',
      creator: 'Magic Proposal Generator',
    });

    // Retornar como Blob
    return pdf.output('blob') as Blob;
  } finally {
    document.body.removeChild(element);
  }
}

/**
 * Cria o HTML da proposta para renderização em PDF
 */
function createPDFContent(proposal: TravelProposal): HTMLElement {
  const container = document.createElement('div');
  container.style.width = '210mm';
  container.style.padding = '20mm';
  container.style.fontFamily = 'Arial, sans-serif';
  container.style.lineHeight = '1.6';
  container.style.color = '#333';
  container.style.backgroundColor = '#fff';

  container.innerHTML = `
    <style>
      body { margin: 0; padding: 0; }
      .pdf-container {
        width: 100%;
        max-width: 210mm;
        background: white;
        padding: 20mm;
        box-sizing: border-box;
      }
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
        padding-bottom: 20px;
        border-bottom: 3px solid #0052cc;
      }
      .logo-section {
        flex: 1;
      }
      .logo-section img {
        max-width: 150px;
        max-height: 80px;
      }
      .logo-section h1 {
        margin: 10px 0 5px 0;
        font-size: 24px;
        color: #0052cc;
      }
      .logo-section p {
        margin: 0;
        font-size: 12px;
        color: #666;
      }
      .title-section {
        flex: 1;
        text-align: right;
      }
      .title-section h2 {
        margin: 0;
        font-size: 20px;
        color: #1a2332;
      }
      .title-section p {
        margin: 5px 0 0 0;
        font-size: 12px;
        color: #999;
      }
      
      .section {
        margin-bottom: 25px;
        page-break-inside: avoid;
      }
      .section-title {
        font-size: 16px;
        font-weight: bold;
        color: #0052cc;
        margin-bottom: 15px;
        padding-bottom: 8px;
        border-bottom: 2px solid #ffc107;
      }
      
      .two-columns {
        display: flex;
        gap: 20px;
      }
      .column {
        flex: 1;
      }
      
      .info-item {
        margin-bottom: 12px;
        font-size: 13px;
      }
      .info-label {
        font-weight: bold;
        color: #0052cc;
        margin-bottom: 3px;
      }
      .info-value {
        color: #333;
      }
      
      .destination-image {
        width: 100%;
        max-height: 200px;
        object-fit: cover;
        border-radius: 8px;
        margin-bottom: 15px;
      }
      
      .table {
        width: 100%;
        border-collapse: collapse;
        font-size: 12px;
        margin-top: 10px;
      }
      .table th {
        background-color: #0052cc;
        color: white;
        padding: 10px;
        text-align: left;
        font-weight: bold;
      }
      .table td {
        padding: 10px;
        border-bottom: 1px solid #eee;
      }
      .table tr:nth-child(even) {
        background-color: #f9f9f9;
      }
      
      .highlight-box {
        background-color: #f0f4f8;
        padding: 15px;
        border-left: 4px solid #ffc107;
        margin: 15px 0;
        border-radius: 4px;
      }
      
      .footer {
        margin-top: 30px;
        padding-top: 20px;
        border-top: 2px solid #eee;
        font-size: 11px;
        color: #999;
        text-align: center;
      }
      
      .consultant-box {
        background-color: #f5f1ff;
        padding: 15px;
        border-radius: 8px;
        margin-top: 15px;
      }
      
      .price-highlight {
        font-size: 18px;
        font-weight: bold;
        color: #0052cc;
        background-color: #f0f4f8;
        padding: 10px 15px;
        border-radius: 6px;
        display: inline-block;
        margin: 10px 0;
      }
    </style>

    <div class="pdf-container">
      <!-- HEADER -->
      <div class="header">
        <div class="logo-section">
          ${proposal.agency.logo ? `<img src="${proposal.agency.logo}" alt="Logo">` : ''}
          <h1>${proposal.agency.name}</h1>
          ${proposal.agency.slogan ? `<p>${proposal.agency.slogan}</p>` : ''}
        </div>
        <div class="title-section">
          <h2>Proposta de Viagem</h2>
          <p>Criada em ${formatDate(proposal.createdAt)}</p>
        </div>
      </div>

      <!-- SEÇÃO DESTINO -->
      <div class="section">
        <div class="section-title">🌍 Destino</div>
        ${proposal.destination.heroImage ? `<img src="${proposal.destination.heroImage}" alt="${proposal.destination.name}" class="destination-image">` : ''}
        <div class="info-item">
          <div class="info-label">Local</div>
          <div class="info-value">${proposal.destination.name}</div>
        </div>
        ${proposal.about.description ? `
          <div class="info-item">
            <div class="info-label">Descrição</div>
            <div class="info-value">${proposal.about.description}</div>
          </div>
        ` : ''}
      </div>

      <!-- SEÇÃO CLIMA -->
      ${proposal.about.climate ? `
        <div class="section">
          <div class="section-title">🌤️ Clima e Melhor Época</div>
          <div class="two-columns">
            <div class="column">
              <div class="info-item">
                <div class="info-label">Clima</div>
                <div class="info-value">${proposal.about.climate}</div>
              </div>
            </div>
            <div class="column">
              <div class="info-item">
                <div class="info-label">Melhor Época</div>
                <div class="info-value">${proposal.about.bestSeason}</div>
              </div>
            </div>
          </div>
        </div>
      ` : ''}

      <!-- SEÇÃO VOOS -->
      ${proposal.flights.outbound ? `
        <div class="section">
          <div class="section-title">✈️ Voos</div>
          <div class="two-columns">
            <div class="column">
              <div class="info-item">
                <div class="info-label">Ida</div>
                <div class="info-value">${proposal.flights.outbound}</div>
              </div>
            </div>
            <div class="column">
              <div class="info-item">
                <div class="info-label">Volta</div>
                <div class="info-value">${proposal.flights.return || 'Não informado'}</div>
              </div>
            </div>
          </div>
        </div>
      ` : ''}

      <!-- SEÇÃO HOSPEDAGEM -->
      ${proposal.accommodation.hotel ? `
        <div class="section">
          <div class="section-title">🏨 Hospedagem</div>
          <div class="two-columns">
            <div class="column">
              <div class="info-item">
                <div class="info-label">Hotel</div>
                <div class="info-value">${proposal.accommodation.hotel}</div>
              </div>
            </div>
            <div class="column">
              <div class="info-item">
                <div class="info-label">Categoria</div>
                <div class="info-value">${proposal.accommodation.stars || 'Não informado'} ⭐</div>
              </div>
            </div>
          </div>
        </div>
      ` : ''}

      <!-- SEÇÃO INCLUSÕES -->
      ${proposal.inclusions.length > 0 ? `
        <div class="section">
          <div class="section-title">📦 Incluído no Pacote</div>
          <table class="table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Descrição</th>
              </tr>
            </thead>
            <tbody>
              ${proposal.inclusions.map(inc => `
                <tr>
                  <td>${inc.icon} ${inc.name}</td>
                  <td>${inc.description}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      ` : ''}

      <!-- SEÇÃO EXPERIÊNCIAS -->
      ${proposal.experiences.length > 0 ? `
        <div class="section">
          <div class="section-title">🎭 Experiências</div>
          ${proposal.experiences.map(exp => `
            <div class="highlight-box">
              <div class="info-item">
                <div class="info-label">${exp.title}</div>
                <div class="info-value">${exp.description}</div>
              </div>
              <div style="font-size: 12px; color: #666; margin-top: 8px;">
                Duração: ${exp.duration} | Preço: ${exp.price}
              </div>
            </div>
          `).join('')}
        </div>
      ` : ''}

      <!-- SEÇÃO INVESTIMENTO -->
      ${proposal.investment.price ? `
        <div class="section">
          <div class="section-title">💰 Investimento</div>
          <div class="price-highlight">
            ${formatCurrency(proposal.investment.price)} por pessoa
          </div>
          ${proposal.investment.description ? `
            <div class="info-item">
              <div class="info-label">Observações</div>
              <div class="info-value">${proposal.investment.description}</div>
            </div>
          ` : ''}
        </div>
      ` : ''}

      <!-- SEÇÃO CONSULTOR -->
      ${proposal.consultant.name ? `
        <div class="section">
          <div class="section-title">👤 Consultor Responsável</div>
          <div class="consultant-box">
            <div class="info-item">
              <div class="info-label">Nome</div>
              <div class="info-value">${proposal.consultant.name}</div>
            </div>
            ${proposal.consultant.email ? `
              <div class="info-item">
                <div class="info-label">Email</div>
                <div class="info-value">${proposal.consultant.email}</div>
              </div>
            ` : ''}
            ${proposal.consultant.phone ? `
              <div class="info-item">
                <div class="info-label">Telefone</div>
                <div class="info-value">${proposal.consultant.phone}</div>
              </div>
            ` : ''}
          </div>
        </div>
      ` : ''}

      <!-- RODAPÉ -->
      <div class="footer">
        <p>Proposta gerada pelo Magic Proposal Generator | Todos os direitos reservados © ${new Date().getFullYear()}</p>
      </div>
    </div>
  `;

  return container;
}

/**
 * Adiciona watermark ao PDF
 */
function addWatermark(pdf: any): void {
  const pageCount = pdf.internal.pages.length - 1;

  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setTextColor(200, 200, 200);
    pdf.setFontSize(60);
    pdf.text('PROPOSTA', 105, 140, {
      align: 'center',
      angle: -45,
      opacity: 0.1,
    });
  }
}

/**
 * Faz download do PDF
 */
export async function downloadProposalPDF(
  proposal: TravelProposal,
  options: PDFGenerationOptions = {}
): Promise<void> {
  try {
    const blob = await generateProposalPDF(proposal, options);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${options.fileName || 'proposta-viagem'}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Erro ao fazer download do PDF:', error);
    throw error;
  }
}

/**
 * Gera URL para compartilhamento no WhatsApp
 */
export function generateWhatsAppShareLink(
  proposal: TravelProposal,
  recipientPhone?: string
): string {
  const message = encodeURIComponent(
    `Olá! 👋\n\nTenho uma proposta especial de viagem para você!\n\n` +
      `📍 Destino: ${proposal.destination.name}\n` +
      `💰 Investimento: ${formatCurrency(proposal.investment.price || 0)} por pessoa\n` +
      `🏨 Hotel: ${proposal.accommodation.hotel || 'Confirmando...'}\n\n` +
      `Clique aqui para visualizar a proposta completa:\n` +
      `[Link da proposta]\n\n` +
      `Agência: ${proposal.agency.name}\n` +
      `${proposal.consultant.phone ? `Consultor: ${proposal.consultant.phone}` : ''}`
  );

  if (recipientPhone) {
    // Para número específico
    return `https://wa.me/${recipientPhone}?text=${message}`;
  } else {
    // Para compartilhamento genérico
    return `https://wa.me/?text=${message}`;
  }
}

/**
 * Compartilha a proposta via WhatsApp Web
 */
export function shareViaWhatsApp(
  proposal: TravelProposal,
  recipientPhone?: string
): void {
  const link = generateWhatsAppShareLink(proposal, recipientPhone);
  window.open(link, '_blank');
}
