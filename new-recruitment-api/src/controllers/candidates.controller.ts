import { Request, Response, Router } from 'express';
import { CandidateRepository } from '../repositories/candidate.repository';

export class CandidatesController {
  readonly router = Router();

  constructor(private readonly candidatesRepository: CandidateRepository) {
    this.router.get('/candidates', this.getAll.bind(this));
    this.router.post('/candidates', this.create.bind(this));
  }

  async getAll(req: Request, res: Response) {
    try {
      const { offset, limit } = req.query;

      const offsetNumber = offset ? parseInt(offset as string, 10) : undefined;
      const limitNumber = limit ? parseInt(limit as string, 10) : undefined;

      const candidates = await this.candidatesRepository.getAll(
        offsetNumber,
        limitNumber
      );
      res.json(candidates);
    } catch (error) {
      console.error('Error fetching candidates:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async create(req: Request, res: Response) {
    res.json({});
  }
}
