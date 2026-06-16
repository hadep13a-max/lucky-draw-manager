import { useSyncExternalStore } from "react";

type AuthState = {
  isAuthenticated: boolean;
};

const KEY = "exam-draw-auth-v1";

const seed: AuthState = {
  isAuthenticated: false,
};

function load(): AuthState {
  if (typeof window === "undefined") return seed;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seed;
    return JSON.parse(raw) as AuthState;
  } catch {
    return seed;
  }
}

let state: AuthState = load();
const listeners = new Set<() => void>();

function persist() {
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(state));
  }
  listeners.forEach((l) => l());
}

function setState(next: Partial<AuthState>) {
  state = { ...state, ...next };
  persist();
}

export const authStore = {
  getState: () => state,
  subscribe: (l: () => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  login: (u: string, p: string) => {
    if (u === "admin" && p === "admin123") {
      setState({ isAuthenticated: true });
      return true;
    }
    return false;
  },
  logout: () => {
    setState({ isAuthenticated: false });
  },
};

export function useAuthStore<T>(selector: (s: AuthState) => T): T {
  return useSyncExternalStore(
    authStore.subscribe,
    () => selector(state),
    () => selector(seed),
  );
}
