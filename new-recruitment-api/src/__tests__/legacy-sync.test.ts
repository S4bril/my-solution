import { LegacySyncService } from '../services/legacy-sync.service';
import { CandidateRepository } from '../repositories/candidate.repository';

const mockRepository = {
  getCandidatesForLegacySync: jest.fn(),
  markCandidateAsSynced: jest.fn(),
} as unknown as jest.Mocked<CandidateRepository>;

describe('LegacySyncService', () => {
  let legacySyncService: LegacySyncService;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    legacySyncService = new LegacySyncService(
      'http://legacy-api',
      'test-api-key',
      mockRepository
    );
  });

  it('should not call legacy API when there are no unsynced candidates', async () => {
    mockRepository.getCandidatesForLegacySync.mockResolvedValue([]);
    const fetchSpy = jest.spyOn(global, 'fetch');

    await legacySyncService.syncCandidates();

    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('should sync candidates and mark them as synced', async () => {
    mockRepository.getCandidatesForLegacySync.mockResolvedValue([
      { firstName: 'Jan', lastName: 'Kowalski', email: 'jan@example.com' },
    ]);
    mockRepository.markCandidateAsSynced.mockResolvedValue(undefined);
    jest.spyOn(global, 'fetch').mockResolvedValue({ ok: true } as Response);

    await legacySyncService.syncCandidates();

    expect(mockRepository.markCandidateAsSynced).toHaveBeenCalledWith([
      'jan@example.com',
    ]);
  });

  it('should not mark candidate as synced when legacy API returns an error', async () => {
    mockRepository.getCandidatesForLegacySync.mockResolvedValue([
      { firstName: 'Jan', lastName: 'Kowalski', email: 'jan@example.com' },
    ]);
    jest.spyOn(global, 'fetch').mockResolvedValue({ ok: false } as Response);

    await legacySyncService.syncCandidates();

    expect(mockRepository.markCandidateAsSynced).not.toHaveBeenCalled();
  });
});
