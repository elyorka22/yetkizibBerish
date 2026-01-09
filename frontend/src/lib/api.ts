import { auth } from '@/config/firebase';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  let token: string | null = null;
  
  if (typeof window !== 'undefined' && auth && auth.currentUser) {
    try {
      token = await auth.currentUser.getIdToken();
    } catch (error) {
      console.error('Error getting token:', error);
    }
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'Request failed');
  }

  return response.json();
}

// Auth endpoints
export const authApi = {
  verifyToken: (token: string) =>
    apiRequest<{ valid: boolean; user?: any }>('/auth/verify', {
      method: 'POST',
      body: JSON.stringify({ token }),
    }),
};

// Order endpoints
export const orderApi = {
  assignToPicker: (orderId: string, pickerId: string) =>
    apiRequest(`/orders/${orderId}/assign-picker`, {
      method: 'POST',
      body: JSON.stringify({ pickerId }),
    }),
  
  assignToCourier: (orderId: string, courierId: string) =>
    apiRequest(`/orders/${orderId}/assign-courier`, {
      method: 'POST',
      body: JSON.stringify({ courierId }),
    }),
  
  updateStatus: (orderId: string, status: string) =>
    apiRequest(`/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};

