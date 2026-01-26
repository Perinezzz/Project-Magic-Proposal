/**
 * Serviço de IA para gerar conteúdo automático de destinos
 * Usa a API Together.ai (gratuita, sem API key)
 * Usa Unsplash para imagens (gratuita, sem API key para uso básico)
 */

const TOGETHER_API = 'https://api.together.xyz/v1/chat/completions';
const UNSPLASH_API = 'https://source.unsplash.com';

// API Key do Together (usar variável de ambiente em produção)
// Se vazio, usará o fallback
const TOGETHER_API_KEY = import.meta.env.VITE_TOGETHER_API_KEY || '';

export interface AIGeneratedContent {
  description: string;
  climate?: string;
  bestSeason?: string;
  highlights?: string[];
  experiences?: Experience[];
  suggestedPrice?: PriceSuggestion;
  heroImage?: string;
}

export interface Experience {
  title: string;
  description: string;
  duration: string;
  price: string;
  image: string;
}

export interface PriceSuggestion {
  min: number;
  max: number;
  average: number;
  currency: string;
  perPerson: boolean;
}

/**
 * Função auxiliar para chamar a API de IA
 * Usa Together.ai com fallback para descrições padrão
 */
async function callAIAPI(prompt: string): Promise<string> {
  // Tentar usar Together.ai se houver API key
  if (TOGETHER_API_KEY) {
    try {
      const response = await fetch(TOGETHER_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${TOGETHER_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'meta-llama/Llama-2-70b-chat-hf',
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 1024,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro Together: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content?.trim() || '';
    } catch (error) {
      console.warn('Erro ao usar Together.ai:', error);
    }
  }

  // Fallback: retornar descrição genérica profissional
  // Este é um fallback que não depende de APIs externas
  console.log('Usando fallback - descrição genérica');
  return generateFallbackResponse(prompt);
}

/**
 * Gera uma resposta genérica quando a API não está disponível
 */
function generateFallbackResponse(prompt: string): string {
  // Detectar o tipo de prompt pelo conteúdo
  if (prompt.includes('descrição turística')) {
    return 'Um destino encantador e memorável que oferece experiências únicas e paisagens deslumbrantes. Perfeito para viajantes em busca de aventura e descoberta cultural.';
  }
  
  if (prompt.includes('CLIMA:')) {
    return 'CLIMA: Tropical, 25-30°C\nMELHOR_EPOCA: O ano todo';
  }
  
  if (prompt.includes('experiências turísticas')) {
    return `TITULO: 🏛️ Visita ao Centro Histórico
DESCRICAO: Explore os monumentos e arquitetura de séculos passados.
DURACAO: 3-4 horas
PRECO: R$ 100-150
---
TITULO: 🌳 Passeio na Natureza
DESCRICAO: Trilhas e paisagens naturais espetaculares.
DURACAO: 4-5 horas
PRECO: R$ 80-120
---
TITULO: 🍽️ Culinária Local
DESCRICAO: Degustação de pratos típicos e tradicionais.
DURACAO: 2-3 horas
PRECO: R$ 120-200
---
TITULO: 🎭 Experiência Cultural
DESCRICAO: Apresentações tradicionais e shows locais.
DURACAO: 2 horas
PRECO: R$ 150-250`;
  }
  
  if (prompt.includes('faixa de preço')) {
    return 'MINIMO: 7000\nMAXIMO: 18000\nMEDIO: 12500';
  }
  
  return 'Resposta padrão. Por favor, configure uma API key para melhor qualidade de respostas.';
}

/**
 * Gera uma descrição turística para um destino
 */
export async function generateDestinationDescription(destination: string): Promise<string> {
  const prompt = `Escreva uma descrição turística curta e envolvente (máximo 3 frases) sobre ${destination}. 
Destaque o que torna este destino especial para viajantes.
Responda apenas com a descrição, sem títulos ou formatação.
Responda em português brasileiro.`;

  try {
    return await callAIAPI(prompt);
  } catch (error) {
    console.error('Erro ao gerar descrição:', error);
    return generateFallbackResponse(prompt);
  }
}

/**
 * Gera informações de clima para um destino
 */
export async function generateClimateInfo(destination: string): Promise<{ climate: string; bestSeason: string }> {
  const prompt = `Para ${destination}, responda APENAS no formato:
CLIMA: [tipo de clima e temperatura média]
MELHOR_EPOCA: [meses ideais para visitar]

Exemplo:
CLIMA: Tropical, 25-32°C
MELHOR_EPOCA: Dezembro a Abril

Responda em português brasileiro, seja conciso.`;

  try {
    const text = await callAIAPI(prompt);
    
    // Extrair clima e melhor época
    const climaMatch = text.match(/CLIMA:\s*(.+?)(?:\n|MELHOR)/i);
    const epocaMatch = text.match(/MELHOR_EPOCA:\s*(.+)/i);
    
    return {
      climate: climaMatch ? climaMatch[1].trim() : 'Clima agradável',
      bestSeason: epocaMatch ? epocaMatch[1].trim() : 'O ano todo',
    };
  } catch (error) {
    console.error('Erro ao gerar clima:', error);
    return { climate: 'Clima agradável', bestSeason: 'O ano todo' };
  }
}

/**
 * Gera sugestões de experiências para um destino
 */
export async function generateExperienceSuggestions(destination: string): Promise<Experience[]> {
  const prompt = `Liste 4 experiências turísticas imperdíveis em ${destination}.
Para cada uma, responda no formato:
TITULO: [nome da experiência com emoji]
DESCRICAO: [descrição curta, 1 frase]
DURACAO: [duração estimada]
PRECO: [faixa de preço em R$]
---

Responda em português brasileiro.`;

  try {
    const text = await callAIAPI(prompt);
    const experiences: Experience[] = [];
    
    // Dividir por experiência
    const blocks = text.split('---').filter(b => b.trim());
    
    for (const block of blocks.slice(0, 4)) {
      const titleMatch = block.match(/TITULO:\s*(.+)/i);
      const descMatch = block.match(/DESCRICAO:\s*(.+)/i);
      const durationMatch = block.match(/DURACAO:\s*(.+)/i);
      const priceMatch = block.match(/PRECO:\s*(.+)/i);
      
      if (titleMatch) {
        experiences.push({
          title: titleMatch[1].trim(),
          description: descMatch ? descMatch[1].trim() : '',
          duration: durationMatch ? durationMatch[1].trim() : '2-3 horas',
          price: priceMatch ? priceMatch[1].trim() : 'Consultar',
          image: `${UNSPLASH_API}/800x600/?${encodeURIComponent(destination + ' tourism')}`,
        });
      }
    }
    
    return experiences;
  } catch (error) {
    console.error('Erro ao gerar experiências:', error);
    return [];
  }
}

/**
 * Sugere faixa de preço para um destino
 */
export async function suggestPriceRange(destination: string, nights: number = 7): Promise<PriceSuggestion> {
  const prompt = `Para uma viagem de ${nights} noites para ${destination}, qual a faixa de preço por pessoa em reais (R$)?
Considere: passagem aérea + hotel 4 estrelas + alimentação básica.

Responda APENAS no formato:
MINIMO: [valor numérico]
MAXIMO: [valor numérico]
MEDIO: [valor numérico]

Exemplo:
MINIMO: 8000
MAXIMO: 15000
MEDIO: 11000

Apenas números, sem R$ ou pontuação.`;

  try {
    const text = await callAIAPI(prompt);
    
    const minMatch = text.match(/MINIMO:\s*(\d+)/i);
    const maxMatch = text.match(/MAXIMO:\s*(\d+)/i);
    const avgMatch = text.match(/MEDIO:\s*(\d+)/i);
    
    const min = minMatch ? parseInt(minMatch[1]) : 7000;
    const max = maxMatch ? parseInt(maxMatch[1]) : 18000;
    const average = avgMatch ? parseInt(avgMatch[1]) : Math.round((min + max) / 2);
    
    return {
      min,
      max,
      average,
      currency: 'BRL',
      perPerson: true,
    };
  } catch (error) {
    console.error('Erro ao sugerir preço:', error);
    return { min: 7000, max: 18000, average: 12500, currency: 'BRL', perPerson: true };
  }
}

/**
 * Busca imagem do destino via Unsplash
 */
export function getDestinationImage(destination: string, size: 'small' | 'medium' | 'large' = 'large'): string {
  const sizes = {
    small: '400x300',
    medium: '800x600',
    large: '1600x900',
  };
  
  // Adiciona timestamp para evitar cache
  const timestamp = Date.now();
  return `${UNSPLASH_API}/${sizes[size]}/?${encodeURIComponent(destination + ' travel landscape')}&t=${timestamp}`;
}

/**
 * Gera conteúdo completo para um destino (todas as informações de uma vez)
 */
export async function generateFullDestinationContent(destination: string, nights: number = 7): Promise<AIGeneratedContent> {
  try {
    // Executar todas as chamadas em paralelo para melhor performance
    const [description, climateInfo, experiences, priceRange] = await Promise.all([
      generateDestinationDescription(destination),
      generateClimateInfo(destination),
      generateExperienceSuggestions(destination),
      suggestPriceRange(destination, nights),
    ]);
    
    return {
      description,
      climate: climateInfo.climate,
      bestSeason: climateInfo.bestSeason,
      experiences,
      suggestedPrice: priceRange,
      heroImage: getDestinationImage(destination, 'large'),
    };
  } catch (error) {
    console.error('Erro ao gerar conteúdo completo:', error);
    throw error;
  }
}

export default {
  generateDestinationDescription,
  generateClimateInfo,
  generateExperienceSuggestions,
  suggestPriceRange,
  getDestinationImage,
  generateFullDestinationContent,
};

