-- Location: supabase/migrations/20250720065723_github_pulse_auth_repositories.sql
-- Authentication & Repository Management Module

-- 1. Types and Core Tables
CREATE TYPE public.user_role AS ENUM ('admin', 'manager', 'member');
CREATE TYPE public.repository_status AS ENUM ('active', 'archived', 'private', 'public');
CREATE TYPE public.health_status AS ENUM ('healthy', 'warning', 'critical');
CREATE TYPE public.issue_state AS ENUM ('open', 'closed');
CREATE TYPE public.pr_state AS ENUM ('open', 'closed', 'merged');

-- Critical intermediary table for auth
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    github_username TEXT,
    role public.user_role DEFAULT 'member'::public.user_role,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Repositories table
CREATE TABLE public.repositories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    github_id BIGINT UNIQUE,
    name TEXT NOT NULL,
    full_name TEXT NOT NULL,
    description TEXT,
    owner_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    language TEXT,
    stars_count INTEGER DEFAULT 0,
    forks_count INTEGER DEFAULT 0,
    open_issues_count INTEGER DEFAULT 0,
    status public.repository_status DEFAULT 'active'::public.repository_status,
    health_score INTEGER DEFAULT 100 CHECK (health_score >= 0 AND health_score <= 100),
    health_status public.health_status DEFAULT 'healthy'::public.health_status,
    default_branch TEXT DEFAULT 'main',
    clone_url TEXT,
    html_url TEXT,
    last_commit_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Commits table for tracking repository activity
CREATE TABLE public.commits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sha TEXT NOT NULL,
    repository_id UUID REFERENCES public.repositories(id) ON DELETE CASCADE,
    author_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    author_name TEXT NOT NULL,
    author_email TEXT NOT NULL,
    message TEXT NOT NULL,
    additions INTEGER DEFAULT 0,
    deletions INTEGER DEFAULT 0,
    committed_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(repository_id, sha)
);

-- Issues table
CREATE TABLE public.issues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    github_id BIGINT NOT NULL,
    repository_id UUID REFERENCES public.repositories(id) ON DELETE CASCADE,
    number INTEGER NOT NULL,
    title TEXT NOT NULL,
    body TEXT,
    state public.issue_state DEFAULT 'open'::public.issue_state,
    author_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    assignee_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    labels JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    closed_at TIMESTAMPTZ,
    UNIQUE(repository_id, github_id)
);

-- Pull Requests table
CREATE TABLE public.pull_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    github_id BIGINT NOT NULL,
    repository_id UUID REFERENCES public.repositories(id) ON DELETE CASCADE,
    number INTEGER NOT NULL,
    title TEXT NOT NULL,
    body TEXT,
    state public.pr_state DEFAULT 'open'::public.pr_state,
    author_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    assignee_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    reviewer_ids UUID[] DEFAULT '{}',
    head_branch TEXT NOT NULL,
    base_branch TEXT NOT NULL,
    additions INTEGER DEFAULT 0,
    deletions INTEGER DEFAULT 0,
    changed_files INTEGER DEFAULT 0,
    review_comments INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    merged_at TIMESTAMPTZ,
    closed_at TIMESTAMPTZ,
    UNIQUE(repository_id, github_id)
);

-- Repository collaborators junction table
CREATE TABLE public.repository_collaborators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    repository_id UUID REFERENCES public.repositories(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(repository_id, user_id)
);

-- 2. Essential Indexes
CREATE INDEX idx_user_profiles_user_id ON public.user_profiles(id);
CREATE INDEX idx_user_profiles_github_username ON public.user_profiles(github_username);
CREATE INDEX idx_repositories_owner_id ON public.repositories(owner_id);
CREATE INDEX idx_repositories_github_id ON public.repositories(github_id);
CREATE INDEX idx_repositories_health_status ON public.repositories(health_status);
CREATE INDEX idx_commits_repository_id ON public.commits(repository_id);
CREATE INDEX idx_commits_author_id ON public.commits(author_id);
CREATE INDEX idx_commits_committed_at ON public.commits(committed_at);
CREATE INDEX idx_issues_repository_id ON public.issues(repository_id);
CREATE INDEX idx_issues_state ON public.issues(state);
CREATE INDEX idx_pull_requests_repository_id ON public.pull_requests(repository_id);
CREATE INDEX idx_pull_requests_state ON public.pull_requests(state);
CREATE INDEX idx_repository_collaborators_repository_id ON public.repository_collaborators(repository_id);
CREATE INDEX idx_repository_collaborators_user_id ON public.repository_collaborators(user_id);

-- 3. RLS Setup
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.repositories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pull_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.repository_collaborators ENABLE ROW LEVEL SECURITY;

-- 4. Helper Functions for RLS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'admin'
)
$$;

CREATE OR REPLACE FUNCTION public.is_repository_collaborator(repo_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.repository_collaborators rc
    WHERE rc.repository_id = repo_uuid AND rc.user_id = auth.uid()
) OR EXISTS (
    SELECT 1 FROM public.repositories r
    WHERE r.id = repo_uuid AND r.owner_id = auth.uid()
)
$$;

CREATE OR REPLACE FUNCTION public.can_access_repository_data(repo_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT public.is_repository_collaborator(repo_uuid) OR public.is_admin()
$$;

-- Function for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, github_username, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'github_username',
    COALESCE(NEW.raw_user_meta_data->>'role', 'member')::public.user_role
  );  
  RETURN NEW;
END;
$$;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update repository health score
CREATE OR REPLACE FUNCTION public.update_repository_health_score(repo_uuid UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    open_issues_count INTEGER;
    recent_commits_count INTEGER;
    pr_merge_rate DECIMAL;
    health_score INTEGER;
    health_status_val public.health_status;
BEGIN
    -- Get open issues count
    SELECT COUNT(*) INTO open_issues_count
    FROM public.issues i
    WHERE i.repository_id = repo_uuid AND i.state = 'open';
    
    -- Get recent commits (last 30 days)
    SELECT COUNT(*) INTO recent_commits_count
    FROM public.commits c
    WHERE c.repository_id = repo_uuid 
    AND c.committed_at > CURRENT_TIMESTAMP - INTERVAL '30 days';
    
    -- Calculate PR merge rate
    SELECT CASE 
        WHEN COUNT(*) = 0 THEN 1.0
        ELSE COUNT(*) FILTER (WHERE state = 'merged')::DECIMAL / COUNT(*)
    END INTO pr_merge_rate
    FROM public.pull_requests pr
    WHERE pr.repository_id = repo_uuid 
    AND pr.created_at > CURRENT_TIMESTAMP - INTERVAL '30 days';
    
    -- Calculate health score (0-100)
    health_score := GREATEST(0, LEAST(100, 
        100 - (open_issues_count * 2) + (recent_commits_count * 5) + (pr_merge_rate * 20)::INTEGER
    ));
    
    -- Determine health status
    IF health_score >= 80 THEN
        health_status_val := 'healthy';
    ELSIF health_score >= 60 THEN
        health_status_val := 'warning';
    ELSE
        health_status_val := 'critical';
    END IF;
    
    -- Update repository
    UPDATE public.repositories
    SET 
        health_score = health_score,
        health_status = health_status_val,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = repo_uuid;
END;
$$;

-- 5. RLS Policies
CREATE POLICY "users_own_profile" ON public.user_profiles 
FOR ALL USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "admins_view_all_profiles" ON public.user_profiles 
FOR SELECT USING (public.is_admin());

CREATE POLICY "collaborators_view_repositories" ON public.repositories 
FOR SELECT USING (public.is_repository_collaborator(id) OR public.is_admin());

CREATE POLICY "owners_manage_repositories" ON public.repositories 
FOR ALL USING (owner_id = auth.uid() OR public.is_admin()) 
WITH CHECK (owner_id = auth.uid() OR public.is_admin());

CREATE POLICY "collaborators_view_commits" ON public.commits 
FOR SELECT USING (public.can_access_repository_data(repository_id));

CREATE POLICY "collaborators_insert_commits" ON public.commits 
FOR INSERT WITH CHECK (public.can_access_repository_data(repository_id));

CREATE POLICY "collaborators_view_issues" ON public.issues 
FOR SELECT USING (public.can_access_repository_data(repository_id));

CREATE POLICY "collaborators_manage_issues" ON public.issues 
FOR ALL USING (public.can_access_repository_data(repository_id)) 
WITH CHECK (public.can_access_repository_data(repository_id));

CREATE POLICY "collaborators_view_pull_requests" ON public.pull_requests 
FOR SELECT USING (public.can_access_repository_data(repository_id));

CREATE POLICY "collaborators_manage_pull_requests" ON public.pull_requests 
FOR ALL USING (public.can_access_repository_data(repository_id)) 
WITH CHECK (public.can_access_repository_data(repository_id));

CREATE POLICY "collaborators_view_repository_collaborators" ON public.repository_collaborators 
FOR SELECT USING (public.can_access_repository_data(repository_id));

CREATE POLICY "owners_manage_collaborators" ON public.repository_collaborators 
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.repositories r 
        WHERE r.id = repository_id AND r.owner_id = auth.uid()
    ) OR public.is_admin()
) WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.repositories r 
        WHERE r.id = repository_id AND r.owner_id = auth.uid()
    ) OR public.is_admin()
);

-- 6. Mock Data
DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    user1_uuid UUID := gen_random_uuid();
    user2_uuid UUID := gen_random_uuid();
    repo1_uuid UUID := gen_random_uuid();
    repo2_uuid UUID := gen_random_uuid();
    repo3_uuid UUID := gen_random_uuid();
BEGIN
    -- Create auth users with required fields
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@githubpulse.com', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Admin User", "github_username": "admin", "role": "admin"}'::jsonb, 
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (user1_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'developer@example.com', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Sarah Johnson", "github_username": "sarahj", "role": "member"}'::jsonb, 
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (user2_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'manager@example.com', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Michael Chen", "github_username": "mchen", "role": "manager"}'::jsonb, 
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Create repositories
    INSERT INTO public.repositories (id, github_id, name, full_name, description, owner_id, language, stars_count, forks_count, open_issues_count, status, health_score, health_status, html_url, last_commit_at) VALUES
        (repo1_uuid, 123456789, 'frontend-dashboard', 'githubpulse/frontend-dashboard', 'React-based analytics dashboard with real-time updates', admin_uuid, 'JavaScript', 1247, 89, 12, 'active', 95, 'healthy', 'https://github.com/githubpulse/frontend-dashboard', CURRENT_TIMESTAMP - INTERVAL '2 hours'),
        (repo2_uuid, 123456790, 'backend-api', 'githubpulse/backend-api', 'RESTful API service with GraphQL support', user2_uuid, 'Python', 892, 156, 8, 'active', 88, 'healthy', 'https://github.com/githubpulse/backend-api', CURRENT_TIMESTAMP - INTERVAL '4 hours'),
        (repo3_uuid, 123456791, 'mobile-app', 'githubpulse/mobile-app', 'Cross-platform mobile application built with React Native', user1_uuid, 'TypeScript', 634, 45, 23, 'active', 72, 'warning', 'https://github.com/githubpulse/mobile-app', CURRENT_TIMESTAMP - INTERVAL '1 day');

    -- Create repository collaborators
    INSERT INTO public.repository_collaborators (repository_id, user_id, role) VALUES
        (repo1_uuid, user1_uuid, 'developer'),
        (repo1_uuid, user2_uuid, 'maintainer'),
        (repo2_uuid, admin_uuid, 'maintainer'),
        (repo2_uuid, user1_uuid, 'developer'),
        (repo3_uuid, admin_uuid, 'maintainer'),
        (repo3_uuid, user2_uuid, 'developer');

    -- Create sample commits
    INSERT INTO public.commits (repository_id, sha, author_id, author_name, author_email, message, additions, deletions, committed_at) VALUES
        (repo1_uuid, 'abc123def456', admin_uuid, 'Admin User', 'admin@githubpulse.com', 'Add real-time dashboard updates', 45, 12, CURRENT_TIMESTAMP - INTERVAL '2 hours'),
        (repo1_uuid, 'def456ghi789', user1_uuid, 'Sarah Johnson', 'developer@example.com', 'Fix responsive layout issues', 23, 8, CURRENT_TIMESTAMP - INTERVAL '6 hours'),
        (repo2_uuid, 'ghi789jkl012', user2_uuid, 'Michael Chen', 'manager@example.com', 'Implement GraphQL subscriptions', 67, 15, CURRENT_TIMESTAMP - INTERVAL '4 hours'),
        (repo3_uuid, 'jkl012mno345', user1_uuid, 'Sarah Johnson', 'developer@example.com', 'Update navigation components', 34, 19, CURRENT_TIMESTAMP - INTERVAL '1 day');

    -- Create sample issues
    INSERT INTO public.issues (github_id, repository_id, number, title, body, state, author_id, labels) VALUES
        (1001, repo1_uuid, 45, 'Dashboard loading performance', 'The dashboard takes too long to load with large datasets', 'open', user1_uuid, '["bug", "performance"]'::jsonb),
        (1002, repo2_uuid, 23, 'Add rate limiting to API', 'Implement rate limiting for API endpoints', 'open', user2_uuid, '["enhancement", "security"]'::jsonb),
        (1003, repo3_uuid, 67, 'Navigation drawer not responsive', 'Navigation drawer does not work properly on small screens', 'open', admin_uuid, '["bug", "mobile"]'::jsonb);

    -- Create sample pull requests
    INSERT INTO public.pull_requests (github_id, repository_id, number, title, body, state, author_id, head_branch, base_branch, additions, deletions, changed_files) VALUES
        (2001, repo1_uuid, 12, 'Optimize dashboard rendering', 'Improve rendering performance for large datasets', 'open', user1_uuid, 'feature/optimize-rendering', 'main', 156, 45, 8),
        (2002, repo2_uuid, 8, 'Add authentication middleware', 'Implement JWT authentication middleware', 'merged', user2_uuid, 'feature/auth-middleware', 'main', 89, 12, 5),
        (2003, repo3_uuid, 15, 'Fix navigation issues', 'Resolve navigation drawer responsiveness', 'open', admin_uuid, 'bugfix/navigation', 'main', 67, 23, 4);

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error: %', SQLERRM;
END $$;

-- Function to clean up test data
CREATE OR REPLACE FUNCTION public.cleanup_github_pulse_test_data()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    auth_user_ids_to_delete UUID[];
BEGIN
    -- Get auth user IDs first
    SELECT ARRAY_AGG(id) INTO auth_user_ids_to_delete
    FROM auth.users
    WHERE email LIKE '%@githubpulse.com' OR email LIKE '%@example.com';

    -- Delete in dependency order (children first, then auth.users last)
    DELETE FROM public.pull_requests WHERE repository_id IN (
        SELECT id FROM public.repositories WHERE owner_id = ANY(auth_user_ids_to_delete)
    );
    DELETE FROM public.issues WHERE repository_id IN (
        SELECT id FROM public.repositories WHERE owner_id = ANY(auth_user_ids_to_delete)
    );
    DELETE FROM public.commits WHERE repository_id IN (
        SELECT id FROM public.repositories WHERE owner_id = ANY(auth_user_ids_to_delete)
    );
    DELETE FROM public.repository_collaborators WHERE user_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.repositories WHERE owner_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.user_profiles WHERE id = ANY(auth_user_ids_to_delete);

    -- Delete auth.users last (after all references are removed)
    DELETE FROM auth.users WHERE id = ANY(auth_user_ids_to_delete);
EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key constraint prevents deletion: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Cleanup failed: %', SQLERRM;
END;
$$;