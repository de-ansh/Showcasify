import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';

export default function ForgotPasswordPage() {
  return (
    <div className="h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <ForgotPasswordForm />
      </div>
    </div>
  );
} 