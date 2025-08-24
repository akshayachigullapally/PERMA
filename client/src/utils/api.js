const API_BASE_URL = import.meta.env.VITE_API_URL ;

const api = {
  // Generic API request function
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  },

  // Firebase-specific request function
  async firebaseRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
      // Get Firebase ID token
      const { auth } = await import('../config/firebase');
      const user = auth.currentUser;
      
      if (!user) {
        throw new Error('User not authenticated with Firebase');
      }

      const idToken = await user.getIdToken();
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
          ...options.headers,
        },
        ...options,
      };

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('Firebase API request error:', error);
      throw error;
    }
  },

  // Directory API functions
  directory: {
    async getProfiles(params = {}) {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.sort) queryParams.append('sort', params.sort);
      if (params.search) queryParams.append('search', params.search);
      
      const queryString = queryParams.toString();
      const endpoint = `/users/directory${queryString ? `?${queryString}` : ''}`;
      
      return api.request(endpoint);
    }
  },

  // User API functions
  users: {
    async getPublicProfile(username) {
      return api.request(`/users/public/${username}`);
    },

    async getProfile() {
      return api.request('/users/profile');
    },

    async updateProfile(profileData) {
      return api.request('/users/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      });
    }
  },

  // Auth API functions
  auth: {
    async login(credentials) {
      return api.request('/auth/signin', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
    },

    async register(userData) {
      return api.request('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
    },

    async firebaseLogin(firebaseData) {
      return api.firebaseRequest('/auth/firebase-login', {
        method: 'POST',
        body: JSON.stringify(firebaseData),
      });
    },

    async logout() {
      return api.request('/auth/logout', {
        method: 'POST',
      });
    }
  },

  // Achievements API functions
  achievements: {
    async getAchievements() {
      return api.request('/achievements');
    },

    async checkAchievements() {
      return api.request('/achievements/check', {
        method: 'POST',
      });
    },

    async updateStreak() {
      return api.request('/achievements/update-streak', {
        method: 'POST',
      });
    }
  }
};

export default api;
