import React, { ReactNode } from 'react';
import { BaseComponentProps } from '../types';
import { useLightbox, UseLightboxOptions } from './useLightbox';

export interface LightboxRenderHelpers {
  close: () => void;
  next: () => void;
  prev: () => void;
  hasNext: boolean;
  hasPrev: boolean;
  currentIndex: number;
  totalCount: number;
}

export interface LightboxProps<TItem> extends BaseComponentProps, Omit<UseLightboxOptions, 'totalItems'> {
  items: TItem[];
  renderItem: (item: TItem, index: number, helpers: LightboxRenderHelpers) => ReactNode;
  renderOverlay?: (helpers: LightboxRenderHelpers) => ReactNode;
}

export function Lightbox<TItem>({
  items,
  isOpen,
  onClose,
  activeIndex,
  onIndexChange,
  loop = false,
  closeOnEscape = true,
  closeOnBackdropClick = true,
  renderItem,
  renderOverlay,
  className,
  style,
  id,
}: LightboxProps<TItem>) {
  const {
    hasNext,
    hasPrev,
    next,
    prev,
    close,
    getModalProps,
    getBackdropProps,
    getPrevButtonProps,
    getNextButtonProps,
    getCloseButtonProps,
  } = useLightbox({
    isOpen,
    onClose,
    activeIndex,
    totalItems: items.length,
    onIndexChange,
    loop,
    closeOnEscape,
    closeOnBackdropClick,
  });

  if (!isOpen || items.length === 0 || activeIndex < 0 || activeIndex >= items.length) {
    return null;
  }

  const currentItem = items[activeIndex];
  const helpers: LightboxRenderHelpers = {
    close,
    next,
    prev,
    hasNext,
    hasPrev,
    currentIndex: activeIndex,
    totalCount: items.length,
  };

  const defaultBackdropStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    ...style,
  };

  return (
    <div
      {...getBackdropProps()}
      id={id}
      className={className}
      style={defaultBackdropStyle}
    >
      <div {...getModalProps()} style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {renderItem(currentItem, activeIndex, helpers)}
        {renderOverlay && renderOverlay(helpers)}
      </div>
    </div>
  );
}
