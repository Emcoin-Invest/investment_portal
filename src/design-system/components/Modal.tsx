'use client';

import React from 'react';
import clsx from 'clsx';
import { X } from 'lucide-react';
import Button from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeButton?: boolean;
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  closeButton = true,
}) => {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={clsx(
          'relative bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto w-full mx-4',
          sizeClasses[size]
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-neutral-200">
          <div>
            {title && <h2 className="text-lg font-semibold text-neutral-900">{title}</h2>}
            {description && <p className="text-sm text-neutral-600 mt-1">{description}</p>}
          </div>
          {closeButton && (
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-neutral-600 transition-colors flex-shrink-0"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="p-6">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="p-6 border-t border-neutral-200 flex gap-3 justify-end">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
