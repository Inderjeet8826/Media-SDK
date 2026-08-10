import React, { useState, useEffect } from 'react';
import { MediaProvider } from '@headless-media/react';
import { PhotoView } from './components/PhotoView';
import { CuratedView } from './components/CuratedView';
import { VideoReelsView } from './components/VideoReelsView';
import { ArchitectureView } from './components/ArchitectureView';
import { SdkDocsView } from './components/SdkDocsView';
import { ComponentDocsView } from './components/ComponentDocsView';
import { EventDrawer } from './components/EventDrawer';
import { ApiKeyModal } from './components/ApiKeyModal';

export type TabType = 'photos' | 'curated' | 'reels' | 'architecture' | 'sdk-docs' | 'components-docs';

const AppContent: React.FC = () => {
  const getInitialTab = (): TabType => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      if (['photos', 'curated', 'reels', 'architecture', 'sdk-docs', 'components-docs'].includes(hash)) {
        return hash as TabType;
      }
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam && ['photos', 'curated', 'reels', 'architecture', 'sdk-docs', 'components-docs'].includes(tabParam)) {
        return tabParam as TabType;
      }
    }
    return 'photos';
  };

  const [activeTab, setActiveTab] = useState<TabType>(getInitialTab);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      window.location.hash = tab;
    }
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['photos', 'curated', 'reels', 'architecture', 'sdk-docs', 'components-docs'].includes(hash)) {
        setActiveTab(hash as TabType);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

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
        <nav className="nav-tabs" role="tablist" style={{ flexWrap: 'wrap' }}>
          <button
            className={`nav-tab ${activeTab === 'photos' ? 'active' : ''}`}
            onClick={() => handleTabChange('photos')}
            role="tab"
            aria-selected={activeTab === 'photos'}
          >
            📷 Photo Search
          </button>
          <button
            className={`nav-tab ${activeTab === 'curated' ? 'active' : ''}`}
            onClick={() => handleTabChange('curated')}
            role="tab"
            aria-selected={activeTab === 'curated'}
          >
            ✨ Curated Feed
          </button>
          <button
            className={`nav-tab ${activeTab === 'reels' ? 'active' : ''}`}
            onClick={() => handleTabChange('reels')}
            role="tab"
            aria-selected={activeTab === 'reels'}
          >
            🎬 Video Reels
          </button>
          <button
            className={`nav-tab ${activeTab === 'architecture' ? 'active' : ''}`}
            onClick={() => handleTabChange('architecture')}
            role="tab"
            aria-selected={activeTab === 'architecture'}
          >
            🏛️ Architecture & Cache
          </button>
          <button
            className={`nav-tab ${activeTab === 'sdk-docs' ? 'active' : ''}`}
            onClick={() => handleTabChange('sdk-docs')}
            role="tab"
            aria-selected={activeTab === 'sdk-docs'}
          >
            📖 SDK Docs
          </button>
          <button
            className={`nav-tab ${activeTab === 'components-docs' ? 'active' : ''}`}
            onClick={() => handleTabChange('components-docs')}
            role="tab"
            aria-selected={activeTab === 'components-docs'}
          >
            🧩 Component Docs
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
        {activeTab === 'sdk-docs' && <SdkDocsView />}
        {activeTab === 'components-docs' && <ComponentDocsView />}
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
