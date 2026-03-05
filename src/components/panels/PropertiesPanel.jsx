import { useDesign } from '../../context/DesignContext';

export default function PropertiesPanel() {
    const { elements, selectedId, updateElement, deleteElement, duplicateElement } = useDesign();
    const selected = elements.find((el) => el.id === selectedId);

    if (!selected) {
        return (
            <>
                <div className="panel-header">
                    <h3>Properties</h3>
                </div>
                <div className="panel-content">
                    <div className="empty-state">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                            <circle cx="12" cy="12" r="3" />
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                        </svg>
                        <p>Select an element to edit its properties.</p>
                    </div>
                </div>
            </>
        );
    }

    const update = (updates) => updateElement(selectedId, updates);

    return (
        <>
            <div className="panel-header">
                <h3>Properties</h3>
            </div>
            <div className="panel-content">
                {/* Position & Size */}
                <div className="props-section">
                    <div className="panel-section-title">Position & Size</div>
                    <div className="props-grid">
                        <div className="prop-field">
                            <label>X</label>
                            <input type="number" value={Math.round(selected.x || 0)} onChange={(e) => update({ x: +e.target.value })} />
                        </div>
                        <div className="prop-field">
                            <label>Y</label>
                            <input type="number" value={Math.round(selected.y || 0)} onChange={(e) => update({ y: +e.target.value })} />
                        </div>
                        <div className="prop-field">
                            <label>W</label>
                            <input type="number" value={Math.round(selected.width || 0)} onChange={(e) => update({ width: Math.max(5, +e.target.value) })} />
                        </div>
                        <div className="prop-field">
                            <label>H</label>
                            <input type="number" value={Math.round(selected.height || 0)} onChange={(e) => update({ height: Math.max(5, +e.target.value) })} />
                        </div>
                    </div>
                    <div className="props-grid" style={{ marginTop: 8 }}>
                        <div className="prop-field">
                            <label>Rotation</label>
                            <input type="number" value={Math.round(selected.rotation || 0)} onChange={(e) => update({ rotation: +e.target.value })} />
                        </div>
                    </div>
                </div>

                {/* Opacity */}
                <div className="props-section">
                    <div className="panel-section-title">Opacity</div>
                    <div className="opacity-control">
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={Math.round((selected.opacity ?? 1) * 100)}
                            onChange={(e) => update({ opacity: +e.target.value / 100 })}
                            className="opacity-slider"
                        />
                        <span className="opacity-value">{Math.round((selected.opacity ?? 1) * 100)}%</span>
                    </div>
                </div>

                {/* Color (shape) */}
                {selected.type === 'shape' && (
                    <div className="props-section">
                        <div className="panel-section-title">Fill Color</div>
                        <div className="color-picker-row">
                            <input
                                type="color"
                                className="color-picker-input"
                                value={selected.fill || '#6c5ce7'}
                                onChange={(e) => update({ fill: e.target.value })}
                            />
                            <span className="color-picker-label">{selected.fill || '#6c5ce7'}</span>
                        </div>
                    </div>
                )}

                {/* Text Properties */}
                {selected.type === 'text' && (
                    <>
                        <div className="props-section">
                            <div className="panel-section-title">Text Color</div>
                            <div className="color-picker-row">
                                <input
                                    type="color"
                                    className="color-picker-input"
                                    value={selected.color || '#000000'}
                                    onChange={(e) => update({ color: e.target.value })}
                                />
                                <span className="color-picker-label">{selected.color || '#000000'}</span>
                            </div>
                        </div>
                        <div className="props-section">
                            <div className="panel-section-title">Font</div>
                            <div className="props-grid">
                                <div className="prop-field">
                                    <label>Size</label>
                                    <input type="number" value={selected.fontSize || 16} min={8} max={200} onChange={(e) => update({ fontSize: +e.target.value })} />
                                </div>
                                <div className="prop-field">
                                    <label>Weight</label>
                                    <select value={selected.fontWeight || 400} onChange={(e) => update({ fontWeight: +e.target.value })}>
                                        <option value={300}>Light</option>
                                        <option value={400}>Regular</option>
                                        <option value={500}>Medium</option>
                                        <option value={600}>Semi Bold</option>
                                        <option value={700}>Bold</option>
                                        <option value={800}>Extra Bold</option>
                                    </select>
                                </div>
                            </div>
                            <div className="prop-field" style={{ marginTop: 8 }}>
                                <label>Font Family</label>
                                <select value={selected.fontFamily || 'Inter, sans-serif'} onChange={(e) => update({ fontFamily: e.target.value })}>
                                    <option value="Inter, sans-serif">Inter</option>
                                    <option value="Georgia, serif">Georgia</option>
                                    <option value="Courier New, monospace">Courier New</option>
                                    <option value="Arial, sans-serif">Arial</option>
                                    <option value="Times New Roman, serif">Times New Roman</option>
                                    <option value="Verdana, sans-serif">Verdana</option>
                                    <option value="Trebuchet MS, sans-serif">Trebuchet MS</option>
                                    <option value="Palatino, serif">Palatino</option>
                                </select>
                            </div>
                        </div>
                    </>
                )}

                {/* Actions */}
                <div className="props-section">
                    <div className="panel-section-title">Actions</div>
                    <div className="props-actions">
                        <button className="btn btn-secondary" onClick={() => duplicateElement(selectedId)} style={{ flex: 1 }}>
                            ⧉ Duplicate
                        </button>
                        <button className="btn btn-danger" onClick={() => deleteElement(selectedId)} style={{ flex: 1 }}>
                            ✕ Delete
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
