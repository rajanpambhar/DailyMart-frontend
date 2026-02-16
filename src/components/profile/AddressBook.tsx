
import { useState, useEffect } from 'react';
import { Plus, MapPin, Edit2, Trash2, Home, Briefcase, Loader2 } from 'lucide-react';
import { addressesApi } from '../../services';
import type { Address } from '../../services/addressesApi';
import AddressForm from './AddressForm';
import ConfirmationModal from '../common/ConfirmationModal';
import toast from 'react-hot-toast';

const AddressBook = () => {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | undefined>(undefined);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const fetchAddresses = async () => {
        setLoading(true);
        try {
            const data = await addressesApi.getAddresses();
            setAddresses(data);
        } catch (error) {
            console.error('Failed to fetch addresses', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    const handleEdit = (address: Address) => {
        setEditingAddress(address);
        setShowForm(true);
    };

    const handleDeleteClick = (id: string) => {
        setDeleteId(id);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            await addressesApi.deleteAddress(deleteId);
            setAddresses(addresses.filter(a => a.id !== deleteId));
            toast.success('Address deleted successfully');
        } catch (error) {
            toast.error('Failed to delete address');
        } finally {
            setDeleteId(null);
        }
    };

    const handleFormSuccess = () => {
        setShowForm(false);
        setEditingAddress(undefined);
        fetchAddresses();
    };

    const handleFormCancel = () => {
        setShowForm(false);
        setEditingAddress(undefined);
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'Home': return <Home className="w-5 h-5 text-primary-500" />;
            case 'Work': return <Briefcase className="w-5 h-5 text-secondary-500" />;
            default: return <MapPin className="w-5 h-5 text-gray-400" />;
        }
    };

    if (showForm) {
        return (
            <div className="glass-card p-6 border border-dark-600">
                <AddressForm
                    initialData={editingAddress}
                    onSuccess={handleFormSuccess}
                    onCancel={handleFormCancel}
                />
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Address Book</h2>
                <button
                    onClick={() => setShowForm(true)}
                    className="btn-primary flex items-center gap-2 text-sm py-2"
                >
                    <Plus className="w-4 h-4" />
                    Add New Address
                </button>
            </div>

            {addresses.length === 0 ? (
                <div className="text-center py-12 bg-dark-700/30 rounded-xl border border-dashed border-dark-600">
                    <MapPin className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">No Addresses Found</h3>
                    <p className="text-gray-400 mb-6">You haven't added any shipping addresses yet.</p>
                    <button
                        onClick={() => setShowForm(true)}
                        className="text-primary-400 hover:text-primary-300 font-semibold"
                    >
                        Add your first address
                    </button>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {addresses.map((addr) => (
                        <div key={addr.id} className={`glass-card p-5 border ${addr.isDefault ? 'border-primary-500/50 bg-primary-500/5' : 'border-dark-600'} hover:border-dark-500 transition-colors group relative`}>
                            {addr.isDefault && (
                                <div className="absolute top-4 right-4 text-xs font-semibold text-primary-500 bg-primary-500/10 px-2 py-1 rounded">
                                    Default
                                </div>
                            )}

                            <div className="flex items-start gap-4 mb-4">
                                <div className="p-2 bg-dark-600 rounded-lg shrink-0">
                                    {getIcon(addr.type)}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-semibold text-white">{addr.type}</h3>
                                    </div>
                                    <p className="text-gray-300 font-medium">{addr.fullName}</p>
                                    <p className="text-sm text-gray-400 mt-1">{addr.phone}</p>
                                </div>
                            </div>

                            <div className="text-sm text-gray-400 mb-4 pl-[52px] min-h-[40px]">
                                <p>{addr.street}</p>
                                <p>{addr.city}, {addr.state} - {addr.zipCode}</p>
                            </div>

                            <div className="flex justify-end gap-2 pt-4 border-t border-dark-600/50">
                                <button
                                    onClick={() => handleEdit(addr)}
                                    className="p-2 text-gray-400 hover:text-white hover:bg-dark-600 rounded-lg transition-colors"
                                    title="Edit Address"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDeleteClick(addr.id)}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                    title="Delete Address"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <ConfirmationModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={confirmDelete}
                title="Delete Address"
                message="Are you sure you want to delete this address?"
                confirmLabel="Delete"
                variant="danger"
            />
        </div>
    );
};

export default AddressBook;
