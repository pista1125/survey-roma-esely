
-- Create survey responses table
CREATE TABLE public.survey_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT,
  q1 INTEGER, q2 INTEGER, q3 INTEGER, q4 INTEGER,
  q5 TEXT, q6 INTEGER, q7 TEXT, q8 INTEGER,
  q9 INTEGER, q10 INTEGER, q11 INTEGER, q12 INTEGER,
  q13 INTEGER, q14 INTEGER, q15 INTEGER,
  q16 INTEGER, q17 INTEGER, q18 INTEGER,
  q19 INTEGER, q20 TEXT,
  age_group TEXT,
  gender TEXT,
  region TEXT,
  position TEXT,
  hiring_involvement TEXT,
  hiring_decisions_count TEXT,
  org_size TEXT,
  industry TEXT,
  org_ownership TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit survey" ON public.survey_responses
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can read responses" ON public.survey_responses
  FOR SELECT TO authenticated USING (true);
