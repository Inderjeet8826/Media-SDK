import React, { useState } from 'react';
import { useMediaEvents } from '@headless-media/react';

interface EventLogItem {
  id: string;
  type: 'view' | 'download' | 'search' | string;
  payload: any;
  timestamp: Date;
}

export const EventDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState<EventLogItem[]>([]);

  useMediaEvents({
    onView: (payload) => {
      setLogs((prev) => [
        {
          id: Math.random().toString(36).substring(2, 9),
          type: 'view',
          payload: { id: payload.item.id, type: payload.item.type, title: (payload.item as any).alt || (payload.item as any).photographer },
          timestamp: new Date(),
        },
        ...prev.slice(0, 49),
      ]);
    },
    onDownload: (payload) => {
      setLogs((prev) => [
        {
          id: Math.random().toString(36).substring(2, 9),
          type: 'download',
          payload: { id: payload.item.id, format: payload.format || 'original' },
          timestamp: new Date(),
        },
        ...prev.slice(0, 49),
      ]);
    },
    onSearch: (payload) => {
      setLogs((prev) => [
        {
          id: Math.random().toString(36).substring(2, 9),
          type: 'search',
          payload: { query: payload.query, mediaType: payload.mediaType },
          timestamp: new Date(),
        },
        ...prev.slice(0, 49),
      ]);
    },
  });

  return (
    <div className="event-inspector" style={{ transform: isOpen ? 'translateY(0)' : 'translateY(calc(100% - 42px))' }}>
      <div className="event-inspector-header" onClick={() => setIsOpen(!isOpen)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
          <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>SDK Event Stream</span>
          <span style={{ background: 'var(--bg-surface)', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.75rem' }}>
            {logs.length}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {logs.length > 0 && (
            <button
              style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textDecoration: 'underline' }}
              onClick={(e) => {
                e.stopPropagation();
                setLogs([]);
              }}
            >
              Clear
            </button>
          )}
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{isOpen ? '▼' : '▲'}</span>
        </div>
      </div>

      <div className="event-inspector-list">
        {logs.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '1.5rem 0' }}>
            No events emitted yet. Try searching, viewing photos in lightbox, or downloading.
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="event-entry">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className={`event-badge ${log.type}`}>{log.type}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                  {log.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <pre style={{ margin: 0, color: '#e2e8f0', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                {JSON.stringify(log.payload, null, 2)}
              </pre>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
