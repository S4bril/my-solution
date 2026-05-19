import express from 'express';
import { CandidatesController } from './controllers/candidates.controller';
import { CandidateRepository } from './repositories/candidate.repository';
import { Database } from 'sqlite';

export const setupApp = async (db: Database) => {
  const app = express();

  app.use(express.json());

  const candidatesRepository = new CandidateRepository(db);

  app.use(new CandidatesController(candidatesRepository).router);

  return app;
};
