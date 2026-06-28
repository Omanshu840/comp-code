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

CREATE TABLE public.friendships (
  id           UUID NOT NULL DEFAULT gen_random_uuid(),
  requester_id UUID NOT NULL,
  addressee_id UUID NOT NULL,
  status       TEXT NOT NULL DEFAULT 'pending'
                 CHECK (status IN ('pending', 'accepted', 'blocked')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT friendships_pkey PRIMARY KEY (id),
  CONSTRAINT friendships_unique UNIQUE (requester_id, addressee_id),
  CONSTRAINT friendships_no_self CHECK (requester_id <> addressee_id),
  CONSTRAINT friendships_requester_fkey FOREIGN KEY (requester_id)
    REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT friendships_addressee_fkey FOREIGN KEY (addressee_id)
    REFERENCES auth.users(id) ON DELETE CASCADE
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

-- Allow users to read their own streak
CREATE POLICY "Users can view own streak"
ON dsa_streaks
FOR SELECT
USING (auth.uid() = user_id);

-- Allow users to insert their own streak row
CREATE POLICY "Users can insert own streak"
ON dsa_streaks
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own streak row
CREATE POLICY "Users can update own streak"
ON dsa_streaks
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;

-- See your own friend rows (sent or received)
CREATE POLICY "friendships_select" ON public.friendships
  FOR SELECT USING (
    auth.uid() = requester_id OR auth.uid() = addressee_id
  );

-- Only you can send a friend request
CREATE POLICY "friendships_insert" ON public.friendships
  FOR INSERT WITH CHECK (auth.uid() = requester_id);

-- Only the receiver can accept/block
CREATE POLICY "friendships_update" ON public.friendships
  FOR UPDATE USING (
    auth.uid() = addressee_id
  );

-- Either side can remove the friendship
CREATE POLICY "friendships_delete" ON public.friendships
  FOR DELETE USING (
    auth.uid() = requester_id OR auth.uid() = addressee_id
  );
