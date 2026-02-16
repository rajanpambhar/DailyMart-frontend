// =====================================================
// SIGNUP PAGE
// Migrated from: PHP signup.php
// =====================================================

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Loader2, UserPlus } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import toast from 'react-hot-toast';

const signupSchema = z.object({
  fullname: z.string().min(1, 'Please enter your full name').max(100),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must have at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type SignupFormData = z.infer<typeof signupSchema>;

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register: registerUser } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    try {
      await registerUser(data);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card p-8 animate-scale-in bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl max-w-md w-full mx-auto relative overflow-hidden">
      {/* Decorative inner glow */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-primary-500/10 rounded-full blur-[60px] -z-10" />
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-secondary-500/10 rounded-full blur-[60px] -z-10" />

      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">Create Account</h1>
        <p className="text-gray-400 font-light">Join DailyMart today</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Full Name Field */}
        <div>
          <label htmlFor="fullname" className="form-label text-gray-300">
            Full Name
          </label>
          <input
            id="fullname"
            type="text"
            autoComplete="name"
            placeholder="Enter your full name"
            className={`w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 transition-all ${errors.fullname ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/50' : ''}`}
            {...register('fullname')}
          />
          {errors.fullname && (
            <p className="form-error text-red-300 mt-1 text-sm">{errors.fullname.message}</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="form-label text-gray-300">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="Enter your email"
            className={`w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 transition-all ${errors.email ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/50' : ''}`}
            {...register('email')}
          />
          {errors.email && (
            <p className="form-error text-red-300 mt-1 text-sm">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="form-label text-gray-300">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Create a password (min 6 chars)"
              className={`w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 transition-all ${errors.password ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/50' : ''}`}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-2"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="form-error text-red-300 mt-1 text-sm">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div>
          <label htmlFor="confirmPassword" className="form-label text-gray-300">
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Confirm your password"
              className={`w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 transition-all ${errors.confirmPassword ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/50' : ''}`}
              {...register('confirmPassword')}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-2"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="form-error text-red-300 mt-1 text-sm">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full bg-primary-600 hover:bg-primary-500 text-white font-semibold py-3 rounded-xl shadow-[0_0_20px_rgba(51,204,255,0.3)] hover:shadow-[0_0_25px_rgba(51,204,255,0.5)] transition-all duration-300 border border-primary-500/30 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <UserPlus className="w-5 h-5" />
              Create Account
            </>
          )}
        </button>
      </form>

      {/* Sign In Link */}
      <p className="text-center text-gray-400 mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default SignupPage;
