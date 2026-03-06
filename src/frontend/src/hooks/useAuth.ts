import { useInternetIdentity } from "./useInternetIdentity";

export function useAuth() {
  const {
    identity,
    login,
    clear,
    loginStatus,
    isInitializing,
    isLoggingIn,
    isLoginSuccess,
    isLoginError,
  } = useInternetIdentity();

  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();
  const principal = identity?.getPrincipal().toString() ?? null;

  return {
    identity,
    isAuthenticated,
    principal,
    login,
    logout: clear,
    loginStatus,
    isInitializing,
    isLoggingIn,
    isLoginSuccess,
    isLoginError,
  };
}
