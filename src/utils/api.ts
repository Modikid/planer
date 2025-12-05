// API utility for making authenticated requests to the backend

const API_BASE_URL = import.meta.env.PROD ? '' : 'http://localhost:8787';

interface FetchOptions extends RequestInit {
  requireAuth?: boolean;
}

export const fetchWithAuth = async (
  endpoint: string,
  options: FetchOptions = {}
): Promise<Response> => {
  const { requireAuth = true, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string>),
  };

  // Add JWT token to Authorization header if required
  if (requireAuth) {
    const token = localStorage.getItem('firebase_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  // Handle 401 Unauthorized
  if (response.status === 401 && requireAuth) {
    // Token expired or invalid
    console.error('Authentication failed: Token expired or invalid');
    localStorage.removeItem('firebase_token');
    
    // Reload to trigger re-authentication
    window.location.reload();
    throw new Error('Authentication failed');
  }

  return response;
};
