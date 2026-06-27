-- Create dsa_progress table
CREATE TABLE
  public.dsa_progress (
    id UUID NOT NULL DEFAULT gen_random_uuid (),
    user_id UUID NOT NULL,
    problem_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT dsa_progress_pkey PRIMARY KEY (id),
    CONSTRAINT dsa_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE
  );

-- Create dsa_streaks table
CREATE TABLE
  public.dsa_streaks (
    id UUID NOT NULL DEFAULT gen_random_uuid (),
    user_id UUID NOT NULL,
    streak INTEGER NOT NULL DEFAULT 1,
    last_completed_at DATE NOT NULL DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT dsa_streaks_pkey PRIMARY KEY (id),
    CONSTRAINT dsa_streaks_user_id_key UNIQUE (user_id),
    CONSTRAINT dsa_streaks_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE
  );

-- Secure the tables with Row Level Security
ALTER TABLE public.dsa_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dsa_streaks ENABLE ROW LEVEL SECURITY;

-- Create policies for dsa_progress
CREATE POLICY "Enable read access for authenticated users" ON public.dsa_progress FOR
SELECT
  USING (auth.uid () = user_id);

CREATE POLICY "Enable insert for authenticated users" ON public.dsa_progress FOR INSERT
WITH
  CHECK (auth.uid () = user_id);

-- Create policies for dsa_streaks
CREATE POLICY "Enable read access for authenticated users" ON public.dsa_streaks FOR
SELECT
  USING (auth.uid () = user_id);

CREATE POLICY "Enable insert for authenticated users" ON public.dsa_streaks FOR INSERT
WITH
  CHECK (auth.uid () = user_id);

CREATE POLICY "Enable update for authenticated users" ON public.dsa_streaks FOR UPDATE
WITH
  CHECK (auth.uid () = user_id);
