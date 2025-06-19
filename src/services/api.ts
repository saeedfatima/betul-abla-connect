
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

// Base API request function
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (response.status === 401) {
    // Token expired, try to refresh
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      const refreshResponse = await fetch(`${API_BASE_URL}/token/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshToken }),
      });
      
      if (refreshResponse.ok) {
        const { access } = await refreshResponse.json();
        localStorage.setItem('access_token', access);
        
        // Retry original request
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${access}`,
        };
        return fetch(`${API_BASE_URL}${endpoint}`, config);
      } else {
        clearTokens();
        window.location.href = '/login';
        return response;
      }
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
  
  getProfile: async () => {
    const response = await apiRequest('/auth/profile/');
    return response;
  },
};

// Orphans API
export const orphansAPI = {
  getAll: async () => {
    const response = await apiRequest('/orphans/');
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
  getAll: async () => {
    const response = await apiRequest('/boreholes/');
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
  getAll: async () => {
    const response = await apiRequest('/reports/');
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
