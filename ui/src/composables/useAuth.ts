import {computed, ref} from 'vue';
import {apiClient, Method} from "@/api/client.ts";
import {useToast} from "@/composables/useToast.ts";

const user = ref<any>(null);
const privileges = ref<string[]>([]);
const token = ref<string | null>(localStorage.getItem('auth_token'));

export function useAuth() {
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const { pushToast } = useToast();

  const isAuthenticated = computed(() => {
    if (!token.value) {
      return false;
    } else if (user.value == null) {
      fetchCurrentUser().then(() => {
        return true;
      });
    }
    return true;
  });

  const hasPrivilege = computed(() => {
    return (id: string) => {
      if (!isAuthenticated.value || privileges.value.length == 0) return false;
      return privileges.value.includes(id);
    }
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

      const role = data.user.role;
      privileges.value = Object.keys(role).filter(key => role[key] === true);
      setTheme();

      return data;
    } catch (err: any) {
      pushToast(err.message, "error");
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

      const role = data.user.role;
      privileges.value = Object.keys(role).filter(key => role[key] === true);
      setTheme();
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

  function setTheme() {
    document.body.dataset.theme = user.value.colorScheme;
  }

  return { user, token, isAuthenticated, hasPrivilege, isLoading, error, login, logout };
}
