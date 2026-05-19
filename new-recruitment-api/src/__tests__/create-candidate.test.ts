import request from 'supertest';
import { Application } from 'express';
import { Database } from 'sqlite';
import { setupApp } from '../app';
import { setupDb } from '../db';

describe('Create Candidate', () => {
  let app: Application;
  let db: Database;

  beforeAll(async () => {
    db = await setupDb();
    app = await setupApp(db);
  });

  afterAll(async () => {
    await db.close();
  });

  const validCandidate = {
    name: 'Jan',
    surname: 'Kowalski',
    email: 'jan.kowalski@example.com',
    phone: '123456789',
    years_of_experience: 3,
    consent_date: '2026-01-01',
    job_offer_ids: [1],
  };

  it('should create a candidate and return 201 with candidate data', async () => {
    const res = await request(app).post('/candidates').send(validCandidate);

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      name: validCandidate.name,
      surname: validCandidate.surname,
      email: validCandidate.email,
      job_offer_ids: validCandidate.job_offer_ids,
    });
    expect(res.body.id).toBeDefined();
  });

  it('should return 409 when email already exists', async () => {
    const res = await request(app)
      .post('/candidates')
      .send({ ...validCandidate, email: 'jan.kowalski@example.com' });

    expect(res.status).toBe(409);
    expect(res.body.error).toMatch(/already exists/i);
  });

  it('should return 400 when required fields are missing', async () => {
    const { name, ...withoutName } = validCandidate;

    const res = await request(app)
      .post('/candidates')
      .send({ ...withoutName, email: 'other@example.com' });

    expect(res.status).toBe(400);
  });

  it('should return 400 when job_offer_ids is empty', async () => {
    const res = await request(app)
      .post('/candidates')
      .send({
        ...validCandidate,
        email: 'other2@example.com',
        job_offer_ids: [],
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/job_offer_id/i);
  });

  it('should return 400 when job_offer_id does not exist', async () => {
    const res = await request(app)
      .post('/candidates')
      .send({
        ...validCandidate,
        email: 'other3@example.com',
        job_offer_ids: [99999],
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/job_offer_ids do not exist/i);
  });
});
