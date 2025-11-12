export {
  useAuth,
  useLogin,
  useRegister,
  useLogout,
  useRefreshToken,
} from './lib/use-auth';
export { LoginForm } from './ui/login-form';
export { SignupForm } from './ui/signup-form';
export { UserMenu } from './ui/user-menu';
export {
  login,
  register,
  logoutUser,
  getCurrentUserFromApi,
  refreshAccessToken,
} from './lib/auth-api';
export type { User, UserRole, ClaimedProfile } from '@/app/types';
export type {
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
} from './lib/auth-api';
