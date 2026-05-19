CREATE TABLE Candidate (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    years_of_experience INTEGER,
    recruiter_notes TEXT,
    recruitment_status TEXT CHECK(recruitment_status IN ('new', 'interviewing', 'accepted', 'rejected')) NOT NULL DEFAULT 'new',
    consent_date DATETIME DEFAULT CURRENT_TIMESTAMP
);
