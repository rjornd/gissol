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

test('solution groups receive sequential numbers in their rendered order', async () => {
  const vite = await createServer({ server: { middlewareMode: true } });

  try {
    const { getNumberedSolutionGroups } = await vite.ssrLoadModule('/src/cardsData.js');
    const cards = Array.from({ length: 9 }, (_, index) => ({ text: `card-${index + 1}` }));
    const groups = [
      { title: 'group-1', cardIndexes: [0, 1] },
      { title: 'group-2', cardIndexes: [3, 6] },
      { title: 'group-3', cardIndexes: [4, 7] },
      { title: 'group-4', cardIndexes: [2, 5, 8] },
    ];

    assert.equal(typeof getNumberedSolutionGroups, 'function');

    const numberedGroups = getNumberedSolutionGroups(cards, groups);

    assert.deepEqual(
      numberedGroups.flatMap((group) => group.cards.map((entry) => entry.number)),
      [1, 2, 3, 4, 5, 6, 7, 8, 9],
    );
    assert.deepEqual(
      numberedGroups.flatMap((group) => group.cards.map((entry) => entry.card.text)),
      ['card-1', 'card-2', 'card-4', 'card-7', 'card-5', 'card-8', 'card-3', 'card-6', 'card-9'],
    );
  } finally {
    await vite.close();
  }
});
