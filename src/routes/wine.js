import { Router } from 'express';
import { getWineInfo } from '../services/wineInfo.js';
import { getPrices } from '../services/priceScraper.js';

const router = Router();

router.get('/wine/search', async (req, res) => {
  const { q } = req.query;

  if (!q || !q.trim()) {
    return res.status(400).json({ error: 'Se requiere el nombre del vino' });
  }

  try {
    const [wineInfo, prices] = await Promise.all([
      getWineInfo(q.trim()),
      getPrices(q.trim())
    ]);

    res.json({ wineInfo, prices });
  } catch (error) {
    console.error('Search error:', error.message);
    if (error.status === 401 || error.message?.includes('authentication') || error.message?.includes('apiKey') || error.message?.includes('API key')) {
      return res.status(500).json({ error: 'API Key de Anthropic no configurada o inválida. Comprueba el archivo .env.' });
    }
    if (error.status === 429) {
      return res.status(500).json({ error: 'Límite de peticiones alcanzado. Espera un momento e inténtalo de nuevo.' });
    }
    res.status(500).json({ error: `Error: ${error.message || 'Inténtalo de nuevo.'}` });
  }
});

router.get('/health', (req, res) => {
  const keySet = !!process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY !== 'your_anthropic_api_key_here';
  res.json({
    status: keySet ? 'ok' : 'missing_api_key',
    message: keySet ? 'Configuración correcta' : 'Falta configurar ANTHROPIC_API_KEY en el archivo .env'
  });
});

export { router as wineRouter };
