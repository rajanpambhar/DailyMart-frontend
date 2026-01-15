// =====================================================
// FORGOT PASSWORD PAGE
// Placeholder for password recovery
// =====================================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Mail, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const forgotSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotFormData = z.infer<typeof forgotSchema>;

const ForgotPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormData>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotFormData) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setIsSubmitted(true);
    toast.success('Password reset email sent!');
  };

  if (isSubmitted) {
    return (
      <div className="glass-card p-8 animate-scale-in text-center">
        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail className="w-8 h-8 text-green-400" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Check Your Email</h1>
        <p className="text-gray-400 mb-6">
          We've sent password reset instructions to your email address.
        </p>
        <Link to="/login" className="btn-primary w-full">
          <ArrowLeft className="w-5 h-5" />
          Back to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="glass-card p-8 animate-scale-in">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Forgot Password?</h1>
        <p className="text-gray-400">Enter your email to reset your password</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email Field */}
        <div>
          <label htmlFor="email" className="form-label">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="Enter your email"
            className={`input-field ${errors.email ? 'border-red-500' : ''}`}
            {...register('email')}
          />
          {errors.email && (
            <p className="form-error">{errors.email.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Mail className="w-5 h-5" />
              Send Reset Link
            </>
          )}
        </button>
      </form>

      {/* Back to Login */}
      <p className="text-center text-gray-400 mt-6">
        <Link to="/login" className="text-primary-500 hover:text-primary-400 font-medium inline-flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>
      </p>
    </div>
  );
};

export default ForgotPasswordPage;
