// frontend/src/components/UI/Modal.tsx
'use client';

import { X } from 'lucide-react';
import React, { ReactNode, useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    // Portal (Overlay) - Posição fixa para cobrir a tela inteira
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose} // Fecha ao clicar no overlay
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Container do Modal */}
      <div
        className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl shadow-green-500/10 p-6 animate-slide-up"
        onClick={(e) => e.stopPropagation()} // Impede de fechar ao clicar dentro
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 id="modal-title" className="text-xl font-bold text-white">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            aria-label="Fechar modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Conteúdo (Formulário) */}
        <div>{children}</div>
      </div>
    </div>
  );
}