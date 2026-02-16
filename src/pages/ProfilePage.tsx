// =====================================================
// PROFILE PAGE
// Migrated from: PHP profile.php
// =====================================================

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Lock, Eye, EyeOff, Loader2, Save, MapPin } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { api } from '../services';
import toast from 'react-hot-toast';
import AddressBook from '../components/profile/AddressBook';

const profileSchema = z.object({
  fullname: z.string().min(1, 'Full name is required').max(100),
  email: z.string().email('Please enter a valid email'),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'Password must have at least 6 characters'),
  confirmNewPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: 'Passwords do not match',
  path: ['confirmNewPassword'],
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

const ProfilePage = () => {
  const { user, setUser } = useAuthStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses'>('profile');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'addresses' || tab === 'profile') {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tab: 'profile' | 'addresses') => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // ... (forms setup stays the same)
  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullname: user?.fullname || '',
      email: user?.email || '',
    },
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const handleProfileSubmit = async (data: ProfileFormData) => {
    // ... (same as before)
    setIsProfileLoading(true);
    try {
      const response = await api.put('/users/profile', data);
      setUser(response.data.data);
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (data: PasswordFormData) => {
    // ... (same as before)
    setIsPasswordLoading(true);
    try {
      await api.patch('/users/password', data);
      passwordForm.reset();
      toast.success('Password changed successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setIsPasswordLoading(false);
    }
  };

  return (
    <div className="container py-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-white mb-8">My Account</h1>

      {/* Tabs */}
      <div className="flex items-center gap-4 mb-8 border-b border-dark-600">
        <button
          onClick={() => handleTabChange('profile')}
          className={`pb-4 px-2 font-medium transition-colors relative ${activeTab === 'profile' ? 'text-primary-500' : 'text-gray-400 hover:text-white'
            }`}
        >
          <div className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile & Security
          </div>
          {activeTab === 'profile' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 rounded-t-full" />
          )}
        </button>

        <button
          onClick={() => handleTabChange('addresses')}
          className={`pb-4 px-2 font-medium transition-colors relative ${activeTab === 'addresses' ? 'text-primary-500' : 'text-gray-400 hover:text-white'
            }`}
        >
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Address Book
          </div>
          {activeTab === 'addresses' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 rounded-t-full" />
          )}
        </button>
      </div>

      {activeTab === 'profile' ? (
        <div className="grid lg:grid-cols-2 gap-8 animate-slide-up">
          {/* Profile Information */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-primary-500" />
              Profile Information
            </h2>

            <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)} className="space-y-4">
              <div>
                <label htmlFor="fullname" className="form-label">
                  Full Name
                </label>
                <input
                  id="fullname"
                  type="text"
                  className={`input-field ${profileForm.formState.errors.fullname ? 'border-red-500' : ''}`}
                  {...profileForm.register('fullname')}
                />
                {profileForm.formState.errors.fullname && (
                  <p className="form-error">{profileForm.formState.errors.fullname.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  className={`input-field ${profileForm.formState.errors.email ? 'border-red-500' : ''}`}
                  {...profileForm.register('email')}
                />
                {profileForm.formState.errors.email && (
                  <p className="form-error">{profileForm.formState.errors.email.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isProfileLoading}
                className="btn-primary"
              >
                {isProfileLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Change Password */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary-500" />
              Change Password
            </h2>

            <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="form-label">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    id="currentPassword"
                    type={showCurrentPassword ? 'text' : 'password'}
                    className={`input-field pr-12 ${passwordForm.formState.errors.currentPassword ? 'border-red-500' : ''}`}
                    {...passwordForm.register('currentPassword')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {passwordForm.formState.errors.currentPassword && (
                  <p className="form-error">{passwordForm.formState.errors.currentPassword.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="newPassword" className="form-label">
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    className={`input-field pr-12 ${passwordForm.formState.errors.newPassword ? 'border-red-500' : ''}`}
                    {...passwordForm.register('newPassword')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {passwordForm.formState.errors.newPassword && (
                  <p className="form-error">{passwordForm.formState.errors.newPassword.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmNewPassword" className="form-label">
                  Confirm New Password
                </label>
                <input
                  id="confirmNewPassword"
                  type="password"
                  className={`input-field ${passwordForm.formState.errors.confirmNewPassword ? 'border-red-500' : ''}`}
                  {...passwordForm.register('confirmNewPassword')}
                />
                {passwordForm.formState.errors.confirmNewPassword && (
                  <p className="form-error">{passwordForm.formState.errors.confirmNewPassword.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isPasswordLoading}
                className="btn-primary"
              >
                {isPasswordLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Change Password
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <AddressBook />
      )}
    </div>
  );
};

export default ProfilePage;
