import { supabase } from './supabase';

const repositoryService = {
  // Get all repositories user has access to
  async getRepositories() {
    try {
      const { data, error } = await supabase
        .from('repositories')
        .select(`
          *,
          owner:user_profiles!repositories_owner_id_fkey(
            id,
            full_name,
            github_username,
            avatar_url
          ),
          repository_collaborators(
            user_id,
            role,
            user:user_profiles(full_name, github_username)
          )
        `)
        .order('updated_at', { ascending: false });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError') ||
          error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted.' 
        };
      }
      return { success: false, error: 'Failed to load repositories' };
    }
  },

  // Get repository by ID
  async getRepository(repositoryId) {
    try {
      const { data, error } = await supabase
        .from('repositories')
        .select(`
          *,
          owner:user_profiles!repositories_owner_id_fkey(
            id,
            full_name,
            github_username,
            avatar_url
          ),
          repository_collaborators(
            user_id,
            role,
            user:user_profiles(full_name, github_username, avatar_url)
          )
        `)
        .eq('id', repositoryId)
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError') ||
          error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted.' 
        };
      }
      return { success: false, error: 'Failed to load repository' };
    }
  },

  // Get recent commits for a repository
  async getRepositoryCommits(repositoryId, limit = 50) {
    try {
      const { data, error } = await supabase
        .from('commits')
        .select(`
          *,
          author:user_profiles(full_name, github_username, avatar_url)
        `)
        .eq('repository_id', repositoryId)
        .order('committed_at', { ascending: false })
        .limit(limit);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError') ||
          error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted.' 
        };
      }
      return { success: false, error: 'Failed to load commits' };
    }
  },

  // Get repository issues
  async getRepositoryIssues(repositoryId, state = 'all') {
    try {
      let query = supabase
        .from('issues')
        .select(`
          *,
          author:user_profiles!issues_author_id_fkey(full_name, github_username, avatar_url),
          assignee:user_profiles!issues_assignee_id_fkey(full_name, github_username, avatar_url)
        `)
        .eq('repository_id', repositoryId)
        .order('created_at', { ascending: false });

      if (state !== 'all') {
        query = query.eq('state', state);
      }

      const { data, error } = await query;

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError') ||
          error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted.' 
        };
      }
      return { success: false, error: 'Failed to load issues' };
    }
  },

  // Get repository pull requests
  async getRepositoryPullRequests(repositoryId, state = 'all') {
    try {
      let query = supabase
        .from('pull_requests')
        .select(`
          *,
          author:user_profiles!pull_requests_author_id_fkey(full_name, github_username, avatar_url),
          assignee:user_profiles!pull_requests_assignee_id_fkey(full_name, github_username, avatar_url)
        `)
        .eq('repository_id', repositoryId)
        .order('created_at', { ascending: false });

      if (state !== 'all') {
        query = query.eq('state', state);
      }

      const { data, error } = await query;

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError') ||
          error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted.' 
        };
      }
      return { success: false, error: 'Failed to load pull requests' };
    }
  },

  // Get repository analytics
  async getRepositoryAnalytics(repositoryId) {
    try {
      // Get commit activity for the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: commits, error: commitsError } = await supabase
        .from('commits')
        .select('committed_at, additions, deletions')
        .eq('repository_id', repositoryId)
        .gte('committed_at', thirtyDaysAgo.toISOString())
        .order('committed_at', { ascending: true });

      if (commitsError) {
        return { success: false, error: commitsError.message };
      }

      // Get issue counts
      const { data: issueStats, error: issueStatsError } = await supabase
        .rpc('get_repository_issue_stats', { repo_id: repositoryId });

      if (issueStatsError) {
        return { success: false, error: issueStatsError.message };
      }

      // Get PR counts
      const { data: prStats, error: prStatsError } = await supabase
        .rpc('get_repository_pr_stats', { repo_id: repositoryId });

      if (prStatsError) {
        return { success: false, error: prStatsError.message };
      }

      return {
        success: true,
        data: {
          commits: commits || [],
          issueStats: issueStats || { open: 0, closed: 0 },
          prStats: prStats || { open: 0, closed: 0, merged: 0 }
        }
      };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError') ||
          error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted.' 
        };
      }
      return { success: false, error: 'Failed to load repository analytics' };
    }
  },

  // Subscribe to repository changes
  subscribeToRepositoryChanges(repositoryId, callback) {
    const channel = supabase
      .channel(`repository_changes_${repositoryId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'repositories',
          filter: `id=eq.${repositoryId}`
        },
        callback
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'commits',
          filter: `repository_id=eq.${repositoryId}`
        },
        callback
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'issues',
          filter: `repository_id=eq.${repositoryId}`
        },
        callback
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'pull_requests',
          filter: `repository_id=eq.${repositoryId}`
        },
        callback
      )
      .subscribe();

    return channel;
  },

  // Subscribe to all repositories changes
  subscribeToAllRepositories(callback) {
    const channel = supabase
      .channel('all_repositories_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'repositories'
        },
        callback
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'commits'
        },
        callback
      )
      .subscribe();

    return channel;
  },

  // Unsubscribe from changes
  unsubscribe(channel) {
    if (channel) {
      supabase.removeChannel(channel);
    }
  }
};

export default repositoryService;