import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

const SYSTEM_PROMPT = `Eres un sumiller de clase mundial y experto en vinos con conocimiento enciclopédico de vinos de todas las regiones del mundo.
Cuando se te proporcione el nombre de un vino, debes devolver información completa y precisa en formato JSON.
Incluye puntuaciones reales de publicaciones reconocidas cuando las conozcas: Wine Spectator, Wine Advocate (Robert Parker/Luis Gutiérrez),
Decanter, Guía Peñín, Wine Enthusiast, James Suckling, Falstaff, entre otras.
Siempre devuelve JSON válido sin texto adicional fuera del objeto JSON.`;

export async function getWineInfo(wineName) {
  const response = await client.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 4096,
    thinking: { type: 'adaptive' },
    system: SYSTEM_PROMPT,
    messages: [{
      role: 'user',
      content: `Proporciona información completa sobre el vino: "${wineName}"

Devuelve exactamente este JSON (sin texto adicional):
{
  "found": true,
  "name": "nombre completo del vino",
  "winery": "nombre de la bodega/productor",
  "region": "denominación de origen o región específica",
  "subregion": "subregión si aplica",
  "country": "país de origen",
  "grapes": ["variedad 1", "variedad 2"],
  "style": "Tinto/Blanco/Rosado/Espumoso/Dulce/Generoso",
  "alcohol": "graduación alcohólica típica ej: 14.5%",
  "description": "descripción general del vino en 2-3 frases",
  "tasting_notes": {
    "visual": "descripción del color y aspecto visual",
    "nose": "aromas y bouquet detallado",
    "palate": "sabor, cuerpo, acidez, taninos, estructura",
    "finish": "final, persistencia e impresiones finales"
  },
  "serving_temp": "temperatura de servicio recomendada ej: 16-18°C",
  "decanting": "si necesita decantación y cuánto tiempo",
  "aging_potential": "potencial de guarda en años",
  "food_pairing": ["maridaje 1", "maridaje 2", "maridaje 3", "maridaje 4"],
  "scores": [
    {
      "vintage": 2020,
      "publication": "Wine Advocate",
      "score": 95,
      "reviewer": "nombre del crítico",
      "notes": "breve nota de cata del crítico"
    }
  ],
  "best_vintages": ["año1", "año2", "año3"],
  "price_range_eur": "rango de precio aproximado en euros ej: 15-25€",
  "production": "producción anual aproximada si se conoce"
}

Si el vino no existe o no tienes información suficiente, devuelve:
{
  "found": false,
  "message": "No se encontró información sobre este vino. Comprueba el nombre e inténtalo de nuevo."
}

Incluye puntuaciones para múltiples añadas y múltiples publicaciones cuando las conozcas.
Para vinos españoles incluye siempre la puntuación de la Guía Peñín si está disponible.`
    }]
  });

  const textBlock = response.content.find(b => b.type === 'text');
  if (!textBlock) {
    throw new Error('No se recibió respuesta del servicio');
  }

  const jsonMatch = textBlock.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Error al procesar la información del vino');
  }

  return JSON.parse(jsonMatch[0]);
}
