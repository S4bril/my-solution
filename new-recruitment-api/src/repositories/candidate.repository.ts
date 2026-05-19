import { Database } from 'sqlite';
import {
  CandidateModel,
  CreateCandidateModel,
} from '../models/candidate.model';

export class CandidateRepository {
  constructor(private db: Database) {}

  private async getJobOfferIds(candidateId: number): Promise<number[]> {
    const rows = await this.db.all<{ job_offer_id: number }[]>(
      'SELECT job_offer_id FROM CandidateJobOffer WHERE candidate_id = ?',
      [candidateId]
    );
    return rows.map((row) => row.job_offer_id);
  }

  async getAll(offset?: number, limit?: number): Promise<CandidateModel[]> {
    let query = 'SELECT * FROM Candidate';
    const params: number[] = [];

    if (offset !== undefined && limit !== undefined) {
      query += ' LIMIT ? OFFSET ?';
      params.push(limit, offset);
    }

    const candidates = await this.db.all(query, params);

    return Promise.all(
      candidates.map(async (candidate) => ({
        ...candidate,
        job_offer_ids: await this.getJobOfferIds(candidate.id),
      }))
    );
  }

  async create(candidateData: CreateCandidateModel): Promise<CandidateModel> {
    await this.db.run('BEGIN TRANSACTION');
    try {
      const result = await this.db.run(
        `INSERT INTO Candidate (name, email, phone, years_of_experience, recruiter_notes, recruitment_status, consent_date)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          candidateData.name,
          candidateData.email,
          candidateData.phone ?? null,
          candidateData.years_of_experience ?? null,
          candidateData.recruiter_notes ?? null,
          candidateData.recruitment_status ?? 'new',
          candidateData.consent_date,
        ]
      );

      const candidateId = result.lastID!;

      for (const jobOfferId of candidateData.job_offer_ids) {
        await this.db.run(
          'INSERT INTO CandidateJobOffer (candidate_id, job_offer_id) VALUES (?, ?)',
          [candidateId, jobOfferId]
        );
      }

      await this.db.run('COMMIT');

      const candidate = await this.db.get(
        'SELECT * FROM Candidate WHERE id = ?',
        [candidateId]
      );
      return { ...candidate, job_offer_ids: candidateData.job_offer_ids };
    } catch (error) {
      await this.db.run('ROLLBACK');
      throw error;
    }
  }
}
