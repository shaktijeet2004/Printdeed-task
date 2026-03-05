import { useDesign } from '../../context/DesignContext';

const shapes = [
    { name: 'Rectangle', svg: <rect x="2" y="4" width="20" height="16" rx="2" />, shapeType: 'rectangle' },
    { name: 'Circle', svg: <circle cx="12" cy="12" r="10" />, shapeType: 'circle' },
    { name: 'Triangle', svg: <polygon points="12,2 22,22 2,22" />, shapeType: 'triangle' },
    { name: 'Star', svg: <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />, shapeType: 'star' },
    { name: 'Diamond', svg: <polygon points="12,2 22,12 12,22 2,12" />, shapeType: 'diamond' },
    { name: 'Hexagon', svg: <polygon points="12,2 21,7 21,17 12,22 3,17 3,7" />, shapeType: 'hexagon' },
    { name: 'Pentagon', svg: <polygon points="12,2 22,9 18.5,21 5.5,21 2,9" />, shapeType: 'pentagon' },
    { name: 'Arrow Right', svg: <polygon points="2,8 16,8 16,3 23,12 16,21 16,16 2,16" />, shapeType: 'arrow' },
    { name: 'Heart', svg: <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />, shapeType: 'heart' },
    { name: 'Cross', svg: <polygon points="8,0 16,0 16,8 24,8 24,16 16,16 16,24 8,24 8,16 0,16 0,8 8,8" />, shapeType: 'cross' },
    { name: 'Octagon', svg: <polygon points="7,2 17,2 22,7 22,17 17,22 7,22 2,17 2,7" />, shapeType: 'octagon' },
    { name: 'Parallelogram', svg: <polygon points="5,2 22,2 19,22 2,22" />, shapeType: 'parallelogram' },
    { name: 'Trapezoid', svg: <polygon points="6,4 18,4 22,20 2,20" />, shapeType: 'trapezoid' },
    { name: 'Lightning', svg: <polygon points="13,1 5,14 11,14 9,23 19,10 13,10" />, shapeType: 'lightning' },
    { name: 'Rounded Rect', svg: <rect x="2" y="2" width="20" height="20" rx="6" />, shapeType: 'roundedRect' },
    { name: 'Ring', svg: <><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="5" fill="#1a1a24" /></>, shapeType: 'ring' },
    { name: 'Pill', svg: <rect x="1" y="7" width="22" height="10" rx="5" />, shapeType: 'pill' },
    { name: 'Chevron', svg: <polygon points="4,2 14,12 4,22 8,22 18,12 8,2" />, shapeType: 'chevron' },
    { name: 'Shield', svg: <path d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" />, shapeType: 'shield' },
    { name: 'Tag', svg: <polygon points="1,4 1,11 12,22 20,14 9,3 9,3" />, shapeType: 'tag' },
    { name: 'Semicircle', svg: <path d="M2 16 A10 10 0 0 1 22 16 Z" />, shapeType: 'semicircle' },
];

const shapeColors = ['#6c5ce7', '#00cec9', '#fd79a8', '#fdcb6e', '#e17055', '#00b894', '#0984e3', '#e84393', '#636e72', '#a29bfe', '#fab1a0', '#55efc4'];

export default function ElementsPanel() {
    const { addElement } = useDesign();

    const addShape = (shape) => {
        const color = shapeColors[Math.floor(Math.random() * shapeColors.length)];
        addElement({
            type: 'shape',
            shapeType: shape.shapeType,
            x: 150 + Math.random() * 100,
            y: 150 + Math.random() * 100,
            width: 120,
            height: 120,
            fill: color,
            stroke: 'none',
            strokeWidth: 0,
        });
    };

    return (
        <>
            <div className="panel-header">
                <h3>Elements</h3>
            </div>
            <div className="panel-content">
                <div className="panel-section-title">Shapes ({shapes.length})</div>
                <div className="elements-grid">
                    {shapes.map((shape) => (
                        <button
                            key={shape.name}
                            className="element-item"
                            onClick={() => addShape(shape)}
                            title={shape.name}
                        >
                            <svg viewBox="0 0 24 24">{shape.svg}</svg>
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
}
