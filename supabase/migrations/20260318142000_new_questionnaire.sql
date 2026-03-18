-- Update survey responses table for the new questionnaire
DROP TABLE IF EXISTS public.survey_responses;

CREATE TABLE public.survey_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Section 1 & 2 & 3 (Demographics)
  gender TEXT,
  company_form TEXT,
  county TEXT,
  position TEXT,
  position_other TEXT,
  emp_count TEXT,
  sector TEXT,
  ownership TEXT,
  hiring_freq TEXT,
  
  -- Section 4 (Operations)
  q9 INTEGER,
  q11 TEXT,
  q12 INTEGER,
  q13 TEXT,
  
  -- Section 5 (Experience)
  q14 TEXT,
  q15 TEXT,
  
  -- Section 6 (Perceptions)
  p1 INTEGER, p2 INTEGER, p3 INTEGER, p4 INTEGER, p5 INTEGER,
  p6 INTEGER, p7 INTEGER, p8 INTEGER, p9 INTEGER, p10 INTEGER,
  
  -- Section 7 (Barriers)
  b1 INTEGER, b2 INTEGER, b3 INTEGER, b4 INTEGER, b5 INTEGER, b6 INTEGER,
  
  -- Section 8 (Actions)
  a1 INTEGER, a2 INTEGER, a3 INTEGER, a4 INTEGER, a5 INTEGER,
  
  -- Section 9 (Final)
  future_outlook TEXT,
  effective_step TEXT,
  email TEXT
);

-- RLS
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit survey" ON public.survey_responses FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can read responses" ON public.survey_responses FOR SELECT TO authenticated USING (true);
