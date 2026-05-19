import { CandidateRepository } from '../repositories/candidate.repository';

export class LegacySyncService {
  constructor(
    private readonly legacyApiUrl: string,
    private readonly legacyApiKey: string,
    private readonly candidateRepository: CandidateRepository
  ) {}

  async syncCandidates() {
    const candidatesToSync =
      await this.candidateRepository.getCandidatesForLegacySync();

    if (candidatesToSync.length === 0) {
      console.log('No candidates to sync with legacy API');
      return;
    }

    let syncedCandidateIds: string[] = [];

    for (const candidate of candidatesToSync) {
      try {
        const response = await fetch(`${this.legacyApiUrl}/candidates`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': `${this.legacyApiKey}`,
          },
          body: JSON.stringify(candidate),
        });
        if (response.ok) {
          syncedCandidateIds.push(candidate.email);
        }
      } catch (error) {
        console.error(`Failed to sync candidate ${candidate.email}:`, error);
      }
    }

    if (syncedCandidateIds.length > 0) {
      await this.candidateRepository.markCandidateAsSynced(syncedCandidateIds);
      console.log(
        `Successfully synced ${syncedCandidateIds.length} candidates with legacy API`
      );
    }
  }
}
