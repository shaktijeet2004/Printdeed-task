import { useDesign } from '../../context/DesignContext';

const headingLevels = [
    { label: 'Add Heading', fontSize: 32, fontWeight: 700, tag: 'H1' },
    { label: 'Add Subheading', fontSize: 22, fontWeight: 600, tag: 'H2' },
    { label: 'Add Body Text', fontSize: 16, fontWeight: 400, tag: 'P' },
    { label: 'Add Small Text', fontSize: 12, fontWeight: 400, tag: 'SM' },
    { label: 'Add Caption', fontSize: 10, fontWeight: 300, tag: 'CAP' },
];

const fontPresets = [
    { name: 'Bold Impact', fontFamily: 'Inter', fontWeight: 800, fontSize: 28, style: 'uppercase', color: '#1a1a2e' },
    { name: 'Elegant', fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 24, style: 'italic', color: '#2d2d44' },
    { name: 'Modern', fontFamily: 'Inter', fontWeight: 300, fontSize: 20, style: 'normal', color: '#4a4a5a' },
    { name: 'Typewriter', fontFamily: 'Courier New, monospace', fontWeight: 400, fontSize: 18, style: 'normal', color: '#333' },
    { name: 'Clean Sans', fontFamily: 'Inter', fontWeight: 500, fontSize: 22, style: 'normal', color: '#222' },
    { name: 'Artistic', fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: 26, style: 'normal', color: '#6c5ce7' },
    { name: 'Handwritten', fontFamily: 'Trebuchet MS, sans-serif', fontWeight: 400, fontSize: 22, style: 'italic', color: '#e17055' },
    { name: 'Minimal', fontFamily: 'Arial, sans-serif', fontWeight: 300, fontSize: 18, style: 'normal', color: '#636e72' },
    { name: 'Display', fontFamily: 'Verdana, sans-serif', fontWeight: 700, fontSize: 30, style: 'uppercase', color: '#0984e3' },
    { name: 'Classic', fontFamily: 'Times New Roman, serif', fontWeight: 400, fontSize: 22, style: 'normal', color: '#2d3436' },
    { name: 'Neon', fontFamily: 'Inter', fontWeight: 600, fontSize: 24, style: 'normal', color: '#00cec9' },
    { name: 'Retro', fontFamily: 'Courier New, monospace', fontWeight: 700, fontSize: 20, style: 'uppercase', color: '#fd79a8' },
    { name: 'Headlines', fontFamily: 'Inter', fontWeight: 800, fontSize: 36, style: 'uppercase', color: '#d63031' },
    { name: 'Soft', fontFamily: 'Georgia, serif', fontWeight: 300, fontSize: 20, style: 'italic', color: '#a29bfe' },
    { name: 'Technical', fontFamily: 'Courier New, monospace', fontWeight: 500, fontSize: 16, style: 'normal', color: '#00b894' },
    { name: 'Poster', fontFamily: 'Verdana, sans-serif', fontWeight: 800, fontSize: 32, style: 'normal', color: '#e84393' },
];

export default function TextPanel() {
    const { addElement } = useDesign();

    const addText = (level) => {
        addElement({
            type: 'text',
            x: 100 + Math.random() * 100,
            y: 100 + Math.random() * 100,
            width: 300,
            height: level.fontSize + 20,
            content: level.label === 'Add Heading' ? 'Your Heading'
                : level.label === 'Add Subheading' ? 'Your Subheading'
                    : level.label === 'Add Body Text' ? 'Start typing your body text here...'
                        : level.label === 'Add Caption' ? 'Photo caption'
                            : 'Small text',
            fontSize: level.fontSize,
            fontWeight: level.fontWeight,
            fontFamily: 'Inter, sans-serif',
            fontStyle: 'normal',
            color: '#000000',
            textTransform: 'none',
        });
    };

    const addPreset = (preset) => {
        addElement({
            type: 'text',
            x: 80 + Math.random() * 120,
            y: 80 + Math.random() * 120,
            width: 320,
            height: preset.fontSize + 20,
            content: preset.name,
            fontSize: preset.fontSize,
            fontWeight: preset.fontWeight,
            fontFamily: preset.fontFamily,
            fontStyle: preset.style === 'italic' ? 'italic' : 'normal',
            color: preset.color,
            textTransform: preset.style === 'uppercase' ? 'uppercase' : 'none',
        });
    };

    return (
        <>
            <div className="panel-header">
                <h3>Text</h3>
            </div>
            <div className="panel-content">
                <div className="text-add-section">
                    {headingLevels.map((level) => (
                        <button key={level.tag} className="text-add-btn" onClick={() => addText(level)}>
                            <div className="icon">{level.tag}</div>
                            <span className="preview-text" style={{ fontSize: Math.min(level.fontSize * 0.55, 18), fontWeight: level.fontWeight }}>
                                {level.label}
                            </span>
                        </button>
                    ))}
                </div>

                <div className="panel-section-title">Font Presets ({fontPresets.length})</div>
                <div className="font-presets-grid">
                    {fontPresets.map((preset) => (
                        <button
                            key={preset.name}
                            className="font-preset"
                            onClick={() => addPreset(preset)}
                            style={{
                                fontFamily: preset.fontFamily,
                                fontWeight: preset.fontWeight,
                                fontStyle: preset.style === 'italic' ? 'italic' : 'normal',
                                textTransform: preset.style === 'uppercase' ? 'uppercase' : 'none',
                                fontSize: 13,
                                color: preset.color,
                            }}
                        >
                            {preset.name}
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
}
