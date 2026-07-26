import {computed, ref} from 'vue';
import {apiClient, Method} from "@/api/client.ts";

const user = ref<any>(null);
const token = ref<string | null>(localStorage.getItem('auth_token'));

export function useAuth() {
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => {
    if (!token.value) {
      return false;
    } else if (user.value == null) {
      fetchCurrentUser();
    }
    return true;
  });

  async function login(credentials: { username: string; password: string}) {
    isLoading.value = true;
    error.value = null;
    try {
      const data = await apiClient('auth/login', Method.POST, {
        body: credentials
      });

      localStorage.setItem('auth_token', data.token);
      token.value = data.token;
      user.value = data.user;

      return data;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchCurrentUser() {
    if (!token.value) return null;

    try {
      const data = await apiClient('auth/me');
      user.value = data.user;
    } catch (err) {
      logout();
    }
  }

  function logout() {
    localStorage.removeItem('auth_token');
    token.value = null;
    user.value = null;
    window.location.href = '/login';
  }

  return { user, token, isAuthenticated, isLoading, error, login, logout };
}
