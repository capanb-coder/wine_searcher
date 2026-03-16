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
    console.error('Search error:', error);
    res.status(500).json({ error: 'Error al buscar el vino. Por favor, inténtalo de nuevo.' });
  }
});

export { router as wineRouter };
