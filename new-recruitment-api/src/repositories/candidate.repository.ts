import { Database } from 'sqlite';
import { CandidateModel } from '../models/candidate.model';

export class CandidateRepository {
  constructor(private db: Database) {}

  getAll(offset?: number, limit?: number): Promise<CandidateModel[]> {
    let query = 'SELECT * FROM Candidate';
    const params: any[] = [];

    if (offset !== undefined && limit !== undefined) {
      query += ' LIMIT ? OFFSET ?';
      params.push(limit, offset);
    }

    return this.db.all(query, params);
  }
}
