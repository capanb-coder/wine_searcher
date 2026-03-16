import axios from 'axios';
import * as cheerio from 'cheerio';

const httpClient = axios.create({
  timeout: 12000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'Cache-Control': 'max-age=0'
  }
});

function extractPrice(text) {
  if (!text) return null;
  const match = text.replace(/\s/g, '').match(/(\d+[.,]\d{2})\s*€|€\s*(\d+[.,]\d{2})|(\d+[.,]\d{2})/);
  if (match) {
    const price = match[1] || match[2] || match[3];
    return price.replace(',', '.') + (text.includes('€') ? ' €' : ' €');
  }
  return null;
}

function extractJsonLd($) {
  const products = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const data = JSON.parse($(el).html());
      const items = Array.isArray(data) ? data : [data];
      items.forEach(item => {
        if (item['@type'] === 'Product' || item['@type'] === 'ItemList') {
          if (item['@type'] === 'Product') {
            const price = item.offers?.price || item.offers?.lowPrice;
            if (item.name && price) {
              products.push({
                name: item.name,
                price: `${price} €`,
                url: item.offers?.url || item.url || '',
                image: Array.isArray(item.image) ? item.image[0] : item.image
              });
            }
          }
        }
      });
    } catch (_) {}
  });
  return products;
}

async function scrapeLavinia(query) {
  const searchUrl = `https://www.lavinia.es/buscar?q=${encodeURIComponent(query)}&lang=es`;
  try {
    const { data } = await httpClient.get(searchUrl);
    const $ = cheerio.load(data);
    const products = [];

    // Try JSON-LD first
    const jsonLdProducts = extractJsonLd($);
    if (jsonLdProducts.length > 0) {
      return { store: 'Lavinia', products: jsonLdProducts.slice(0, 4), searchUrl, error: null, available: true };
    }

    // Try various selectors
    const selectors = [
      '.product-item', '.product-card', '.product-tile',
      '[data-product]', '.grid-item', '.wine-item',
      '.product', 'article.item'
    ];

    for (const selector of selectors) {
      $(selector).each((_, el) => {
        if (products.length >= 4) return false;
        const name = $(el).find('h2, h3, h4, .name, .title, .product-name').first().text().trim();
        const priceText = $(el).find('.price, .product-price, [data-price], .precio').first().text().trim();
        const price = extractPrice(priceText);
        const link = $(el).find('a[href]').first().attr('href');
        const img = $(el).find('img').first().attr('src') || $(el).find('img').first().attr('data-src');

        if (name && name.length > 3) {
          products.push({
            name: name.substring(0, 80),
            price: price || 'Ver precio',
            url: link ? (link.startsWith('http') ? link : `https://www.lavinia.es${link}`) : searchUrl,
            image: img
          });
        }
      });
      if (products.length > 0) break;
    }

    return { store: 'Lavinia', products, searchUrl, error: null, available: products.length > 0 };
  } catch (error) {
    return { store: 'Lavinia', products: [], searchUrl, error: null, available: false };
  }
}

async function scrapeBodeboca(query) {
  const searchUrl = `https://www.bodeboca.com/buscar?q=${encodeURIComponent(query)}`;
  try {
    const { data } = await httpClient.get(searchUrl);
    const $ = cheerio.load(data);
    const products = [];

    const jsonLdProducts = extractJsonLd($);
    if (jsonLdProducts.length > 0) {
      return { store: 'Bodeboca', products: jsonLdProducts.slice(0, 4), searchUrl, error: null, available: true };
    }

    const selectors = [
      '.product-item', '.product-card', '.wine-card',
      '.product-list-item', '[data-product-id]', '.product',
      '.item-product', '.search-result-item'
    ];

    for (const selector of selectors) {
      $(selector).each((_, el) => {
        if (products.length >= 4) return false;
        const name = $(el).find('h2, h3, h4, .name, .product-name, .wine-name, .title').first().text().trim();
        const priceText = $(el).find('.price, .product-price, .precio, .pvp, [data-price]').first().text().trim();
        const price = extractPrice(priceText);
        const link = $(el).find('a[href]').first().attr('href');
        const img = $(el).find('img').first().attr('src') || $(el).find('img').first().attr('data-src');

        if (name && name.length > 3) {
          products.push({
            name: name.substring(0, 80),
            price: price || 'Ver precio',
            url: link ? (link.startsWith('http') ? link : `https://www.bodeboca.com${link}`) : searchUrl,
            image: img
          });
        }
      });
      if (products.length > 0) break;
    }

    return { store: 'Bodeboca', products, searchUrl, error: null, available: products.length > 0 };
  } catch (error) {
    return { store: 'Bodeboca', products: [], searchUrl, error: null, available: false };
  }
}

async function scrapeDecantalo(query) {
  const searchUrl = `https://www.decantalo.com/es/buscar?q=${encodeURIComponent(query)}`;
  try {
    const { data } = await httpClient.get(searchUrl);
    const $ = cheerio.load(data);
    const products = [];

    const jsonLdProducts = extractJsonLd($);
    if (jsonLdProducts.length > 0) {
      return { store: 'Decantalo', products: jsonLdProducts.slice(0, 4), searchUrl, error: null, available: true };
    }

    const selectors = [
      '.product-item', '.product', '.wine-item',
      '.product-card', '[itemtype*="Product"]', '.product-miniature',
      '.ajax_block_product', '.product-container'
    ];

    for (const selector of selectors) {
      $(selector).each((_, el) => {
        if (products.length >= 4) return false;
        const name = $(el).find('h2, h3, h4, .product-title, .product-name, .name, span.name').first().text().trim();
        const priceText = $(el).find('.price, .product-price, .precio, [data-price], .regular-price, .current-price').first().text().trim();
        const price = extractPrice(priceText);
        const link = $(el).find('a[href]').first().attr('href');
        const img = $(el).find('img').first().attr('src') || $(el).find('img').first().attr('data-src');

        if (name && name.length > 3) {
          products.push({
            name: name.substring(0, 80),
            price: price || 'Ver precio',
            url: link ? (link.startsWith('http') ? link : `https://www.decantalo.com${link}`) : searchUrl,
            image: img
          });
        }
      });
      if (products.length > 0) break;
    }

    return { store: 'Decantalo', products, searchUrl, error: null, available: products.length > 0 };
  } catch (error) {
    return { store: 'Decantalo', products: [], searchUrl, error: null, available: false };
  }
}

export async function getPrices(wineName) {
  const results = await Promise.allSettled([
    scrapeLavinia(wineName),
    scrapeBodeboca(wineName),
    scrapeDecantalo(wineName)
  ]);

  return results.map(r =>
    r.status === 'fulfilled'
      ? r.value
      : { store: 'Unknown', products: [], searchUrl: '#', error: r.reason?.message || 'Error', available: false }
  );
}
