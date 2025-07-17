
const API_BASE_URL = 'http://localhost:8000/api';

// Token management
export const getAuthToken = () => localStorage.getItem('access_token');
export const getRefreshToken = () => localStorage.getItem('refresh_token');

export const setTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem('access_token', accessToken);
  localStorage.setItem('refresh_token', refreshToken);
};

export const clearTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('betul_abla_user');
};

// Token refresh utility
let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (error: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token!);
    }
  });
  
  failedQueue = [];
};

// Base API request function with automatic token refresh
const apiRequest = async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
  const token = getAuthToken();
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  let response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  // Handle token expiration
  if (response.status === 401 && token) {
    const refreshToken = getRefreshToken();
    
    if (refreshToken) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          // Retry with new token
          const newToken = getAuthToken();
          const newConfig = {
            ...config,
            headers: {
              ...config.headers,
              Authorization: `Bearer ${newToken}`,
            },
          };
          return fetch(`${API_BASE_URL}${endpoint}`, newConfig);
        });
      }

      isRefreshing = true;

      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/token/refresh/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh: refreshToken }),
        });

        if (refreshResponse.ok) {
          const { access } = await refreshResponse.json();
          setTokens(access, refreshToken);
          processQueue(null, access);

          // Retry original request with new token
          const newConfig = {
            ...config,
            headers: {
              ...config.headers,
              Authorization: `Bearer ${access}`,
            },
          };
          response = await fetch(`${API_BASE_URL}${endpoint}`, newConfig);
        } else {
          processQueue(new Error('Token refresh failed'), null);
          clearTokens();
          window.location.href = '/login';
        }
      } catch (error) {
        processQueue(error, null);
        clearTokens();
        window.location.href = '/login';
      } finally {
        isRefreshing = false;
      }
    } else {
      clearTokens();
      window.location.href = '/login';
    }
  }
  
  return response;
};

// Authentication API
export const authAPI = {
  login: async (username: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/token/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return response;
  },
  
  refreshToken: async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await fetch(`${API_BASE_URL}/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    });
    return response;
  },
  
  getProfile: async () => {
    const response = await apiRequest('/auth/profile/');
    return response;
  },

  changePassword: async (oldPassword: string, newPassword: string) => {
    const response = await apiRequest('/auth/change-password/', {
      method: 'POST',
      body: JSON.stringify({
        old_password: oldPassword,
        new_password: newPassword,
        confirm_password: newPassword,
      }),
    });
    return response;
  },

  updateProfile: async (profileData: any) => {
    const response = await apiRequest('/auth/profile/', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
    return response;
  },
};

// Orphans API
export const orphansAPI = {
  getAll: async (params?: Record<string, any>) => {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    const endpoint = `/orphans/${queryString ? `?${queryString}` : ''}`;
    const response = await apiRequest(endpoint);
    return response;
  },
  
  getById: async (id: string) => {
    const response = await apiRequest(`/orphans/${id}/`);
    return response;
  },
  
  create: async (data: any) => {
    const response = await apiRequest('/orphans/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response;
  },
  
  update: async (id: string, data: any) => {
    const response = await apiRequest(`/orphans/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response;
  },
  
  delete: async (id: string) => {
    const response = await apiRequest(`/orphans/${id}/`, {
      method: 'DELETE',
    });
    return response;
  },
};

// Boreholes API
export const boreholesAPI = {
  getAll: async (params?: Record<string, any>) => {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    const endpoint = `/boreholes/${queryString ? `?${queryString}` : ''}`;
    const response = await apiRequest(endpoint);
    return response;
  },
  
  getById: async (id: string) => {
    const response = await apiRequest(`/boreholes/${id}/`);
    return response;
  },
  
  create: async (data: any) => {
    const response = await apiRequest('/boreholes/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response;
  },
  
  update: async (id: string, data: any) => {
    const response = await apiRequest(`/boreholes/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response;
  },
  
  delete: async (id: string) => {
    const response = await apiRequest(`/boreholes/${id}/`, {
      method: 'DELETE',
    });
    return response;
  },
};

// Reports API
export const reportsAPI = {
  getAll: async (params?: Record<string, any>) => {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    const endpoint = `/reports/${queryString ? `?${queryString}` : ''}`;
    const response = await apiRequest(endpoint);
    return response;
  },
  
  create: async (data: any) => {
    const response = await apiRequest('/reports/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response;
  },
  
  update: async (id: string, data: any) => {
    const response = await apiRequest(`/reports/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response;
  },
  
  delete: async (id: string) => {
    const response = await apiRequest(`/reports/${id}/`, {
      method: 'DELETE',
    });
    return response;
  },
  
  download: async (id: string) => {
    const response = await apiRequest(`/reports/${id}/download/`);
    return response;
  },
};
