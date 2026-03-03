import { useDesign } from '../context/DesignContext';
import html2canvas from 'html2canvas';

export default function TopBar() {
    const { zoom, setZoom, undo, redo, historyIndex, history } = useDesign();

    const handleDownload = async () => {
        const canvas = document.getElementById('design-canvas');
        if (!canvas) return;
        try {
            const rendered = await html2canvas(canvas, {
                backgroundColor: null,
                scale: 2,
                useCORS: true,
            });
            const link = document.createElement('a');
            link.download = 'design.png';
            link.href = rendered.toDataURL('image/png');
            link.click();
        } catch (err) {
            console.error('Export failed:', err);
        }
    };

    return (
        <div className="topbar">
            <div className="topbar-left">
                <div className="topbar-logo">
                    <div className="logo-icon">D</div>
                    DesignEditor
                </div>
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
                <button className="btn btn-icon" onClick={undo} disabled={historyIndex <= 0} title="Undo">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                    </svg>
                </button>
                <button className="btn btn-icon" onClick={redo} disabled={historyIndex >= history.length - 1} title="Redo">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.13-9.36L23 10" />
                    </svg>
                </button>
            </div>

            <div className="topbar-right">
                <button className="btn btn-primary" onClick={handleDownload}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Download
                </button>
            </div>
        </div>
    );
}
