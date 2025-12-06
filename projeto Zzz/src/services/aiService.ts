/**
 * Serviço de IA para gerar descrições automáticas de destinos
 * Usa a API Pollinations AI (gratuita, sem API key)
 */

const POLLINATIONS_API = 'https://text.pollinations.ai';

interface AIGeneratedContent {
  description: string;
  highlights?: string[];
  bestTimeToVisit?: string;
}

/**
 * Gera uma descrição turística para um destino
 */
export async function generateDestinationDescription(destination: string): Promise<string> {
  const prompt = encodeURIComponent(
    `Escreva uma descrição turística curta e envolvente (máximo 3 frases) sobre ${destination}. 
    Destaque o que torna este destino especial para viajantes.
    Responda apenas com a descrição, sem títulos ou formatação.
    Responda em português brasileiro.`
  );

  try {
    const response = await fetch(`${POLLINATIONS_API}/${prompt}`, {
      method: 'GET',
      headers: {
        'Accept': 'text/plain',
      },
    });

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status}`);
    }

    const text = await response.text();
    return text.trim();
  } catch (error) {
    console.error('Erro ao gerar descrição:', error);
    throw error;
  }
}

/**
 * Gera sugestões de experiências para um destino
 */
export async function generateExperienceSuggestions(destination: string): Promise<string[]> {
  const prompt = encodeURIComponent(
    `Liste 5 experiências turísticas imperdíveis em ${destination}.
    Formato: uma experiência por linha, começando com um emoji relevante.
    Sem numeração, apenas o emoji e a experiência.
    Responda em português brasileiro.`
  );

  try {
    const response = await fetch(`${POLLINATIONS_API}/${prompt}`, {
      method: 'GET',
      headers: {
        'Accept': 'text/plain',
      },
    });

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status}`);
    }

    const text = await response.text();
    const lines = text.trim().split('\n').filter(line => line.trim());
    return lines.slice(0, 5); // Garantir máximo 5 itens
  } catch (error) {
    console.error('Erro ao gerar experiências:', error);
    throw error;
  }
}

/**
 * Gera conteúdo completo para um destino (descrição + experiências)
 */
export async function generateFullDestinationContent(destination: string): Promise<AIGeneratedContent> {
  const prompt = encodeURIComponent(
    `Gere conteúdo turístico sobre ${destination} no seguinte formato JSON:
    {
      "description": "descrição turística envolvente de 2-3 frases",
      "highlights": ["atração 1", "atração 2", "atração 3"],
      "bestTimeToVisit": "melhor época para visitar"
    }
    Responda APENAS com o JSON válido, sem markdown ou texto adicional.
    Em português brasileiro.`
  );

  try {
    const response = await fetch(`${POLLINATIONS_API}/${prompt}`, {
      method: 'GET',
      headers: {
        'Accept': 'text/plain',
      },
    });

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status}`);
    }

    const text = await response.text();
    
    // Tentar extrair JSON da resposta
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    // Fallback se não conseguir parsear
    return {
      description: text.trim(),
      highlights: [],
      bestTimeToVisit: '',
    };
  } catch (error) {
    console.error('Erro ao gerar conteúdo:', error);
    throw error;
  }
}

export default {
  generateDestinationDescription,
  generateExperienceSuggestions,
  generateFullDestinationContent,
};
