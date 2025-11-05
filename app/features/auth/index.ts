// Public API for auth feature
export { useAuth, useLogin, useLogout, useIsAuthenticated } from './lib/use-auth';
export { LoginForm } from './ui/login-form';
export { SignupForm } from './ui/signup-form';
export {
  getCurrentUser,
  setCurrentUser,
  logout,
  isAuthenticated,
  requireAuth,
} from './lib/auth-api';
export type { User, UserRole } from '@/app/types';

