export interface CandidateModel {
  id: number;
  name: string;
  surname: string;
  email: string;
  phone: string | null;
  years_of_experience: number | null;
  recruiter_notes: string | null;
  recruitment_status: 'new' | 'interviewing' | 'accepted' | 'rejected';
  consent_date: string;
  job_offer_ids: number[];
  legacy_synced: boolean;
}

export interface CreateCandidateModel {
  name: string;
  surname: string;
  email: string;
  phone?: string;
  years_of_experience?: number;
  recruiter_notes?: string;
  recruitment_status?: 'new' | 'interviewing' | 'accepted' | 'rejected';
  consent_date: string;
  job_offer_ids: number[];
}

export interface LegacyApiSyncCandidateModel {
  firstName: string;
  lastName: string;
  email: string;
}
