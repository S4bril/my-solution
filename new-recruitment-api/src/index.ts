import 'dotenv/config';
import * as process from 'node:process';
import { setupDb } from './db';
import { setupApp } from './app';
import { CandidateRepository } from './repositories/candidate.repository';
import { LegacySyncService } from './services/legacy-sync.service';

const PORT = process.env.PORT ?? 3000;
const LEGACY_SYNC_INTERVAL_MS = 30_000;

main();

async function main() {
  const db = await setupDb();

  const app = await setupApp(db);

  const legacySyncService = new LegacySyncService(
    process.env.LEGACY_API_URL!,
    process.env.LEGACY_API_KEY!,
    new CandidateRepository(db)
  );

  setInterval(() => {
    legacySyncService.syncCandidates();
  }, LEGACY_SYNC_INTERVAL_MS);

  app.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
  });
}
