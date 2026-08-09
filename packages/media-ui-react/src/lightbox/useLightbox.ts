import { useCallback, useEffect, useRef } from 'react';

export interface UseLightboxOptions {
  isOpen: boolean;
  onClose?: () => void;
  activeIndex: number;
  totalItems: number;
  onIndexChange?: (newIndex: number) => void;
  loop?: boolean;
  closeOnEscape?: boolean;
  closeOnBackdropClick?: boolean;
}

export interface UseLightboxReturn {
  hasNext: boolean;
  hasPrev: boolean;
  next: () => void;
  prev: () => void;
  close: () => void;
  modalRef: React.RefObject<HTMLDivElement>;
  getModalProps: () => Record<string, any>;
  getBackdropProps: () => Record<string, any>;
  getPrevButtonProps: () => Record<string, any>;
  getNextButtonProps: () => Record<string, any>;
  getCloseButtonProps: () => Record<string, any>;
}

export function useLightbox({
  isOpen,
  onClose,
  activeIndex,
  totalItems,
  onIndexChange,
  loop = false,
  closeOnEscape = true,
  closeOnBackdropClick = true,
}: UseLightboxOptions): UseLightboxReturn {
  const modalRef = useRef<HTMLDivElement>(null);
  const prevActiveElementRef = useRef<HTMLElement | null>(null);

  const hasNext = loop ? totalItems > 1 : activeIndex < totalItems - 1;
  const hasPrev = loop ? totalItems > 1 : activeIndex > 0;

  const next = useCallback(() => {
    if (!onIndexChange || totalItems <= 0) return;
    if (activeIndex < totalItems - 1) {
      onIndexChange(activeIndex + 1);
    } else if (loop) {
      onIndexChange(0);
    }
  }, [activeIndex, totalItems, onIndexChange, loop]);

  const prev = useCallback(() => {
    if (!onIndexChange || totalItems <= 0) return;
    if (activeIndex > 0) {
      onIndexChange(activeIndex - 1);
    } else if (loop) {
      onIndexChange(totalItems - 1);
    }
  }, [activeIndex, totalItems, onIndexChange, loop]);

  const close = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  // Handle keyboard events (Escape, Left, Right)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === 'Escape') {
        e.preventDefault();
        close();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        next();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeOnEscape, close, next, prev]);

  // Focus trap & body scroll lock
  useEffect(() => {
    if (isOpen) {
      prevActiveElementRef.current = document.activeElement as HTMLElement | null;
      if (modalRef.current) {
        modalRef.current.focus();
      }

      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = originalOverflow;
        if (prevActiveElementRef.current && typeof prevActiveElementRef.current.focus === 'function') {
          prevActiveElementRef.current.focus();
        }
      };
    }
  }, [isOpen]);

  const getModalProps = useCallback(
    () => ({
      ref: modalRef,
      role: 'dialog',
      'aria-modal': 'true',
      'aria-label': 'Media Lightbox',
      tabIndex: -1,
      style: {
        outline: 'none',
      },
    }),
    []
  );

  const getBackdropProps = useCallback(
    () => ({
      onClick: (e: React.MouseEvent) => {
        if (e.target === e.currentTarget && closeOnBackdropClick) {
          close();
        }
      },
    }),
    [close, closeOnBackdropClick]
  );

  const getPrevButtonProps = useCallback(
    () => ({
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation();
        prev();
      },
      disabled: !hasPrev,
      'aria-label': 'Previous image',
    }),
    [prev, hasPrev]
  );

  const getNextButtonProps = useCallback(
    () => ({
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation();
        next();
      },
      disabled: !hasNext,
      'aria-label': 'Next image',
    }),
    [next, hasNext]
  );

  const getCloseButtonProps = useCallback(
    () => ({
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation();
        close();
      },
      'aria-label': 'Close lightbox',
    }),
    [close]
  );

  return {
    hasNext,
    hasPrev,
    next,
    prev,
    close,
    modalRef,
    getModalProps,
    getBackdropProps,
    getPrevButtonProps,
    getNextButtonProps,
    getCloseButtonProps,
  };
}
