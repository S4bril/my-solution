import { Request, Response, Router } from 'express';
import { CandidateRepository } from '../repositories/candidate.repository';
import { CreateCandidateModel } from '../models/candidate.model';

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
    try {
      const {
        name,
        surname,
        email,
        phone,
        years_of_experience,
        recruiter_notes,
        recruitment_status,
        consent_date,
        job_offer_ids,
      }: CreateCandidateModel = req.body;

      if (!name || !surname || !email || !consent_date) {
        res
          .status(400)
          .json({
            error: 'name, surname, email and consent_date are required',
          });
        return;
      }

      if (!Array.isArray(job_offer_ids) || job_offer_ids.length === 0) {
        res
          .status(400)
          .json({ error: 'At least one job_offer_id is required' });
        return;
      }

      const candidate = await this.candidatesRepository.create({
        name,
        surname,
        email,
        phone,
        years_of_experience,
        recruiter_notes,
        recruitment_status,
        consent_date,
        job_offer_ids,
      });

      res.status(201).json(candidate);
    } catch (error: any) {
      if (
        error?.message?.includes('UNIQUE constraint failed: Candidate.email')
      ) {
        res
          .status(409)
          .json({ error: 'A candidate with this email already exists' });
        return;
      }
      if (error?.message?.includes('FOREIGN KEY constraint failed')) {
        res
          .status(400)
          .json({ error: 'One or more job_offer_ids do not exist' });
        return;
      }
      console.error('Error creating candidate:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
