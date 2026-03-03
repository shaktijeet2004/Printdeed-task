import { useRef } from 'react';
import { useDesign } from '../../context/DesignContext';

const colorPalette = [
    '#ffffff', '#f8f9fa', '#e9ecef', '#dee2e6', '#ced4da',
    '#ff6b6b', '#ee5a24', '#fd79a8', '#e84393', '#d63031',
    '#fdcb6e', '#ffeaa7', '#f9ca24', '#f0932b', '#e17055',
    '#00b894', '#00cec9', '#55efc4', '#81ecec', '#badc58',
    '#0984e3', '#74b9ff', '#a29bfe', '#6c5ce7', '#3742fa',
    '#2d3436', '#636e72', '#b2bec3', '#dfe6e9', '#000000',
];

export default function BackgroundPanel() {
    const { backgroundColor, setBackgroundColor, backgroundImage, setBackgroundImage, removeBackground } = useDesign();
    const bgFileRef = useRef(null);

    const handleBgUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file || !file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            setBackgroundImage(ev.target.result);
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    };

    return (
        <>
            <div className="panel-header">
                <h3>Background</h3>
            </div>
            <div className="panel-content">
                <div className="bg-section">
                    <div className="panel-section-title">Custom Color</div>
                    <div className="color-picker-row">
                        <input
                            type="color"
                            className="color-picker-input"
                            value={backgroundColor}
                            onChange={(e) => setBackgroundColor(e.target.value)}
                        />
                        <span className="color-picker-label">Pick any color</span>
                    </div>
                </div>

                <div className="bg-section">
                    <div className="panel-section-title">Preset Colors</div>
                    <div className="color-grid">
                        {colorPalette.map((color) => (
                            <button
                                key={color}
                                className={`color-swatch ${backgroundColor === color && !backgroundImage ? 'active' : ''}`}
                                style={{ background: color }}
                                onClick={() => setBackgroundColor(color)}
                                title={color}
                            />
                        ))}
                    </div>
                </div>

                <div className="bg-section">
                    <div className="panel-section-title">Background Image</div>
                    <div className="bg-actions">
                        <input
                            ref={bgFileRef}
                            type="file"
                            accept="image/*"
                            onChange={handleBgUpload}
                            style={{ display: 'none' }}
                        />
                        <button className="btn btn-secondary" onClick={() => bgFileRef.current?.click()} style={{ width: '100%', justifyContent: 'center' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="17 8 12 3 7 8" />
                                <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                            Upload BG
                        </button>
                        <button className="btn btn-danger" onClick={removeBackground} style={{ width: '100%', justifyContent: 'center' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                            Remove BG
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
