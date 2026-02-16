
import api from './api';

export interface Address {
    id: string;
    userId: string;
    type: string;
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefault: boolean;
    createdAt: string;
}

export type AddressFormData = Omit<Address, 'id' | 'userId' | 'createdAt' | 'country'> & { country?: string };

export const getAddresses = async (): Promise<Address[]> => {
    const response = await api.get('/addresses');
    return response.data;
};

export const createAddress = async (data: AddressFormData): Promise<Address> => {
    const response = await api.post('/addresses', data);
    return response.data;
};

export const updateAddress = async (id: string, data: Partial<AddressFormData>): Promise<Address> => {
    const response = await api.put(`/addresses/${id}`, data);
    return response.data;
};

export const deleteAddress = async (id: string): Promise<void> => {
    await api.delete(`/addresses/${id}`);
};

export default {
    getAddresses,
    createAddress,
    updateAddress,
    deleteAddress
}
