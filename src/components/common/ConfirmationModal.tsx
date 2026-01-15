// =====================================================
// CONFIRMATION MODAL COMPONENT
// specific for delete actions and warnings
// =====================================================

import { AlertTriangle, X, Loader2 } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning';
  loading?: boolean;
}

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  variant = 'danger',
  loading = false,
}: ConfirmationModalProps) => {
  if (!isOpen) return null;

  const colors = {
    danger: {
      icon: 'text-red-500',
      bg: 'bg-red-500/10',
      button: 'bg-red-500 hover:bg-red-600 text-white',
    },
    warning: {
      icon: 'text-yellow-500',
      bg: 'bg-yellow-500/10',
      button: 'bg-yellow-500 hover:bg-yellow-600 text-black',
    },
  };

  const theme = colors[variant];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-dark-800 rounded-xl w-full max-w-sm border border-dark-600 shadow-xl transform transition-all scale-100">
        <div className="p-6 text-center">
          <div className={`w-12 h-12 rounded-full ${theme.bg} flex items-center justify-center mx-auto mb-4`}>
            <AlertTriangle className={`w-6 h-6 ${theme.icon}`} />
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <p className="text-gray-400 mb-6">{message}</p>

          <div className="flex gap-3 justify-center">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-dark-600 transition-colors font-medium border border-dark-600"
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className={`px-4 py-2 rounded-lg font-medium transition-colors min-w-[100px] flex items-center justify-center ${theme.button}`}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
