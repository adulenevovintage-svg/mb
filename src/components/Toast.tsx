import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, XCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type, isVisible, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, duration]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 50, x: '-50%' }}
          className="fixed bottom-12 left-1/2 z-[200] flex items-center gap-4 px-6 py-4 bg-ink border border-white/10 rounded-2xl shadow-2xl min-w-[320px]"
        >
          {type === 'success' ? (
            <CheckCircle className="w-6 h-6 text-emerald-500" />
          ) : (
            <XCircle className="w-6 h-6 text-red-500" />
          )}
          <p className="text-sm font-medium text-paper flex-1">{message}</p>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/5 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-paper/20" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
