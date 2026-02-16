
import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2, Save, X, MapPin } from 'lucide-react';
import { addressesApi } from '../../services';
import type { AddressFormData } from '../../services/addressesApi';
import toast from 'react-hot-toast';
import LocationPicker from './LocationPicker';

interface AddressFormProps {
    initialData?: AddressFormData & { id?: string };
    onSuccess: () => void;
    onCancel: () => void;
}

const AddressForm = ({ initialData, onSuccess, onCancel }: AddressFormProps) => {
    const [submitting, setSubmitting] = useState(false);
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<AddressFormData>({
        defaultValues: initialData || {
            fullName: '',
            phone: '',
            type: 'Home',
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'India',
            isDefault: false
        }
    });

    const onSubmit = async (data: AddressFormData) => {
        setSubmitting(true);
        try {
            if (initialData?.id) {
                await addressesApi.updateAddress(initialData.id, data);
                toast.success('Address updated successfully');
            } else {
                await addressesApi.createAddress(data);
                toast.success('Address added successfully');
            }
            onSuccess();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to save address');
        } finally {
            setSubmitting(false);
        }
    };

    const handleLocationSelect = useCallback((location: any) => {
        if (location.address) {
            if (location.address.street) setValue('street', location.address.street, { shouldValidate: true, shouldDirty: true });
            if (location.address.city) setValue('city', location.address.city, { shouldValidate: true, shouldDirty: true });
            if (location.address.state) setValue('state', location.address.state, { shouldValidate: true, shouldDirty: true });
            if (location.address.zipCode) setValue('zipCode', location.address.zipCode, { shouldValidate: true, shouldDirty: true });
        }
    }, [setValue]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary-500" />
                    {initialData?.id ? 'Edit Address' : 'Add New Address'}
                </h3>
                <button type="button" onClick={onCancel} className="text-gray-400 hover:text-white">
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <LocationPicker onLocationSelect={handleLocationSelect} />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                    <input
                        {...register('fullName', { required: 'Full Name is required' })}
                        className="input-field w-full"
                        placeholder="John Doe"
                    />
                    {errors.fullName && <p className="form-error">{errors.fullName.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Phone Number</label>
                    <input
                        {...register('phone', { required: 'Phone is required', pattern: { value: /^\d{10}$/, message: 'Invalid phone number' } })}
                        className="input-field w-full"
                        placeholder="9876543210"
                    />
                    {errors.phone && <p className="form-error">{errors.phone.message}</p>}
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-400 mb-1">Street Address</label>
                    <input
                        {...register('street', { required: 'Street is required' })}
                        className="input-field w-full"
                        placeholder="123 Main St, Apartment 4B"
                    />
                    {errors.street && <p className="form-error">{errors.street.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">City</label>
                    <input
                        {...register('city', { required: 'City is required' })}
                        className="input-field w-full"
                        placeholder="Mumbai"
                    />
                    {errors.city && <p className="form-error">{errors.city.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">State</label>
                    <input
                        {...register('state', { required: 'State is required' })}
                        className="input-field w-full"
                        placeholder="Maharashtra"
                    />
                    {errors.state && <p className="form-error">{errors.state.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Zip Code</label>
                    <input
                        {...register('zipCode', { required: 'Zip Code is required', pattern: { value: /^\d{6}$/, message: 'Invalid Zip Code' } })}
                        className="input-field w-full"
                        placeholder="400001"
                    />
                    {errors.zipCode && <p className="form-error">{errors.zipCode.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Address Type</label>
                    <select {...register('type')} className="input-field w-full">
                        <option value="Home">Home</option>
                        <option value="Work">Work</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
            </div>

            <div className="flex items-center gap-2 mt-2">
                <input
                    type="checkbox"
                    id="isDefault"
                    {...register('isDefault')}
                    className="w-4 h-4 rounded border-gray-600 bg-dark-700 text-primary-500 focus:ring-primary-500"
                />
                <label htmlFor="isDefault" className="text-sm text-gray-300 select-none cursor-pointer">Set as default address</label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-dark-600">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-dark-600 transition-colors bg-transparent border border-dark-600"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary flex items-center gap-2"
                >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Address
                </button>
            </div>
        </form>
    );
};

export default AddressForm;
