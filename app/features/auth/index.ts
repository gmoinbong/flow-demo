export {
  useAuth,
  useLogin,
  useRegister,
  useLogout,
  useRefreshToken,
} from './lib/use-auth';
export { useRequireOnboarding } from './lib/use-require-onboarding';
export { LoginForm } from './ui/login-form';
export { SignupForm } from './ui/signup-form';
export { UserMenu } from './ui/user-menu';
export {
  login,
  register,
  logoutUser,
  getCurrentUserFromApi,
  refreshAccessToken,
  updateUserRole,
} from './lib/auth-api';
export { getOnboardingRedirect, needsOnboarding } from './lib/onboarding-utils';
export type { User, UserRole, ClaimedProfile } from '@/app/types';
export type {
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
} from './lib/auth-api';
