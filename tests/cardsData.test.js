import assert from 'node:assert/strict';
import test from 'node:test';
import { createServer } from 'vite';

test('planned loss product exposes only the abcd program screenshot', async () => {
  const vite = await createServer({ server: { middlewareMode: true } });

  try {
    const { getCardsData } = await vite.ssrLoadModule('/src/cardsData.js');
    const t = {
      cards: {
        solutions: Array.from({ length: 9 }, (_, index) => ({ text: `solution-${index}` })),
        products: [{ text: 'planned-loss' }, { text: '3d-mine' }],
      },
    };

    const { productsCardsData } = getCardsData(t);

    assert.deepEqual(productsCardsData[0].images, ['/src/assets/abcd.jpg']);
  } finally {
    await vite.close();
  }
});
