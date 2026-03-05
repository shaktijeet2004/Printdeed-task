import { useDesign } from '../../context/DesignContext';

const EyeIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
);
const EyeOffIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
);
const LockIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);
const UnlockIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 9.9-1" />
    </svg>
);
const TrashIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
);
const ChevronUp = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="18 15 12 9 6 15" />
    </svg>
);
const ChevronDown = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9" />
    </svg>
);

export default function LayersPanel() {
    const {
        elements, selectedId, selectElement, toggleVisibility,
        toggleLock, reorderElements, deleteElement,
    } = useDesign();

    // Show top layer first (reversed z-order)
    const layers = [...elements].reverse();

    const moveLayer = (id, direction) => {
        const idx = elements.findIndex((el) => el.id === id);
        if (idx === -1) return;
        const newElements = [...elements];
        // "up" in the layers panel = higher z-index = move forward in array
        const targetIdx = direction === 'up' ? idx + 1 : idx - 1;
        if (targetIdx < 0 || targetIdx >= newElements.length) return;
        [newElements[idx], newElements[targetIdx]] = [newElements[targetIdx], newElements[idx]];
        reorderElements(newElements);
    };

    const getElementLabel = (el) => {
        if (el.type === 'text') return el.content?.slice(0, 18) || 'Text';
        if (el.type === 'image') return 'Image';
        if (el.type === 'shape') {
            const name = el.shapeType || 'shape';
            return name.charAt(0).toUpperCase() + name.slice(1);
        }
        return 'Element';
    };

    const getTypeIcon = (el) => {
        if (el.type === 'text') return (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <polyline points="4 7 4 4 20 4 20 7" /><line x1="9" y1="20" x2="15" y2="20" /><line x1="12" y1="4" x2="12" y2="20" />
            </svg>
        );
        if (el.type === 'image') return (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
            </svg>
        );
        return (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
            </svg>
        );
    };

    return (
        <>
            <div className="panel-header">
                <h3>Layers</h3>
                <span className="panel-badge">{elements.length}</span>
            </div>
            <div className="panel-content">
                {layers.length === 0 ? (
                    <div className="empty-state">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                            <polygon points="12 2 2 7 12 12 22 7 12 2" />
                            <polyline points="2 17 12 22 22 17" />
                            <polyline points="2 12 12 17 22 12" />
                        </svg>
                        <p>No layers yet.<br />Add elements to see them here.</p>
                    </div>
                ) : (
                    <div className="layers-list">
                        {layers.map((el, idx) => (
                            <div
                                key={el.id}
                                className={`layer-item ${selectedId === el.id ? 'active' : ''} ${!el.visible ? 'hidden-layer' : ''} ${el.locked ? 'locked-layer' : ''}`}
                                onClick={() => selectElement(el.id)}
                            >
                                {/* Color dot + icon */}
                                <div
                                    className="layer-color-dot"
                                    style={{ background: el.fill || el.color || '#6c5ce7' }}
                                />
                                <div className="layer-type-icon">
                                    {getTypeIcon(el)}
                                </div>
                                <span className="layer-name">{getElementLabel(el)}</span>

                                {/* Always-visible controls */}
                                <div className="layer-controls">
                                    <button
                                        className={`layer-ctrl-btn ${!el.visible ? 'off' : ''}`}
                                        onClick={(e) => { e.stopPropagation(); toggleVisibility(el.id); }}
                                        title={el.visible ? 'Hide' : 'Show'}
                                    >
                                        {el.visible ? <EyeIcon /> : <EyeOffIcon />}
                                    </button>
                                    <button
                                        className={`layer-ctrl-btn ${el.locked ? 'on' : ''}`}
                                        onClick={(e) => { e.stopPropagation(); toggleLock(el.id); }}
                                        title={el.locked ? 'Unlock' : 'Lock'}
                                    >
                                        {el.locked ? <LockIcon /> : <UnlockIcon />}
                                    </button>
                                </div>

                                {/* Hover actions */}
                                <div className="layer-hover-actions">
                                    <button
                                        className="layer-ctrl-btn"
                                        onClick={(e) => { e.stopPropagation(); moveLayer(el.id, 'up'); }}
                                        title="Bring Forward"
                                        disabled={idx === 0}
                                    >
                                        <ChevronUp />
                                    </button>
                                    <button
                                        className="layer-ctrl-btn"
                                        onClick={(e) => { e.stopPropagation(); moveLayer(el.id, 'down'); }}
                                        title="Send Backward"
                                        disabled={idx === layers.length - 1}
                                    >
                                        <ChevronDown />
                                    </button>
                                    <button
                                        className="layer-ctrl-btn danger"
                                        onClick={(e) => { e.stopPropagation(); deleteElement(el.id); }}
                                        title="Delete"
                                    >
                                        <TrashIcon />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
