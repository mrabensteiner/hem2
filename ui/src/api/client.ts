const BASE_URL = 'http://localhost:3000';

interface RequestOptions extends RequestInit {
  body?: any;
}

export enum Method {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE'
}

export async function apiClient(endpoint: string, method = Method.GET, options: RequestOptions = {}) {
  const url = `${BASE_URL}/${endpoint.replace(/^\//, '')}`;

  if (options.body && typeof options.body === 'object') {
    options.body = JSON.stringify(options.body);
    options.method = method;
    options.headers = {
      'Content-Type': 'application/json'
    };
  }

  const token = localStorage.getItem('auth_token');
  if (token) {
    options.headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    };
  }

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      switch (response.status) {
        case 401:
          throw new Error('User session has expired.');
        case 403:
          throw new Error('No rights for this action.');
        case 404:
          throw new Error('No data found.');
        case 500:
          throw new Error('A server error has occurred.');
        default:
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `An error has occurred (Status ${response.status}).`);
      }
    }

    return await response.json();
  } catch (error: any) {
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Server is not reachable.');
    }
    throw error;
  }
}
