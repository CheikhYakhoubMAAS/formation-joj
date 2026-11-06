import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createTestApp } from './create-test-app';

// Prouve que /api/disciplines/par-categorie compte les disciplines des cinq catégories,
// dans l'ordre de la liste fermée, y compris celles qui n'en ont aucune (0).
describe('/api/disciplines/par-categorie (e2e)', () => {
  let app: INestApplication;
  const api = () => request(app.getHttpServer());

  // Une base neuve par test : les comptes sont exacts.
  beforeEach(async () => {
    app = await createTestApp();
  });

  afterEach(() => app?.close());

  it('answers 0 for each of the five categories when there is no discipline', async () => {
    const response = await api().get('/api/disciplines/par-categorie').expect(200);

    expect(response.body).toEqual([
      { category: 'athletisme', count: 0 },
      { category: 'sports-collectifs', count: 0 },
      { category: 'sports-de-combat', count: 0 },
      { category: 'sports-nautiques', count: 0 },
      { category: 'sports-de-precision', count: 0 },
    ]);
  });

  it('counts the disciplines of each category and keeps 0 for the empty ones', async () => {
    const create = (name: string, category: string) =>
      api().post('/api/disciplines').send({ name, category }).expect(201);
    await create('Athletisme', 'athletisme');
    await create('Marathon', 'athletisme');
    await create('Lutte', 'sports-de-combat');

    const response = await api().get('/api/disciplines/par-categorie').expect(200);

    expect(response.body).toEqual([
      { category: 'athletisme', count: 2 },
      { category: 'sports-collectifs', count: 0 },
      { category: 'sports-de-combat', count: 1 },
      { category: 'sports-nautiques', count: 0 },
      { category: 'sports-de-precision', count: 0 },
    ]);
  });
});
