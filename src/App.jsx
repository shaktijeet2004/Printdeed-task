import { useState } from 'react';
import { DesignProvider } from './context/DesignContext';
import TopBar from './components/TopBar';
import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import TextPanel from './components/panels/TextPanel';
import QuickEditPanel from './components/panels/QuickEditPanel';
import ElementsPanel from './components/panels/ElementsPanel';
import UploadsPanel from './components/panels/UploadsPanel';
import BackgroundPanel from './components/panels/BackgroundPanel';

const panelComponents = {
  text: TextPanel,
  quickedit: QuickEditPanel,
  elements: ElementsPanel,
  uploads: UploadsPanel,
  background: BackgroundPanel,
};

function AppContent() {
  const [activeTab, setActiveTab] = useState('text');

  const PanelComponent = activeTab ? panelComponents[activeTab] : null;

  return (
    <div className="app-layout">
      <TopBar />
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className={`side-panel ${!activeTab ? 'collapsed' : ''}`}>
        {PanelComponent && <PanelComponent />}
      </div>
      <Canvas />
    </div>
  );
}

export default function App() {
  return (
    <DesignProvider>
      <AppContent />
    </DesignProvider>
  );
}
