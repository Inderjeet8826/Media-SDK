import React, { useState } from 'react';
import { useMedia } from '@headless-media/react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
  const { client, apiKey } = useMedia();
  const [inputKey, setInputKey] = useState(apiKey || '');
  const [mockMode, setMockMode] = useState(client.isMockMode());

  if (!isOpen) return null;

  const handleSave = () => {
    client.setApiKey(inputKey.trim() || undefined);
    client.setMockMode(mockMode);
    client.clearCache();
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          SDK Configuration & Pexels Key
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          Configure live Pexels API connectivity or use the built-in offline mock engine.
        </p>

        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
            Pexels API Key
          </label>
          <input
            type="password"
            placeholder="Enter your Pexels API Key..."
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            style={{
              width: '100%',
              padding: '0.65rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              color: '#fff',
              outline: 'none',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.9rem',
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <input
            type="checkbox"
            id="mock-mode-checkbox"
            checked={mockMode}
            onChange={(e) => setMockMode(e.target.checked)}
            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
          />
          <label htmlFor="mock-mode-checkbox" style={{ fontSize: '0.875rem', cursor: 'pointer' }}>
            Force Offline Mock Engine (Ideal for testing without rate limits)
          </label>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleSave}>
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
