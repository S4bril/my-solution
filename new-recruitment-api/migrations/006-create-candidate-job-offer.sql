CREATE TABLE CandidateJobOffer (
  candidate_id INTEGER REFERENCES Candidate(id),
  job_offer_id INTEGER REFERENCES JobOffer(id),
  PRIMARY KEY (candidate_id, job_offer_id)
);
