import { useState } from 'react';
import { useDesign } from '../context/DesignContext';
import { useTheme } from '../context/ThemeContext';
import TemplateSizeModal from './TemplateSizeModal';
import KeyboardShortcutsModal from './KeyboardShortcutsModal';

export default function TopBar() {
    const { zoom, setZoom, undo, redo, historyIndex, history, stageRef, canvasWidth, canvasHeight, elements, backgroundColor, backgroundImage, nextId, loadProject } = useDesign();
    const { theme, toggleTheme } = useTheme();
    const [showTemplateModal, setShowTemplateModal] = useState(false);
    const [showShortcuts, setShowShortcuts] = useState(false);


    const handleDownload = () => {
        const stage = stageRef?.current;
        if (!stage) return;
        try {
            const prevSX = stage.scaleX(), prevSY = stage.scaleY();
            const prevW = stage.width(), prevH = stage.height();
            stage.scaleX(2); stage.scaleY(2);
            stage.width(canvasWidth * 2); stage.height(canvasHeight * 2);
            stage.draw();
            const dataURL = stage.toDataURL({ mimeType: 'image/png' });
            const link = document.createElement('a');
            link.download = 'design.png';
            link.href = dataURL;
            link.click();
            stage.scaleX(prevSX); stage.scaleY(prevSY);
            stage.width(prevW); stage.height(prevH);
            stage.draw();
        } catch (err) { console.error('Export failed:', err); }
    };

    const handleSave = () => {
        const data = {
            version: 1,
            canvasWidth,
            canvasHeight,
            backgroundColor,
            backgroundImage,
            nextId,
            elements: elements.map(({ ...el }) => {
                // Remove runtime-only fields if any
                return el;
            }),
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const link = document.createElement('a');
        link.download = 'design-project.json';
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(link.href);
    };

    const handleLoad = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                try {
                    const data = JSON.parse(ev.target.result);
                    loadProject(data);
                } catch (err) { console.error('Load failed:', err); }
            };
            reader.readAsText(file);
        };
        input.click();
    };

    return (
        <>
            <div className="topbar">
                <div className="topbar-left">
                    <div className="topbar-logo">
                        <div className="logo-icon">D</div>
                        DesignEditor
                    </div>
                    <button className="btn btn-icon" onClick={() => setShowTemplateModal(true)} title="Canvas Size">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <line x1="3" y1="12" x2="21" y2="12" />
                            <line x1="12" y1="3" x2="12" y2="21" />
                        </svg>
                    </button>
                    <span className="canvas-size-label">{canvasWidth}×{canvasHeight}</span>
                </div>

                <div className="topbar-center">
                    <button className="btn btn-icon" onClick={() => setZoom(zoom - 10)} title="Zoom Out">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="8" y1="11" x2="14" y2="11" />
                        </svg>
                    </button>
                    <span className="zoom-display">{zoom}%</span>
                    <button className="btn btn-icon" onClick={() => setZoom(zoom + 10)} title="Zoom In">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" />
                        </svg>
                    </button>
                    <div className="topbar-divider" />
                    <button className="btn btn-icon" onClick={undo} disabled={historyIndex <= 0} title="Undo (Ctrl+Z)">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                        </svg>
                    </button>
                    <button className="btn btn-icon" onClick={redo} disabled={historyIndex >= history.length - 1} title="Redo (Ctrl+Y)">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.13-9.36L23 10" />
                        </svg>
                    </button>
                </div>

                <div className="topbar-right">
                    <button className="btn btn-icon" onClick={() => setShowShortcuts(true)} title="Keyboard Shortcuts">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                    </button>
                    <button className="btn btn-icon theme-toggle" onClick={toggleTheme} title={theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}>
                        {theme === 'dark' ? (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                                <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                            </svg>
                        ) : (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                            </svg>
                        )}
                    </button>
                    <div className="topbar-divider" />
                    <button className="btn btn-secondary" onClick={handleLoad} title="Load Project">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        Load
                    </button>
                    <button className="btn btn-secondary" onClick={handleSave} title="Save Project">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" />
                        </svg>
                        Save
                    </button>
                    <button className="btn btn-primary" onClick={handleDownload}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        Export PNG
                    </button>
                </div>
            </div>

            <TemplateSizeModal isOpen={showTemplateModal} onClose={() => setShowTemplateModal(false)} />
            <KeyboardShortcutsModal isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />
        </>
    );
}
