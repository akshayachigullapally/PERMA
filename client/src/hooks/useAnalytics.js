import { useState, useCallback } from 'react';

export const useAnalytics = () => {
  const [platformStats, setPlatformStats] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPlatformStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/analytics/platform-stats`);
      
      if (response.ok) {
        const data = await response.json();
        setPlatformStats(data.stats);
      } else {
        throw new Error('Failed to fetch platform stats');
      }
    } catch (err) {
      console.error('Error fetching platform stats:', err);
      setError(err.message);
      // Set fallback data if API fails
      setPlatformStats({
        totalUsers: 250,
        avgLinksPerUser: 5,
        monthlyGrowth: 15,
        proConversionRate: 3,
        clickThroughRate: 12,
        totalClicks: 5000,
        totalViews: 8000
      });
    } finally {
      setLoading(false);
    }
  }, []); // No dependencies needed

  const fetchUserStats = useCallback(async (token) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/analytics/user-stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserStats(data.analytics);
        return data.analytics; // Return the data for immediate use
      } else {
        throw new Error('Failed to fetch user stats');
      }
    } catch (err) {
      console.error('Error fetching user stats:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []); // No dependencies needed for token parameter

  return {
    platformStats,
    userStats,
    loading,
    error,
    fetchPlatformStats,
    fetchUserStats
  };
};

export const useLinkPerformance = () => {
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLinkPerformance = async (linkId, token) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/analytics/link-performance/${linkId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPerformance(data.performance);
      } else {
        throw new Error('Failed to fetch link performance');
      }
    } catch (err) {
      console.error('Error fetching link performance:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    performance,
    loading,
    error,
    fetchLinkPerformance
  };
};
