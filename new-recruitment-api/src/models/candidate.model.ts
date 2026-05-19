export interface CandidateModel {
  id: number;
  name: string;
  email: string;
  phone: string;
  years_of_experience: number;
  recruiter_notes: string | null;
  recruitment_status: 'new' | 'interviewing' | 'accepted' | 'rejected';
}
