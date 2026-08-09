import React, { useState } from 'react';
import { MediaProvider } from '@headless-media/react';
import { PhotoView } from './components/PhotoView';
import { CuratedView } from './components/CuratedView';
import { VideoReelsView } from './components/VideoReelsView';
import { ArchitectureView } from './components/ArchitectureView';
import { EventDrawer } from './components/EventDrawer';
import { ApiKeyModal } from './components/ApiKeyModal';

type TabType = 'photos' | 'curated' | 'reels' | 'architecture';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('photos');
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <header className="app-header">
        <div className="brand-section">
          <span className="brand-badge">SDK</span>
          <div>
            <div className="brand-title">Headless Media Ecosystem</div>
            <div className="brand-subtitle">Strict Boundary Architecture Showcase</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="nav-tabs" role="tablist">
          <button
            className={`nav-tab ${activeTab === 'photos' ? 'active' : ''}`}
            onClick={() => setActiveTab('photos')}
            role="tab"
            aria-selected={activeTab === 'photos'}
          >
            📷 Photo Search
          </button>
          <button
            className={`nav-tab ${activeTab === 'curated' ? 'active' : ''}`}
            onClick={() => setActiveTab('curated')}
            role="tab"
            aria-selected={activeTab === 'curated'}
          >
            ✨ Curated Feed
          </button>
          <button
            className={`nav-tab ${activeTab === 'reels' ? 'active' : ''}`}
            onClick={() => setActiveTab('reels')}
            role="tab"
            aria-selected={activeTab === 'reels'}
          >
            🎬 Video Reels
          </button>
          <button
            className={`nav-tab ${activeTab === 'architecture' ? 'active' : ''}`}
            onClick={() => setActiveTab('architecture')}
            role="tab"
            aria-selected={activeTab === 'architecture'}
          >
            🏛️ Architecture & Cache
          </button>
        </nav>

        {/* Header Controls */}
        <div className="header-actions">
          <div className="status-badge">
            <span className="status-dot" />
            <span>Ready</span>
          </div>

          <button
            className="btn-secondary"
            onClick={() => setIsApiKeyModalOpen(true)}
            aria-label="Configure API Key"
          >
            ⚙️ API & Mode
          </button>
        </div>
      </header>

      {/* Main View Area */}
      <main className="main-content">
        {activeTab === 'photos' && <PhotoView />}
        {activeTab === 'curated' && <CuratedView />}
        {activeTab === 'reels' && <VideoReelsView />}
        {activeTab === 'architecture' && <ArchitectureView />}
      </main>

      {/* Persistent Live Event Inspector */}
      <EventDrawer />

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
      />
    </div>
  );
};

export function App() {
  return (
    <MediaProvider
      config={{
        mockMode: true, // Default to rich mock mode for flawless out-of-the-box local testing
        enableLogging: true,
      }}
    >
      <AppContent />
    </MediaProvider>
  );
}

export default App;
