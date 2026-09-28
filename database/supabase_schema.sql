-- ==============================================================================
-- AI RESUME BUILDER FOR COLLEGE STUDENTS & FRESHERS
-- Complete PostgreSQL / Supabase Schema with Row Level Security (RLS)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE (Extends Supabase auth.users or standalone users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. STUDENT PROFILES (Personal Information & Links)
CREATE TABLE IF NOT EXISTS public.student_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    phone TEXT,
    location TEXT,
    linkedin_url TEXT,
    github_url TEXT,
    portfolio_url TEXT,
    summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. EDUCATION TABLE
CREATE TABLE IF NOT EXISTS public.education (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    college_name TEXT NOT NULL,
    degree TEXT NOT NULL,
    branch_specialization TEXT NOT NULL,
    current_year TEXT,
    graduation_year TEXT NOT NULL,
    cgpa_percentage TEXT,
    relevant_coursework TEXT,
    display_order INT DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. SKILLS TABLE (Categorized Technical & Soft Skills)
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    category TEXT NOT NULL CHECK (category IN ('programming', 'web', 'databases', 'frameworks', 'tools', 'cloud', 'aiml', 'soft', 'custom')),
    skill_name TEXT NOT NULL,
    proficiency_level TEXT DEFAULT 'intermediate',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    project_name TEXT NOT NULL,
    description TEXT NOT NULL,
    technologies_used TEXT NOT NULL,
    student_role TEXT,
    key_features TEXT,
    project_link TEXT,
    github_link TEXT,
    bullet_points JSONB DEFAULT '[]'::jsonb,
    display_order INT DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. EXPERIENCE TABLE (Optional for College Freshers)
CREATE TABLE IF NOT EXISTS public.experience (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    position TEXT NOT NULL,
    duration TEXT NOT NULL,
    responsibilities TEXT,
    achievements TEXT,
    display_order INT DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. CERTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.certifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    certification_name TEXT NOT NULL,
    issuing_organization TEXT NOT NULL,
    issue_date TEXT,
    credential_link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. ACHIEVEMENTS TABLE (Hackathons, Awards, Academic Honors)
CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    date TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. TARGET JOBS (Company & Role Targets for AI Tailoring)
CREATE TABLE IF NOT EXISTS public.target_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    job_role TEXT NOT NULL,
    job_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. RESUMES TABLE (Primary Saved Resumes)
CREATE TABLE IF NOT EXISTS public.resumes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    resume_name TEXT NOT NULL,
    target_job_id UUID REFERENCES public.target_jobs(id) ON DELETE SET NULL,
    target_company TEXT,
    target_role TEXT,
    template_id TEXT DEFAULT 'fresher',
    accent_color TEXT DEFAULT '#4f46e5',
    font_family TEXT DEFAULT 'Inter',
    ats_score INT DEFAULT 85,
    ats_score_breakdown JSONB DEFAULT '{}'::jsonb,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. RESUME VERSIONS (Snapshot of Resume State)
CREATE TABLE IF NOT EXISTS public.resume_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resume_id UUID REFERENCES public.resumes(id) ON DELETE CASCADE,
    version_number INT NOT NULL,
    content_snapshot JSONB NOT NULL,
    change_summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Students can only read, insert, update, and delete their own resume data
-- ==============================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.target_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_versions ENABLE ROW LEVEL SECURITY;

-- Sample RLS policy template for authenticated Supabase users:
CREATE POLICY "Users can only view own profile" ON public.users
    FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users manage own student profile" ON public.student_profiles
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage own education" ON public.education
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage own skills" ON public.skills
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage own projects" ON public.projects
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage own experience" ON public.experience
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage own resumes" ON public.resumes
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage own resume versions" ON public.resume_versions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.resumes 
            WHERE resumes.id = resume_versions.resume_id 
            AND resumes.user_id = auth.uid()
        )
    );
