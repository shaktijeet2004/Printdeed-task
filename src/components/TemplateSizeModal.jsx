import { useState } from 'react';
import { useDesign } from '../context/DesignContext';

const templates = [
    // Social Media
    { name: 'Instagram Post', width: 1080, height: 1080, icon: '📸', category: 'Social' },
    { name: 'Instagram Story', width: 1080, height: 1920, icon: '📱', category: 'Social' },
    { name: 'Instagram Reel Cover', width: 1080, height: 1920, icon: '🎬', category: 'Social' },
    { name: 'Facebook Post', width: 1200, height: 630, icon: '👍', category: 'Social' },
    { name: 'Facebook Cover', width: 820, height: 312, icon: '🖼', category: 'Social' },
    { name: 'X / Twitter Post', width: 1600, height: 900, icon: '✖', category: 'Social' },
    { name: 'X / Twitter Header', width: 1500, height: 500, icon: '✖', category: 'Social' },
    { name: 'LinkedIn Banner', width: 1584, height: 396, icon: '💼', category: 'Social' },
    { name: 'LinkedIn Post', width: 1200, height: 627, icon: '💼', category: 'Social' },
    { name: 'Pinterest Pin', width: 1000, height: 1500, icon: '📌', category: 'Social' },
    { name: 'YouTube Thumbnail', width: 1280, height: 720, icon: '▶️', category: 'Video' },
    { name: 'YouTube Banner', width: 2560, height: 1440, icon: '▶️', category: 'Video' },

    // Presentation & Screen
    { name: 'Presentation 16:9', width: 1920, height: 1080, icon: '🖥', category: 'Screen' },
    { name: 'Presentation 4:3', width: 1024, height: 768, icon: '🖥', category: 'Screen' },
    { name: 'Desktop Wallpaper', width: 1920, height: 1080, icon: '🖥', category: 'Screen' },
    { name: 'Mobile Wallpaper', width: 1080, height: 2340, icon: '📱', category: 'Screen' },

    // Print (300 DPI)
    { name: 'A4 Portrait (300dpi)', width: 2480, height: 3508, icon: '📄', category: 'Print' },
    { name: 'A4 Landscape (300dpi)', width: 3508, height: 2480, icon: '📄', category: 'Print' },
    { name: 'A5 Portrait (300dpi)', width: 1748, height: 2480, icon: '📄', category: 'Print' },
    { name: 'Letter Portrait', width: 2550, height: 3300, icon: '📄', category: 'Print' },
    { name: 'Business Card', width: 1050, height: 600, icon: '💳', category: 'Print' },
    { name: 'Poster 18×24 (150dpi)', width: 2700, height: 3600, icon: '📋', category: 'Print' },
    { name: 'Flyer (A5)', width: 1748, height: 2480, icon: '🗞️', category: 'Print' },

    // Logo & Misc
    { name: 'Logo Square', width: 500, height: 500, icon: '✏️', category: 'Misc' },
    { name: 'Logo Wide', width: 1200, height: 400, icon: '✏️', category: 'Misc' },
    { name: 'Email Header', width: 600, height: 200, icon: '✉️', category: 'Misc' },
    { name: 'Zoom Background', width: 1920, height: 1080, icon: '🎥', category: 'Misc' },
];

const categories = ['Social', 'Video', 'Screen', 'Print', 'Misc'];

export default function TemplateSizeModal({ isOpen, onClose }) {
    const { canvasWidth, canvasHeight, setCanvasSize } = useDesign();
    const [customW, setCustomW] = useState(canvasWidth);
    const [customH, setCustomH] = useState(canvasHeight);
    const [activeCategory, setActiveCategory] = useState('Social');

    if (!isOpen) return null;

    const filteredTemplates = templates.filter(t => t.category === activeCategory);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content modal-wide" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Canvas Size</h2>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>

                <div className="modal-body">
                    <div className="current-size">
                        Current: <strong>{canvasWidth} × {canvasHeight}px</strong>
                    </div>

                    {/* Custom size */}
                    <div className="custom-size-row">
                        <div className="prop-field">
                            <label>Width</label>
                            <input type="number" value={customW} min={100} max={8000} onChange={(e) => setCustomW(+e.target.value)} />
                        </div>
                        <span className="size-x">×</span>
                        <div className="prop-field">
                            <label>Height</label>
                            <input type="number" value={customH} min={100} max={8000} onChange={(e) => setCustomH(+e.target.value)} />
                        </div>
                        <button className="btn btn-primary" onClick={() => { setCanvasSize(customW, customH); onClose(); }}>
                            Apply
                        </button>
                    </div>

                    {/* Category tabs */}
                    <div className="template-categories">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                className={`template-cat-btn ${activeCategory === cat ? 'active' : ''}`}
                                onClick={() => setActiveCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="template-grid">
                        {filteredTemplates.map((t) => (
                            <button
                                key={t.name}
                                className={`template-item ${canvasWidth === t.width && canvasHeight === t.height ? 'active' : ''}`}
                                onClick={() => { setCanvasSize(t.width, t.height); onClose(); }}
                            >
                                <span className="template-icon">{t.icon}</span>
                                <span className="template-name">{t.name}</span>
                                <span className="template-size">{t.width}×{t.height}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
